import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Flag, AlertTriangle, UserX, MessageCircle, Users, Eye, Check, X, Clock } from 'lucide-react';

interface Report {
  id: string;
  type: 'user' | 'message' | 'group' | 'status';
  category: string;
  reporter: string;
  target: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockReports: Report[] = [
  { id: 'rpt_001', type: 'user', category: 'Harassment', reporter: 'user_8f2a', target: 'user_7b4e', description: 'Sending threatening messages repeatedly', status: 'pending', createdAt: '10 min ago', priority: 'high' },
  { id: 'rpt_002', type: 'message', category: 'Spam', reporter: 'user_3c1d', target: 'msg_4521', description: 'Unsolicited promotional messages in group', status: 'reviewing', createdAt: '25 min ago', priority: 'medium' },
  { id: 'rpt_003', type: 'group', category: 'Illegal content', reporter: 'user_9d5f', target: 'grp_1234', description: 'Group sharing pirated software links', status: 'pending', createdAt: '1 hr ago', priority: 'critical' },
  { id: 'rpt_004', type: 'status', category: 'Abuse', reporter: 'user_2e8a', target: 'status_789', description: 'Offensive content in status update', status: 'pending', createdAt: '2 hrs ago', priority: 'medium' },
  { id: 'rpt_005', type: 'user', category: 'Impersonation', reporter: 'user_6c3d', target: 'user_fake1', description: 'Account impersonating public figure', status: 'resolved', createdAt: '5 hrs ago', priority: 'high' },
  { id: 'rpt_006', type: 'message', category: 'Spam', reporter: 'user_1a7e', target: 'msg_8832', description: 'Bulk forwarded messages with links', status: 'dismissed', createdAt: '1 day ago', priority: 'low' },
];

export default function Reports() {
  const { resolvedTheme } = useTheme();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = mockReports.filter(r => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const priorityColors = {
    low: 'badge-info',
    medium: 'badge-warning',
    high: 'badge-danger',
    critical: 'badge-danger',
  };

  const typeIcons = {
    user: UserX,
    message: MessageCircle,
    group: Users,
    status: Flag,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            Reports & Moderation
          </h3>
          <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            Review and manage user reports, content moderation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm outline-none ${
              resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700 text-surface-200' : 'bg-white border border-surface-200 text-surface-700'
            }`}
          >
            <option value="all">All Types</option>
            <option value="user">Users</option>
            <option value="message">Messages</option>
            <option value="group">Groups</option>
            <option value="status">Status</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm outline-none ${
              resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700 text-surface-200' : 'bg-white border border-surface-200 text-surface-700'
            }`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: '156', icon: Flag, color: 'text-blue-500' },
          { label: 'Pending Review', value: '23', icon: Clock, color: 'text-orange-500' },
          { label: 'Resolved Today', value: '8', icon: Check, color: 'text-green-500' },
          { label: 'Critical', value: '3', icon: AlertTriangle, color: 'text-red-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-center gap-3">
                <Icon size={20} className={stat.color} />
                <div>
                  <p className={`text-lg font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>{stat.value}</p>
                  <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const TypeIcon = typeIcons[report.type];
          return (
            <div key={report.id} className={`card flex flex-col md:flex-row md:items-center gap-4`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                report.priority === 'critical' ? 'bg-red-500/20 text-red-500' :
                report.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                report.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-blue-500/20 text-blue-500'
              }`}>
                <TypeIcon size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-800'}`}>
                    {report.category}
                  </span>
                  <span className={`badge ${priorityColors[report.priority]}`}>
                    {report.priority}
                  </span>
                  <span className={`badge ${
                    report.status === 'pending' ? 'badge-warning' :
                    report.status === 'reviewing' ? 'badge-info' :
                    report.status === 'resolved' ? 'badge-success' : 'badge-info'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {report.description}
                </p>
                <div className={`flex items-center gap-4 mt-2 text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                  <span>Type: {report.type}</span>
                  <span>Reporter: {report.reporter}</span>
                  <span>Target: {report.target}</span>
                  <span>{report.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button className={`p-2 rounded-lg transition-colors ${
                  resolvedTheme === 'dark' ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
                }`} title="View Details">
                  <Eye size={16} />
                </button>
                <button className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors" title="Resolve">
                  <Check size={16} />
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors" title="Dismiss">
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
