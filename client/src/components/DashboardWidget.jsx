import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw } from 'lucide-react';

const DashboardWidget = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  color = 'blue',
  size = 'medium',
  loading = false,
  onClick,
  actions,
  children,
  className = ''
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      accent: 'text-blue-600',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      accent: 'text-green-600',
      trend: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      accent: 'text-red-600',
      trend: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      accent: 'text-yellow-600',
      trend: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      accent: 'text-purple-600',
      trend: 'text-purple-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      accent: 'text-gray-600',
      trend: 'text-gray-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const ArrowIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className={sizeClasses[size]}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-3">
              {Icon && (
                <div className={`${colors.bg} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Main Value */}
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <div className="mb-3">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatValue(value)}
                </div>

                {/* Trend */}
                {trend && trendValue && (
                  <div className="flex items-center gap-1">
                    {ArrowIcon && (
                      <ArrowIcon className={`w-4 h-4 ${
                        trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`} />
                    )}
                    <span className={`text-sm font-medium ${
                      trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trendValue}%
                    </span>
                    {trendLabel && (
                      <span className="text-sm text-gray-500">
                        {trendLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Content */}
        {children && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Preset widget components
export const StatsWidget = ({ title, value, change, changeType, icon, color }) => (
  <DashboardWidget
    title={title}
    value={value}
    icon={icon}
    trend={changeType}
    trendValue={Math.abs(change)}
    trendLabel="vs last month"
    color={color}
  />
);

export const ChartWidget = ({ title, children, actions }) => (
  <DashboardWidget
    title={title}
    size="large"
    actions={actions}
  >
    {children}
  </DashboardWidget>
);

export const ListWidget = ({ title, items = [], emptyMessage = "No items", onItemClick }) => (
  <DashboardWidget title={title} size="large">
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 ${
              onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''
            }`}
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                )}
              </div>
            </div>
            {item.value && (
              <span className="text-sm font-medium text-gray-600">
                {item.value}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  </DashboardWidget>
);

export const ProgressWidget = ({ title, progress, label, color = 'blue' }) => {
  const progressColors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <DashboardWidget title={title} color={color}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${progressColors[color]}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default DashboardWidget;
