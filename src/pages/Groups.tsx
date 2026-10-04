import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Users, Crown, Shield, Search, Eye, MoreVertical, MessageSquare, Image } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  admins: number;
  messages: number;
  media: number;
  created: string;
  type: 'public' | 'private';
  avatar: string;
}

const mockGroups: Group[] = [
  { id: 'grp_001', name: 'Community Prayer', description: 'Daily prayer community for all members', members: 245, admins: 3, messages: 12450, media: 342, created: '2024-01-10', type: 'public', avatar: 'CP' },
  { id: 'grp_002', name: 'Tech Discussion', description: 'Technology news and discussions', members: 89, admins: 2, messages: 5670, media: 123, created: '2024-02-15', type: 'public', avatar: 'TD' },
  { id: 'grp_003', name: 'Family Group', description: 'Private family communication', members: 12, admins: 1, messages: 3420, media: 567, created: '2024-01-20', type: 'private', avatar: 'FG' },
  { id: 'grp_004', name: 'Study Circle', description: 'Weekly study group discussions', members: 34, admins: 2, messages: 2100, media: 89, created: '2024-03-05', type: 'private', avatar: 'SC' },
  { id: 'grp_005', name: 'Neighborhood Watch', description: 'Local community safety updates', members: 156, admins: 4, messages: 8900, media: 234, created: '2024-02-28', type: 'public', avatar: 'NW' },
  { id: 'grp_006', name: 'Music Lovers', description: 'Share and discuss music', members: 67, admins: 2, messages: 4500, media: 890, created: '2024-04-12', type: 'public', avatar: 'ML' },
];

export default function Groups() {
  const { resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = mockGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
            Group Management
          </h3>
          <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
            Manage groups, members, permissions, and moderation
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          resolvedTheme === 'dark' ? 'bg-surface-800 border border-surface-700' : 'bg-white border border-surface-200'
        }`}>
          <Search size={16} className={resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent outline-none text-sm w-40 ${
              resolvedTheme === 'dark' ? 'text-surface-200 placeholder:text-surface-500' : 'text-surface-800 placeholder:text-surface-400'
            }`}
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="card hover:scale-[1.01] transition-transform cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold">
                  {group.avatar}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                    {group.name}
                  </h4>
                  <span className={`badge ${group.type === 'public' ? 'badge-info' : 'badge-warning'}`}>
                    {group.type}
                  </span>
                </div>
              </div>
              <button className={`p-1.5 rounded-md ${
                resolvedTheme === 'dark' ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
              }`}>
                <MoreVertical size={16} />
              </button>
            </div>
            
            <p className={`text-xs mb-3 line-clamp-2 ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              {group.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`flex items-center gap-1.5 p-2 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <Users size={12} className="text-blue-500" />
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {group.members} members
                </span>
              </div>
              <div className={`flex items-center gap-1.5 p-2 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <Crown size={12} className="text-yellow-500" />
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {group.admins} admins
                </span>
              </div>
              <div className={`flex items-center gap-1.5 p-2 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <MessageSquare size={12} className="text-green-500" />
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {group.messages.toLocaleString()} msgs
                </span>
              </div>
              <div className={`flex items-center gap-1.5 p-2 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-surface-700/50' : 'bg-surface-50'
              }`}>
                <Image size={12} className="text-purple-500" />
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {group.media} media
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-primary text-xs flex-1">
                <Eye size={12} /> View
              </button>
              <button className="btn btn-secondary text-xs">
                <Shield size={12} /> Moderate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
