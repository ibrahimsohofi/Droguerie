/**
 * Currency formatting utilities for Droguerie Jamal
 * Supports Moroccan Dirham (MAD) with Arabic, French, and English localization
 */

const CURRENCY_CONFIG = {
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: {
      ar: 'درهم مغربي',
      fr: 'Dirham marocain',
      en: 'Moroccan Dirham'
    },
    decimal: 2,
    thousand: ' ',
    decimal_separator: {
      ar: '٫',  // Arabic decimal separator
      fr: ',',  // French decimal separator
      en: '.'   // English decimal separator
    },
    format: {
      ar: '{amount} {symbol}',     // 123.45 درهم
      fr: '{amount} {symbol}',     // 123,45 DH
      en: '{symbol} {amount}'      // DH 123.45
    }
  }
};

/**
 * Format price with Moroccan Dirham currency
 * @param {number|string} amount - The amount to format
 * @param {string} language - Language code (ar, fr, en)
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export function formatMAD(amount, language = 'ar', options = {}) {
  const {
    showSymbol = true,
    showCode = false,
    decimals = 2,
    useArabicNumerals = language === 'ar'
  } = options;

  // Convert to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return showSymbol ? `0 ${CURRENCY_CONFIG.MAD.symbol}` : '0';
  }

  const config = CURRENCY_CONFIG.MAD;
  const decimalSep = config.decimal_separator[language] || '.';

  // Format number with appropriate decimal places
  const formattedNumber = numAmount.toFixed(decimals);
  const [integerPart, decimalPart] = formattedNumber.split('.');

  // Add thousand separators
  const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousand);

  // Combine integer and decimal parts
  let finalAmount = integerWithSeparators;
  if (decimals > 0 && decimalPart && decimalPart !== '00') {
    finalAmount += decimalSep + decimalPart;
  }

  // Convert to Arabic numerals if needed
  if (useArabicNumerals) {
    finalAmount = convertToArabicNumerals(finalAmount);
  }

  // Apply currency symbol/code
  if (!showSymbol && !showCode) {
    return finalAmount;
  }

  const symbol = showCode ? config.code : config.symbol;
  const format = config.format[language] || config.format.en;

  return format
    .replace('{amount}', finalAmount)
    .replace('{symbol}', symbol);
}

/**
 * Convert Western numerals to Arabic numerals
 * @param {string} str - String with Western numerals
 * @returns {string} String with Arabic numerals
 */
export function convertToArabicNumerals(str) {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (match) => arabicNumerals[parseInt(match)]);
}

/**
 * Convert Arabic numerals to Western numerals
 * @param {string} str - String with Arabic numerals
 * @returns {string} String with Western numerals
 */
export function convertToWesternNumerals(str) {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[٠-٩]/g, (match) => arabicNumerals.indexOf(match).toString());
}

/**
 * Parse price string and return numeric value
 * @param {string} priceString - Price string in any format
 * @returns {number} Numeric value
 */
export function parsePrice(priceString) {
  if (typeof priceString === 'number') return priceString;

  // Convert Arabic numerals to Western
  const westernString = convertToWesternNumerals(priceString);

  // Remove currency symbols and extract numbers
  const cleanString = westernString
    .replace(/[^\d.,٫]/g, '') // Remove non-numeric except separators
    .replace(/٫/g, '.') // Replace Arabic decimal separator
    .replace(/,(?=\d{3})/g, '') // Remove thousand separators
    .replace(/,/g, '.'); // Convert comma decimal to dot

  return parseFloat(cleanString) || 0;
}

/**
 * Format price for display in product cards
 * @param {number} price - Price amount
 * @param {string} language - Language code
 * @returns {string} Formatted price
 */
export function formatProductPrice(price, language = 'ar') {
  return formatMAD(price, language, {
    decimals: price % 1 === 0 ? 0 : 2, // No decimals for whole numbers
    useArabicNumerals: language === 'ar'
  });
}

/**
 * Format price range for products with variants
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} language - Language code
 * @returns {string} Formatted price range
 */
export function formatPriceRange(minPrice, maxPrice, language = 'ar') {
  if (minPrice === maxPrice) {
    return formatProductPrice(minPrice, language);
  }

  const min = formatProductPrice(minPrice, language);
  const max = formatProductPrice(maxPrice, language);

  const separator = language === 'ar' ? ' - ' : ' - ';
  return `${min}${separator}${max}`;
}

/**
 * Calculate discount percentage and format
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @param {string} language - Language code
 * @returns {object} Discount information
 */
export function calculateDiscount(originalPrice, discountedPrice, language = 'ar') {
  const discount = originalPrice - discountedPrice;
  const percentage = Math.round((discount / originalPrice) * 100);

  const useArabicNumerals = language === 'ar';
  const discountText = {
    ar: `خصم ${useArabicNumerals ? convertToArabicNumerals(percentage.toString()) : percentage}%`,
    fr: `Remise ${percentage}%`,
    en: `${percentage}% Off`
  };

  return {
    amount: discount,
    percentage,
    formattedAmount: formatMAD(discount, language),
    formattedPercentage: discountText[language] || discountText.en,
    savings: {
      ar: `توفير ${formatMAD(discount, language)}`,
      fr: `Économie ${formatMAD(discount, language)}`,
      en: `Save ${formatMAD(discount, language)}`
    }[language]
  };
}

/**
 * Format price for specific contexts
 */
export const PriceFormatter = {
  // Cart total
  cart: (total, language = 'ar') => formatMAD(total, language, {
    decimals: 2,
    useArabicNumerals: language === 'ar'
  }),

  // Shipping cost
  shipping: (cost, language = 'ar') => {
    if (cost === 0) {
      return {
        ar: 'توصيل مجاني',
        fr: 'Livraison gratuite',
        en: 'Free shipping'
      }[language];
    }
    return formatMAD(cost, language);
  },

  // Tax amount
  tax: (amount, language = 'ar') => formatMAD(amount, language, {
    decimals: 2,
    showSymbol: true
  }),

  // Order total with tax
  orderTotal: (subtotal, tax, shipping, language = 'ar') => {
    const total = subtotal + tax + shipping;
    return formatMAD(total, language, {
      decimals: 2,
      useArabicNumerals: language === 'ar'
    });
  }
};

/**
 * Validation helpers for price inputs
 */
export const PriceValidation = {
  isValidPrice: (price) => {
    const num = typeof price === 'string' ? parsePrice(price) : price;
    return !isNaN(num) && num >= 0;
  },

  isInRange: (price, min = 0, max = Infinity) => {
    const num = typeof price === 'string' ? parsePrice(price) : price;
    return num >= min && num <= max;
  },

  formatForInput: (price, language = 'ar') => {
    // Format for form inputs (no symbols, proper decimal separator)
    const num = typeof price === 'string' ? parsePrice(price) : price;
    if (isNaN(num)) return '';

    const decimalSep = CURRENCY_CONFIG.MAD.decimal_separator[language] || '.';
    const formatted = num.toString().replace('.', decimalSep);

    return language === 'ar' ? convertToArabicNumerals(formatted) : formatted;
  }
};

// Default export for easy importing
export default {
  formatMAD,
  formatProductPrice,
  formatPriceRange,
  calculateDiscount,
  parsePrice,
  convertToArabicNumerals,
  convertToWesternNumerals,
  PriceFormatter,
  PriceValidation
};
