import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  AlertTriangle,
  Clock,
  Star,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Simple Chart Components (since we don't have chart libraries installed)
const LineChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 280;
    const y = 80 - (point.value / maxValue) * 60;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <svg width="280" height="80" className="w-full">
        <polyline
          points={points}
          fill="none"
          stroke={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#EF4444"}
          strokeWidth="2"
        />
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 280;
          const y = 80 - (point.value / maxValue) * 60;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#EF4444"}
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

const BarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-xs text-gray-600">{item.label}</div>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    color === "blue" ? "bg-blue-500" :
                    color === "green" ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-xs text-gray-900 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="20" />
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 60 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 60 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 60 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
              const y2 = 60 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;
              const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

              return (
                <path
                  key={index}
                  d={`M 60 60 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        {data.map((item, index) => {
          const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"];
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`} />
              <span className="flex-1">{item.label}</span>
              <span className="text-gray-600">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const { language } = useLanguage();

  // Mock data - in real app, this would come from API
  const mockData = {
    overview: {
      totalRevenue: 125430,
      revenueChange: 12.5,
      totalOrders: 1247,
      ordersChange: 8.3,
      totalCustomers: 523,
      customersChange: 15.7,
      averageOrderValue: 98.50,
      aovChange: -2.1,
      conversionRate: 3.2,
      conversionChange: 5.8,
      returningCustomers: 68.5,
      returningChange: 4.2
    },
    salesTrend: [
      { label: 'Mon', value: 1200 },
      { label: 'Tue', value: 1450 },
      { label: 'Wed', value: 1100 },
      { label: 'Thu', value: 1800 },
      { label: 'Fri', value: 2200 },
      { label: 'Sat', value: 1900 },
      { label: 'Sun', value: 1650 }
    ],
    customerGrowth: [
      { label: 'Week 1', value: 45 },
      { label: 'Week 2', value: 52 },
      { label: 'Week 3', value: 48 },
      { label: 'Week 4', value: 67 }
    ],
    topProducts: [
      { label: 'Vitamin D3', value: 145 },
      { label: 'Pain Relief', value: 123 },
      { label: 'Antibiotics', value: 98 },
      { label: 'Face Masks', value: 87 },
      { label: 'Hand Sanitizer', value: 76 }
    ],
    categoryDistribution: [
      { label: 'Prescription', value: 45 },
      { label: 'Vitamins', value: 30 },
      { label: 'Personal Care', value: 15 },
      { label: 'First Aid', value: 10 }
    ],
    deviceTypes: [
      { label: 'Desktop', value: 52 },
      { label: 'Mobile', value: 38 },
      { label: 'Tablet', value: 10 }
    ],
    customerInsights: {
      averageAge: 42,
      genderDistribution: { male: 45, female: 55 },
      topLocations: [
        { city: 'Casablanca', percentage: 35 },
        { city: 'Rabat', percentage: 22 },
        { city: 'Marrakech', percentage: 18 },
        { city: 'Fez', percentage: 15 },
        { city: 'Tangier', percentage: 10 }
      ],
      peakHours: [
        { hour: '9-10', orders: 45 },
        { hour: '14-15', orders: 52 },
        { hour: '18-19', orders: 38 },
        { hour: '20-21', orders: 41 }
      ]
    },
    alerts: [
      { type: 'warning', message: 'Low stock alert: Vitamin D3 (12 units remaining)', priority: 'high' },
      { type: 'info', message: 'New customer registration increased by 15% this week', priority: 'medium' },
      { type: 'error', message: 'Payment processing delay detected', priority: 'high' },
      { type: 'success', message: 'Monthly sales target achieved (105%)', priority: 'low' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const exportReport = () => {
    // In real app, this would generate and download a report
    console.log('Exporting analytics report...');
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { overview, salesTrend, customerGrowth, topProducts, categoryDistribution, deviceTypes, customerInsights, alerts } = analyticsData;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store's performance and customer insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={refreshData}
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'bg-red-50 border-red-400' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'success' ? 'bg-green-50 border-green-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className={`w-5 h-5 mr-3 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'success' ? 'text-green-500' :
                  'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className={`text-xs ${
                    alert.priority === 'high' ? 'text-red-600' :
                    alert.priority === 'medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    Priority: {alert.priority}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${overview.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center">
            {overview.revenueChange > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm ${overview.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(overview.revenueChange)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{overview.ordersChange}%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalCustomers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{overview.customersChange}%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${overview.averageOrderValue}</p>
            </div>
            <Target className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-sm text-red-600">{Math.abs(overview.aovChange)}%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overview.conversionRate}%</p>
            </div>
            <Eye className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{overview.conversionChange}%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returning Customers</p>
              <p className="text-2xl font-bold text-gray-900">{overview.returningCustomers}%</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{overview.returningChange}%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <LineChart data={salesTrend} title="Sales Trend" color="blue" />
        <LineChart data={customerGrowth} title="Customer Growth" color="green" />
        <BarChart data={topProducts} title="Top Products" color="blue" />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonutChart data={categoryDistribution} title="Sales by Category" />
        <DonutChart data={deviceTypes} title="Traffic by Device" />

        {/* Customer Demographics */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Average Age</span>
                <span className="text-lg font-bold text-gray-900">{customerInsights.averageAge}</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">Gender Distribution</div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="w-12 text-xs text-gray-600">Male</span>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${customerInsights.genderDistribution.male}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-900">{customerInsights.genderDistribution.male}%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-12 text-xs text-gray-600">Female</span>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${customerInsights.genderDistribution.female}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-900">{customerInsights.genderDistribution.female}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top Customer Locations</h3>
          </div>
          <div className="space-y-3">
            {customerInsights.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{location.city}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
          </div>
          <div className="space-y-3">
            {customerInsights.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{hour.hour}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(hour.orders / Math.max(...customerInsights.peakHours.map(h => h.orders))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{hour.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Analytics */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device & Platform Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Monitor, label: 'Desktop', value: deviceTypes[0].value, color: 'blue' },
            { icon: Smartphone, label: 'Mobile', value: deviceTypes[1].value, color: 'green' },
            { icon: Tablet, label: 'Tablet', value: deviceTypes[2].value, color: 'purple' }
          ].map((device, index) => {
            const Icon = device.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  device.color === 'blue' ? 'bg-blue-100' :
                  device.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    device.color === 'blue' ? 'text-blue-600' :
                    device.color === 'green' ? 'text-green-600' : 'text-purple-600'
                  }`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{device.value}%</h4>
                <p className="text-sm text-gray-600">{device.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
