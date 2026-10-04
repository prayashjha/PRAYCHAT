import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, MessageSquare, Flag, Activity, HardDrive, Server, TrendingUp, Shield } from 'lucide-react';

export default function Dashboard() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const stats = [
    { label: t('dashboard.totalUsers'), value: '12,847', change: '+2.4%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: t('dashboard.activeToday'), value: '3,291', change: '+12.1%', icon: Activity, color: 'from-green-500 to-green-600' },
    { label: t('dashboard.messagesToday'), value: '89,432', change: '+8.7%', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
    { label: t('dashboard.pendingReports'), value: '23', change: '-5.2%', icon: Flag, color: 'from-orange-500 to-orange-600' },
  ];

  const systemMetrics = [
    { label: t('dashboard.apiCalls'), value: '1.2M', status: 'healthy' },
    { label: t('dashboard.storageUsed'), value: '4.2 TB / 10 TB', status: 'healthy' },
    { label: 'WebSocket Connections', value: '8,432', status: 'healthy' },
    { label: 'Avg Response Time', value: '45ms', status: 'healthy' },
  ];

  const recentActivities = [
    { action: 'New user registered', detail: 'user_8f2a... via phone OTP', time: '2 min ago', type: 'user' },
    { action: 'Report submitted', detail: 'Spam report on group "Tech Talk"', time: '5 min ago', type: 'report' },
    { action: 'Group created', detail: '"Community Prayer Group" - 12 members', time: '12 min ago', type: 'group' },
    { action: 'User suspended', detail: 'user_3c1d... - Policy violation', time: '18 min ago', type: 'moderation' },
    { action: 'Media uploaded', detail: 'Video file (24MB) - user_7b4e...', time: '25 min ago', type: 'media' },
    { action: 'Call completed', detail: 'Voice call - 4m 32s duration', time: '32 min ago', type: 'call' },
  ];

  const serviceStatus = [
    { name: 'Authentication Service', status: 'operational', uptime: '99.98%' },
    { name: 'Chat Service', status: 'operational', uptime: '99.95%' },
    { name: 'Media Storage', status: 'operational', uptime: '99.99%' },
    { name: 'WebRTC Signaling', status: 'operational', uptime: '99.90%' },
    { name: 'Push Notifications', status: 'degraded', uptime: '98.50%' },
    { name: 'Database Cluster', status: 'operational', uptime: '99.99%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h3 className={`text-base font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'user' ? 'bg-blue-500/20 text-blue-500' :
                  activity.type === 'report' ? 'bg-orange-500/20 text-orange-500' :
                  activity.type === 'group' ? 'bg-purple-500/20 text-purple-500' :
                  activity.type === 'moderation' ? 'bg-red-500/20 text-red-500' :
                  activity.type === 'media' ? 'bg-green-500/20 text-green-500' :
                  'bg-cyan-500/20 text-cyan-500'
                }`}>
                  {activity.type === 'user' && <Users size={14} />}
                  {activity.type === 'report' && <Flag size={14} />}
                  {activity.type === 'group' && <Shield size={14} />}
                  {activity.type === 'moderation' && <Shield size={14} />}
                  {activity.type === 'media' && <HardDrive size={14} />}
                  {activity.type === 'call' && <Server size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-800'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs truncate ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {activity.detail}
                  </p>
                </div>
                <span className={`text-xs flex-shrink-0 ${resolvedTheme === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Status */}
        <div className="card">
          <h3 className={`text-base font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            {t('dashboard.systemHealth')}
          </h3>
          <div className="space-y-3">
            {serviceStatus.map((service, idx) => (
              <div key={idx} className={`flex items-center justify-between p-2.5 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'operational' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                    {service.name}
                  </span>
                </div>
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                  {service.uptime}
                </span>
              </div>
            ))}
          </div>

          {/* System Metrics */}
          <div className="mt-6">
            <h4 className={`text-sm font-medium mb-3 ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
              System Metrics
            </h4>
            <div className="space-y-2">
              {systemMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {metric.label}
                  </span>
                  <span className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className={`text-base font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          Platform Architecture Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'Auth', status: 'ready' },
            { name: 'Chat', status: 'ready' },
            { name: 'Groups', status: 'ready' },
            { name: 'Media', status: 'ready' },
            { name: 'WebRTC', status: 'config' },
            { name: 'Push', status: 'config' },
            { name: 'E2EE', status: 'planned' },
            { name: 'Status', status: 'ready' },
            { name: 'Calls', status: 'config' },
            { name: 'Search', status: 'ready' },
            { name: 'Admin', status: 'ready' },
            { name: 'Offline', status: 'ready' },
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-center ${
              resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
            }`}>
              <p className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                {item.name}
              </p>
              <span className={`badge mt-1 ${
                item.status === 'ready' ? 'badge-success' :
                item.status === 'config' ? 'badge-warning' : 'badge-info'
              }`}>
                {item.status === 'ready' ? '✓ Ready' : item.status === 'config' ? '⚙ Config' : '◌ Planned'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
