import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, MoreVertical, Shield, Ban, Eye, UserCheck, Phone, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  joined: string;
  lastSeen: string;
  messages: number;
  avatar: string;
}

const mockUsers: User[] = [
  { id: 'usr_8f2a', name: 'Arjun Sharma', username: 'arjun_s', phone: '+91 98***234', email: 'a***@gmail.com', status: 'active', joined: '2024-01-15', lastSeen: '2 min ago', messages: 1247, avatar: 'AS' },
  { id: 'usr_3c1d', name: 'Priya Patel', username: 'priya_p', phone: '+91 87***567', email: 'p***@outlook.com', status: 'active', joined: '2024-02-20', lastSeen: '15 min ago', messages: 892, avatar: 'PP' },
  { id: 'usr_7b4e', name: 'Rahul Kumar', username: 'rahul_k', phone: '+91 76***890', email: 'r***@gmail.com', status: 'suspended', joined: '2024-03-10', lastSeen: '3 days ago', messages: 234, avatar: 'RK' },
  { id: 'usr_9d5f', name: 'Sneha Gupta', username: 'sneha_g', phone: '+91 65***123', email: 's***@yahoo.com', status: 'active', joined: '2024-01-28', lastSeen: '1 hr ago', messages: 2103, avatar: 'SG' },
  { id: 'usr_2e8a', name: 'Vikram Singh', username: 'vikram_s', phone: '+91 54***456', email: 'v***@gmail.com', status: 'active', joined: '2024-04-05', lastSeen: '30 min ago', messages: 567, avatar: 'VS' },
  { id: 'usr_4f1b', name: 'Anita Desai', username: 'anita_d', phone: '+91 43***789', email: 'a***@gmail.com', status: 'banned', joined: '2024-02-14', lastSeen: '30 days ago', messages: 45, avatar: 'AD' },
  { id: 'usr_6c3d', name: 'Mohammed Ali', username: 'mohammed_a', phone: '+91 32***012', email: 'm***@outlook.com', status: 'active', joined: '2024-03-22', lastSeen: '5 min ago', messages: 1589, avatar: 'MA' },
  { id: 'usr_1a7e', name: 'Kavita Rao', username: 'kavita_r', phone: '+91 21***345', email: 'k***@gmail.com', status: 'active', joined: '2024-05-01', lastSeen: 'Just now', messages: 312, avatar: 'KR' },
];

export default function Users() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            {t('nav.users')}
          </h3>
          <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            Manage registered users, permissions, and moderation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700' : 'bg-white border border-surface-200'
          }`}>
            <Search size={16} className={resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent outline-none text-sm w-40 ${
                resolvedTheme === 'dark' ? 'text-surface-200 placeholder:text-surface-500' : 'text-surface-800 placeholder:text-surface-400'
              }`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm outline-none ${
              resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700 text-surface-200' : 'bg-white border border-surface-200 text-surface-700'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={`card overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'}>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>User</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Contact</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Status</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Joined</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Messages</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${resolvedTheme === 'dark' ? 'divide-surface-700' : 'divide-surface-100'}`}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-800'}`}>{user.name}</p>
                        <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Phone size={12} className={resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
                      <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' :
                      user.status === 'suspended' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                    {user.joined}
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                    {user.messages.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className={`p-1.5 rounded-md transition-colors ${
                          resolvedTheme === 'dark' ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
                        }`}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button className={`p-1.5 rounded-md transition-colors ${
                        resolvedTheme === 'dark' ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
                      }`} title="Suspend">
                        <Ban size={14} />
                      </button>
                      <button className={`p-1.5 rounded-md transition-colors ${
                        resolvedTheme === 'dark' ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
                      }`} title="More">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Panel */}
      {selectedUser && (
        <div className={`card`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-lg font-bold">
                {selectedUser.avatar}
              </div>
              <div>
                <h4 className={`text-lg font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                  {selectedUser.name}
                </h4>
                <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                  @{selectedUser.username} · ID: {selectedUser.id}
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className={`p-2 rounded-lg ${
              resolvedTheme === 'dark' ? 'hover:bg-surface-700 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
            }`}>✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'}`}>
              <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Last Seen</p>
              <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{selectedUser.lastSeen}</p>
            </div>
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'}`}>
              <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Messages</p>
              <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{selectedUser.messages.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'}`}>
              <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Joined</p>
              <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>{selectedUser.joined}</p>
            </div>
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'}`}>
              <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Status</p>
              <span className={`badge ${
                selectedUser.status === 'active' ? 'badge-success' :
                selectedUser.status === 'suspended' ? 'badge-warning' : 'badge-danger'
              }`}>{selectedUser.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button className="btn btn-primary text-xs">
              <UserCheck size={14} /> Verify User
            </button>
            <button className="btn btn-secondary text-xs">
              <Shield size={14} /> Make Admin
            </button>
            <button className="btn btn-secondary text-xs text-red-500">
              <Ban size={14} /> Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
