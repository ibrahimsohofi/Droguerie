import React, { useState, useEffect } from 'react';
import { Calculator, Home, Droplets, Clock, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const ProductUsageCalculator = ({ product, isOpen, onClose }) => {
  const [calculatorType, setCalculatorType] = useState('auto');
  const [inputs, setInputs] = useState({
    roomArea: '',
    wallHeight: '',
    doors: 2,
    windows: 2,
    coats: 2,
    loadSize: 'medium',
    frequency: 'daily',
    householdSize: 4,
    usageDuration: 30
  });
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (product) {
      determineCalculatorType();
    }
  }, [product]);

  useEffect(() => {
    calculateUsage();
  }, [inputs, calculatorType]);

  const determineCalculatorType = () => {
    const category = product.category?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || '';

    if (name.includes('paint') || category.includes('paint')) {
      setCalculatorType('paint');
    } else if (name.includes('detergent') || name.includes('washing') || category.includes('laundry')) {
      setCalculatorType('detergent');
    } else if (name.includes('cleaner') || name.includes('cleaning') || category.includes('cleaning')) {
      setCalculatorType('cleaner');
    } else if (name.includes('shampoo') || name.includes('soap') || category.includes('personal care')) {
      setCalculatorType('personal_care');
    } else if (name.includes('battery') || category.includes('batteries')) {
      setCalculatorType('batteries');
    } else {
      setCalculatorType('general');
    }
  };

  const calculateUsage = () => {
    if (!product) return;

    let calculation;
    switch (calculatorType) {
      case 'paint':
        calculation = calculatePaintUsage();
        break;
      case 'detergent':
        calculation = calculateDetergentUsage();
        break;
      case 'cleaner':
        calculation = calculateCleanerUsage();
        break;
      case 'personal_care':
        calculation = calculatePersonalCareUsage();
        break;
      case 'batteries':
        calculation = calculateBatteryUsage();
        break;
      default:
        calculation = calculateGeneralUsage();
    }

    setResults(calculation);
  };

  const calculatePaintUsage = () => {
    const area = parseFloat(inputs.roomArea) || 0;
    const height = parseFloat(inputs.wallHeight) || 2.5;
    const doors = parseInt(inputs.doors) || 2;
    const windows = parseInt(inputs.windows) || 2;
    const coats = parseInt(inputs.coats) || 2;

    const wallArea = (area * 4 * height) - (doors * 2) - (windows * 1.5); // Approximate calculation
    const coverage = product.coverage || 10; // m² per unit
    const unitsNeeded = Math.ceil((wallArea * coats) / coverage);

    return {
      type: 'Paint Coverage',
      primary: `${unitsNeeded} units needed`,
      details: [
        `Wall area to paint: ${wallArea.toFixed(1)} m²`,
        `With ${coats} coats: ${(wallArea * coats).toFixed(1)} m² total`,
        `Coverage per unit: ${coverage} m²`,
        `Recommended quantity: ${unitsNeeded} units`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Add 10% extra for touch-ups',
        'Consider primer for better coverage',
        'Different colors may require more coats'
      ]
    };
  };

  const calculateDetergentUsage = () => {
    const householdSize = parseInt(inputs.householdSize) || 4;
    const duration = parseInt(inputs.usageDuration) || 30;
    const loadSize = inputs.loadSize || 'medium';

    const loadsPerWeek = {
      small: householdSize * 1.5,
      medium: householdSize * 2,
      large: householdSize * 2.5
    }[loadSize];

    const totalLoads = (loadsPerWeek * duration) / 7;
    const usagePerLoad = 50; // grams per load
    const totalUsage = totalLoads * usagePerLoad / 1000; // Convert to kg
    const productSize = parseFloat(product.name.match(/(\d+)kg/)?.[1]) || 3; // Extract kg from name
    const unitsNeeded = Math.ceil(totalUsage / productSize);

    return {
      type: 'Detergent Usage',
      primary: `${unitsNeeded} packages needed`,
      details: [
        `Household size: ${householdSize} people`,
        `Loads per week: ${loadsPerWeek.toFixed(1)}`,
        `Total loads in ${duration} days: ${totalLoads.toFixed(0)}`,
        `Total detergent needed: ${totalUsage.toFixed(2)} kg`,
        `Package size: ${productSize} kg`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Use correct amount per load size',
        'Pre-treat stains for better results',
        'Store in cool, dry place'
      ]
    };
  };

  const calculateCleanerUsage = () => {
    const area = parseFloat(inputs.roomArea) || 50; // Total house area
    const frequency = inputs.frequency || 'weekly';
    const duration = parseInt(inputs.usageDuration) || 30;

    const usageFrequency = {
      daily: 365,
      weekly: 52,
      biweekly: 26,
      monthly: 12
    }[frequency];

    const usagesInPeriod = (usageFrequency * duration) / 365;
    const usagePerSession = 50; // ml per cleaning session
    const totalUsage = usagesInPeriod * usagePerSession;
    const productSize = parseFloat(product.name.match(/(\d+)ml/)?.[1]) || 1000; // Extract ml from name
    const unitsNeeded = Math.ceil(totalUsage / productSize);

    return {
      type: 'Cleaner Usage',
      primary: `${unitsNeeded} bottles needed`,
      details: [
        `Cleaning area: ${area} m²`,
        `Frequency: ${frequency}`,
        `Uses in ${duration} days: ${usagesInPeriod.toFixed(0)}`,
        `Total usage: ${totalUsage.toFixed(0)} ml`,
        `Bottle size: ${productSize} ml`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Dilute concentrate products as directed',
        'Test on small area first',
        'Ventilate area during use'
      ]
    };
  };

  const calculatePersonalCareUsage = () => {
    const householdSize = parseInt(inputs.householdSize) || 4;
    const duration = parseInt(inputs.usageDuration) || 30;
    const usagePerDay = 10; // ml per person per day

    const totalUsage = householdSize * usagePerDay * duration;
    const productSize = parseFloat(product.name.match(/(\d+)ml/)?.[1]) || 400; // Extract ml from name
    const unitsNeeded = Math.ceil(totalUsage / productSize);

    return {
      type: 'Personal Care Usage',
      primary: `${unitsNeeded} units needed`,
      details: [
        `Household size: ${householdSize} people`,
        `Usage per person: ${usagePerDay} ml/day`,
        `Duration: ${duration} days`,
        `Total usage: ${totalUsage} ml`,
        `Product size: ${productSize} ml`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Individual usage varies',
        'Check expiration dates',
        'Consider family pack options'
      ]
    };
  };

  const calculateBatteryUsage = () => {
    const devices = inputs.householdSize * 3; // Assume 3 devices per person
    const duration = parseInt(inputs.usageDuration) || 365; // Default to yearly
    const batteryLife = 90; // days

    const replacements = Math.ceil(duration / batteryLife);
    const totalBatteries = devices * replacements;
    const packageSize = parseInt(product.name.match(/(\d+)\s*pack/i)?.[1]) || 8;
    const unitsNeeded = Math.ceil(totalBatteries / packageSize);

    return {
      type: 'Battery Usage',
      primary: `${unitsNeeded} packs needed`,
      details: [
        `Estimated devices: ${devices}`,
        `Battery life: ${batteryLife} days`,
        `Replacements needed: ${replacements}`,
        `Total batteries: ${totalBatteries}`,
        `Pack size: ${packageSize} batteries`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Remove batteries from unused devices',
        'Store in cool, dry place',
        'Check expiration dates'
      ]
    };
  };

  const calculateGeneralUsage = () => {
    const duration = parseInt(inputs.usageDuration) || 30;
    const frequency = inputs.frequency || 'weekly';

    const usageFrequency = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30
    }[frequency];

    const unitsNeeded = Math.ceil(duration / usageFrequency);

    return {
      type: 'General Usage',
      primary: `${unitsNeeded} units recommended`,
      details: [
        `Usage frequency: ${frequency}`,
        `Duration: ${duration} days`,
        `Estimated consumption: ${unitsNeeded} units`
      ],
      cost: unitsNeeded * product.price,
      tips: [
        'Adjust based on actual usage',
        'Consider bulk discounts',
        'Check product specifications'
      ]
    };
  };

  if (!isOpen || !product) return null;

  const renderInputs = () => {
    switch (calculatorType) {
      case 'paint':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Area (m²)
                </label>
                <input
                  type="number"
                  value={inputs.roomArea}
                  onChange={(e) => setInputs(prev => ({ ...prev, roomArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Room area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wall Height (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.wallHeight}
                  onChange={(e) => setInputs(prev => ({ ...prev, wallHeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Doors
                </label>
                <input
                  type="number"
                  value={inputs.doors}
                  onChange={(e) => setInputs(prev => ({ ...prev, doors: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Windows
                </label>
                <input
                  type="number"
                  value={inputs.windows}
                  onChange={(e) => setInputs(prev => ({ ...prev, windows: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Coats
              </label>
              <select
                value={inputs.coats}
                onChange={(e) => setInputs(prev => ({ ...prev, coats: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 coat</option>
                <option value="2">2 coats (recommended)</option>
                <option value="3">3 coats</option>
              </select>
            </div>
          </>
        );

      case 'detergent':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Household Size
                </label>
                <input
                  type="number"
                  value={inputs.householdSize}
                  onChange={(e) => setInputs(prev => ({ ...prev, householdSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={inputs.usageDuration}
                  onChange={(e) => setInputs(prev => ({ ...prev, usageDuration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Load Size
              </label>
              <select
                value={inputs.loadSize}
                onChange={(e) => setInputs(prev => ({ ...prev, loadSize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small loads</option>
                <option value="medium">Medium loads</option>
                <option value="large">Large loads</option>
              </select>
            </div>
          </>
        );

      case 'cleaner':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cleaning Area (m²)
                </label>
                <input
                  type="number"
                  value={inputs.roomArea}
                  onChange={(e) => setInputs(prev => ({ ...prev, roomArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={inputs.usageDuration}
                  onChange={(e) => setInputs(prev => ({ ...prev, usageDuration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cleaning Frequency
              </label>
              <select
                value={inputs.frequency}
                onChange={(e) => setInputs(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </>
        );

      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={inputs.usageDuration}
                onChange={(e) => setInputs(prev => ({ ...prev, usageDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Frequency
              </label>
              <select
                value={inputs.frequency}
                onChange={(e) => setInputs(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Usage Calculator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-blue-600 font-medium">{product.price} MAD per unit</p>
              <p className="text-sm text-gray-500">Calculator Type: {results?.type}</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Enter your requirements:</h3>
            {renderInputs()}
          </div>

          {/* Results */}
          {results && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Calculation Results</h3>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-600">{results.primary}</div>
                  <div className="text-lg text-gray-700">Total Cost: {results.cost.toFixed(2)} MAD</div>
                </div>

                <div className="space-y-2">
                  {results.details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">Pro Tips</h4>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {results.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start space-x-2 text-xs text-gray-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Calculations are estimates based on typical usage patterns.
                  Actual consumption may vary depending on specific conditions and individual usage habits.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductUsageCalculator;
