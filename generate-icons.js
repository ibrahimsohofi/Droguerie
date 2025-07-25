#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate PWA Icons from SVG using Canvas API
 * This script converts the SVG icon to multiple PNG sizes required for PWA
 */

// Required icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Shortcut icon sizes
const shortcutSizes = [96];

async function generateIcons() {
  console.log('🎨 Starting PWA icon generation...');

  try {
    // Check if sharp is available
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.log('📦 Installing sharp for image processing...');
      await installSharp();
      sharp = require('sharp');
    }

    const svgPath = path.join(__dirname, 'client/public/icons/icon-droguerie-512.svg');
    const iconsDir = path.join(__dirname, 'client/public/icons');

    if (!fs.existsSync(svgPath)) {
      console.error('❌ SVG source file not found:', svgPath);
      return;
    }

    console.log('📁 Creating icons directory...');
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Read SVG content
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate main app icons
    console.log('🔄 Generating main app icons...');
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    // Generate shortcut icons with different designs
    console.log('🔄 Generating shortcut icons...');
    await generateShortcutIcons(sharp, iconsDir);

    // Generate screenshots (placeholder for now)
    console.log('🔄 Generating screenshot placeholders...');
    await generateScreenshots(sharp, iconsDir);

    console.log('🎉 All icons generated successfully!');
    console.log('\n📋 Generated files:');

    // List all generated files
    const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.png'));
    files.forEach(file => console.log(`   ✓ ${file}`));

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

async function installSharp() {
  const { execSync } = require('child_process');
  try {
    console.log('Installing sharp...');
    execSync('npm install sharp', { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error('Failed to install sharp. Please run: npm install sharp');
    process.exit(1);
  }
}

async function generateShortcutIcons(sharp, iconsDir) {
  // Create shortcut icons with different colors/symbols
  const shortcuts = [
    { name: 'cleaning', color: '#10b981', symbol: '🧽' },
    { name: 'personal-care', color: '#ec4899', symbol: '🧴' },
    { name: 'cart', color: '#f59e0b', symbol: '🛒' },
    { name: 'contact', color: '#059669', symbol: '📞' }
  ];

  for (const shortcut of shortcuts) {
    const svgContent = createShortcutSVG(shortcut.color, shortcut.symbol);
    const outputPath = path.join(iconsDir, `shortcut-${shortcut.name}.png`);

    await sharp(Buffer.from(svgContent))
      .resize(96, 96)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated: shortcut-${shortcut.name}.png`);
  }
}

function createShortcutSVG(color, symbol) {
  return `
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48" cy="48" r="44" fill="${color}" stroke="#ffffff" stroke-width="4"/>
      <text x="48" y="58" font-size="32" text-anchor="middle" fill="#ffffff">${symbol}</text>
    </svg>
  `;
}

async function generateScreenshots(sharp, iconsDir) {
  const screenshotsDir = path.join(__dirname, 'client/public/screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Create placeholder screenshots
  const screenshots = [
    { name: 'desktop-home.png', width: 1280, height: 720 },
    { name: 'mobile-products.png', width: 390, height: 844 }
  ];

  for (const screenshot of screenshots) {
    const svgContent = createScreenshotPlaceholder(screenshot.width, screenshot.height, screenshot.name);
    const outputPath = path.join(screenshotsDir, screenshot.name);

    await sharp(Buffer.from(svgContent))
      .resize(screenshot.width, screenshot.height)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated: screenshots/${screenshot.name}`);
  }
}

function createScreenshotPlaceholder(width, height, name) {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#059669"/>
      <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="#ffffff">
        Droguerie Jamal - ${name}
      </text>
      <text x="50%" y="60%" font-size="16" text-anchor="middle" fill="#ffffff" opacity="0.8">
        ${width}x${height} Screenshot Placeholder
      </text>
    </svg>
  `;
}

// Run the script
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
