import React from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const StockIndicator = ({
  stock = 0,
  lowStockThreshold = 5,
  showIcon = true,
  showText = true,
  size = 'md',
  className = ''
}) => {
  const getStockStatus = () => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= lowStockThreshold) return 'low_stock';
    return 'in_stock';
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'out_of_stock':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: XCircle,
          text: 'Out of Stock',
          description: 'This item is currently unavailable'
        };
      case 'low_stock':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: AlertTriangle,
          text: 'Low Stock',
          description: `Only ${stock} left in stock`
        };
      case 'in_stock':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle,
          text: 'In Stock',
          description: `${stock} available`
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: Package,
          text: 'Unknown',
          description: 'Stock status unknown'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  const status = getStockStatus();
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center ${getSizeClasses()} ${className}`}>
      {showIcon && (
        <div className={`inline-flex items-center justify-center rounded-full p-1 mr-2 ${config.bgColor}`}>
          <IconComponent className={`${getIconSize()} ${config.color}`} />
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className={`font-medium ${config.color}`}>
            {config.text}
          </span>
          {status === 'low_stock' && (
            <span className="text-xs text-gray-500">
              {config.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const StockBadge = ({ stock, lowStockThreshold = 5, className = '' }) => {
  const getStockStatus = () => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= lowStockThreshold) return 'low_stock';
    return 'in_stock';
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'out_of_stock':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Out of Stock'
        };
      case 'low_stock':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: `${stock} left`
        };
      case 'in_stock':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'In Stock'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown'
        };
    }
  };

  const status = getStockStatus();
  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${config.color} ${className}`}>
      {config.text}
    </span>
  );
};

export const StockProgress = ({ stock, maxStock, className = '' }) => {
  const percentage = maxStock > 0 ? (stock / maxStock) * 100 : 0;

  const getProgressColor = () => {
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Stock Level</span>
        <span>{stock} / {maxStock}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default StockIndicator;
