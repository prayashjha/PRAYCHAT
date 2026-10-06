// CallsTab - Call history screen
// Shows incoming, outgoing, missed calls

import React from 'react';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { useLang } from '../LanguageContext';
import { formatTime, formatChatDate, formatDuration } from '../utils/time';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video } from 'lucide-react';

export default function CallsTab() {
  const { resolved } = useTheme();
  const { t } = useLang();
  const { user, users, calls } = useStore();

  if (!user) return null;

  const myCalls = calls.filter(c => c.callerId === user.id || c.receiverId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="h-full overflow-y-auto">
      {myCalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${resolved === 'dark' ? 'bg-surface-800' : 'bg-surface-100'}`}>
            <Phone size={28} className="text-primary-500" />
          </div>
          <p className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{t('noCalls')}</p>
        </div>
      ) : (
        myCalls.map(call => {
          const isOutgoing = call.callerId === user.id;
          const otherId = isOutgoing ? call.receiverId : call.callerId;
          const other = users.find(u => u.id === otherId);
          if (!other) return null;

          const Icon = call.status === 'missed' ? PhoneMissed : isOutgoing ? PhoneOutgoing : PhoneIncoming;
          const iconColor = call.status === 'missed' ? 'text-red-500' : 'text-green-500';

          return (
            <div key={call.id} className={`flex items-center gap-3 px-4 py-3 ${resolved === 'dark' ? 'border-b border-surface-800' : 'border-b border-surface-100'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: other.avatar }}>
                {other.name[0]}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${resolved === 'dark' ? 'text-white' : 'text-surface-900'}`}>{other.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Icon size={14} className={iconColor} />
                  <span className={`text-sm ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {isOutgoing ? t('outgoing') : t('incoming')} · {formatChatDate(call.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs ${resolved === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>{formatTime(call.createdAt)}</p>
                {call.duration && (
                  <p className={`text-xs ${resolved === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>
                    {formatDuration(call.duration)}
                  </p>
                )}
              </div>
              <button className={`p-2 ml-1 ${call.type === 'video' ? 'text-primary-500' : 'text-green-500'}`}>
                {call.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
