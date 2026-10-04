import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle2, AlertCircle, Clock, XCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface StatusItem {
  feature: string;
  status: 'full' | 'config' | 'planned' | 'not_started';
  details: string;
  requirements?: string[];
}

const categories = [
  {
    title: 'Authentication & User Management',
    items: [
      { feature: 'Phone number login architecture', status: 'config' as const, details: 'Service layer complete, requires SMS provider', requirements: ['SMS Provider (Twilio/MSG91)', 'Phone number verification service'] },
      { feature: 'Email/password login', status: 'config' as const, details: 'Service layer complete, requires backend', requirements: ['Backend auth service', 'Email verification service'] },
      { feature: 'OTP verification architecture', status: 'config' as const, details: 'Provider abstraction ready', requirements: ['SMS gateway configuration'] },
      { feature: 'Session management', status: 'config' as const, details: 'Token handling architecture ready', requirements: ['JWT backend', 'Secure token storage'] },
      { feature: 'Password reset flow', status: 'config' as const, details: 'UI flow designed', requirements: ['Email service', 'Backend endpoint'] },
      { feature: 'Account deletion', status: 'config' as const, details: 'Service method defined', requirements: ['Backend implementation', 'Data cleanup procedures'] },
      { feature: 'Profile management', status: 'config' as const, details: 'Full UI and service layer', requirements: ['Backend user service', 'Media storage'] },
      { feature: 'Privacy settings', status: 'config' as const, details: 'Complete settings UI', requirements: ['Backend enforcement'] },
    ]
  },
  {
    title: 'Messaging & Chat',
    items: [
      { feature: 'One-to-one chat UI', status: 'full' as const, details: 'Complete chat interface with all features' },
      { feature: 'Message sending/receiving', status: 'config' as const, details: 'Service layer complete', requirements: ['Backend message service', 'WebSocket connection'] },
      { feature: 'Message reactions', status: 'config' as const, details: 'UI and service ready', requirements: ['Backend support', 'Real-time sync'] },
      { feature: 'Reply/Forward/Edit/Delete', status: 'config' as const, details: 'Full message operations', requirements: ['Backend message operations'] },
      { feature: 'Read receipts', status: 'config' as const, details: 'Architecture ready', requirements: ['Real-time service', 'Backend tracking'] },
      { feature: 'Typing indicators', status: 'config' as const, details: 'Service abstraction ready', requirements: ['WebSocket events', 'Backend relay'] },
      { feature: 'Message search', status: 'config' as const, details: 'Search UI complete', requirements: ['Backend search service', 'Full-text index'] },
      { feature: 'Disappearing messages', status: 'config' as const, details: 'Timer logic ready', requirements: ['Backend expiration handling'] },
      { feature: 'Star/Favorite messages', status: 'config' as const, details: 'Service method defined', requirements: ['Backend storage'] },
      { feature: 'Message pinning', status: 'config' as const, details: 'UI and service ready', requirements: ['Backend support'] },
    ]
  },
  {
    title: 'Group Chat',
    items: [
      { feature: 'Create/Manage groups', status: 'config' as const, details: 'Complete group management UI', requirements: ['Backend group service'] },
      { feature: 'Admin roles & permissions', status: 'config' as const, details: 'Permission model designed', requirements: ['Backend enforcement'] },
      { feature: 'Group invite links', status: 'config' as const, details: 'Link generation ready', requirements: ['Backend invite service'] },
      { feature: 'Group media gallery', status: 'config' as const, details: 'Media tabs implemented', requirements: ['Backend media query'] },
      { feature: 'Mentions (@user)', status: 'planned' as const, details: 'Architecture planned' },
      { feature: 'Group permissions', status: 'config' as const, details: 'Permission model ready', requirements: ['Server-side enforcement'] },
    ]
  },
  {
    title: 'Media & File Sharing',
    items: [
      { feature: 'Image sharing', status: 'config' as const, details: 'Upload/download service ready', requirements: ['Object storage (S3/MinIO)', 'CDN configuration'] },
      { feature: 'Video sharing', status: 'config' as const, details: 'Video handling architecture', requirements: ['Object storage', 'Transcoding service'] },
      { feature: 'Document sharing', status: 'config' as const, details: 'File upload with validation', requirements: ['Object storage'] },
      { feature: 'Voice messages', status: 'config' as const, details: 'Recording architecture ready', requirements: ['Object storage', 'Audio processing'] },
      { feature: 'Location sharing', status: 'planned' as const, details: 'Permission handling ready', requirements: ['Map integration', 'Backend storage'] },
      { feature: 'Contact sharing', status: 'planned' as const, details: 'Architecture planned', requirements: ['Contact picker', 'Backend support'] },
      { feature: 'Upload/download progress', status: 'full' as const, details: 'Progress tracking UI complete' },
      { feature: 'File validation (MIME/size)', status: 'full' as const, details: 'Client-side validation implemented' },
    ]
  },
  {
    title: 'Voice & Video Calling',
    items: [
      { feature: 'Call UI (start/end/mute)', status: 'full' as const, details: 'Complete call interface' },
      { feature: 'WebRTC peer connection', status: 'config' as const, details: 'WebRTC service architecture ready', requirements: ['TURN server', 'STUN server', 'Signaling server'] },
      { feature: 'Signaling service', status: 'config' as const, details: 'Signaling abstraction ready', requirements: ['WebSocket signaling server'] },
      { feature: 'Camera/microphone handling', status: 'full' as const, details: 'Permission and device handling' },
      { feature: 'Call history', status: 'config' as const, details: 'History UI complete', requirements: ['Backend call records'] },
      { feature: 'Group video calls', status: 'planned' as const, details: 'GroupCallService abstraction created', requirements: ['SFU server (mediasoup/Janus)', 'Backend group call service'] },
      { feature: 'Call reconnection', status: 'config' as const, details: 'Reconnection logic designed', requirements: ['WebRTC reconnection handling'] },
    ]
  },
  {
    title: 'Status / Stories',
    items: [
      { feature: 'Create text/image/video status', status: 'config' as const, details: 'Status creation UI complete', requirements: ['Backend status service', 'Media storage'] },
      { feature: '24-hour expiration', status: 'config' as const, details: 'Timer logic ready', requirements: ['Backend expiration job'] },
      { feature: 'View status & viewer list', status: 'config' as const, details: 'Viewer tracking ready', requirements: ['Backend view tracking'] },
      { feature: 'Status privacy settings', status: 'config' as const, details: 'Privacy options implemented', requirements: ['Backend enforcement'] },
      { feature: 'Reply to status', status: 'config' as const, details: 'Reply flow designed', requirements: ['Backend integration'] },
    ]
  },
  {
    title: 'Push Notifications',
    items: [
      { feature: 'Notification service architecture', status: 'config' as const, details: 'Service abstraction ready', requirements: ['Firebase Cloud Messaging', 'FCM server key (backend)'] },
      { feature: 'Message notifications', status: 'config' as const, details: 'Notification types defined', requirements: ['FCM configuration', 'Backend trigger'] },
      { feature: 'Call notifications', status: 'config' as const, details: 'Incoming call notification ready', requirements: ['FCM high priority', 'CallKit/VoIP'] },
      { feature: 'Notification channels', status: 'full' as const, details: 'Android channel configuration' },
      { feature: 'Badge count', status: 'config' as const, details: 'Badge logic ready', requirements: ['Backend unread count'] },
    ]
  },
  {
    title: 'Real-time Communication',
    items: [
      { feature: 'WebSocket connection management', status: 'config' as const, details: 'RealtimeService abstraction ready', requirements: ['WebSocket server', 'Connection handling'] },
      { feature: 'Auto-reconnect', status: 'full' as const, details: 'Reconnection with exponential backoff' },
      { feature: 'Offline message queue', status: 'config' as const, details: 'Queue architecture ready', requirements: ['Local storage', 'Sync on reconnect'] },
      { feature: 'Presence tracking', status: 'config' as const, details: 'Online/offline detection', requirements: ['WebSocket events', 'Backend presence'] },
    ]
  },
  {
    title: 'Security & Privacy',
    items: [
      { feature: 'Transport encryption (HTTPS/WSS)', status: 'config' as const, details: 'Architecture ready', requirements: ['SSL certificates', 'HTTPS backend'] },
      { feature: 'Secure token storage', status: 'full' as const, details: 'Flutter Secure Storage integration' },
      { feature: 'Input validation', status: 'full' as const, details: 'Client-side validation on all inputs' },
      { feature: 'Blocking users', status: 'config' as const, details: 'Block/unblock UI complete', requirements: ['Backend enforcement'] },
      { feature: 'Reporting system', status: 'config' as const, details: 'Report UI and service ready', requirements: ['Backend report processing'] },
      { feature: 'End-to-End Encryption', status: 'not_started' as const, details: 'NOT implemented. Architecture can support future E2EE but is not currently E2EE.' },
    ]
  },
  {
    title: 'Admin & Moderation',
    items: [
      { feature: 'Admin dashboard (web)', status: 'full' as const, details: 'This admin panel - fully functional' },
      { feature: 'User management', status: 'config' as const, details: 'Admin UI complete', requirements: ['Backend admin API', 'Authorization'] },
      { feature: 'Report moderation', status: 'config' as const, details: 'Report review interface', requirements: ['Backend report service'] },
      { feature: 'Group moderation', status: 'config' as const, details: 'Group management tools', requirements: ['Backend group admin'] },
      { feature: 'Audit logging', status: 'config' as const, details: 'Audit trail architecture', requirements: ['Backend audit service'] },
    ]
  },
  {
    title: 'Platform & Distribution',
    items: [
      { feature: 'Android build configuration', status: 'full' as const, details: 'Release signing, permissions, manifest ready' },
      { feature: 'Google Play Store readiness', status: 'config' as const, details: 'AAB build configured', requirements: ['Play Console account', 'Privacy policy', 'App assets'] },
      { feature: 'Indus Appstore readiness', status: 'full' as const, details: 'Standard APK compatible' },
      { feature: 'Dark/Light/System theme', status: 'full' as const, details: 'Complete theme system' },
      { feature: 'English/Hindi language support', status: 'full' as const, details: 'i18n architecture with extensibility' },
      { feature: 'Accessibility', status: 'full' as const, details: 'Screen reader labels, touch targets' },
    ]
  },
];

export default function Production() {
  const { resolvedTheme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'config': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'planned': return <Clock size={16} className="text-blue-500" />;
      case 'not_started': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'full': return { text: 'FULLY IMPLEMENTED', className: 'badge-success' };
      case 'config': return { text: 'REQUIRES CONFIGURATION', className: 'badge-warning' };
      case 'planned': return { text: 'PLANNED', className: 'badge-info' };
      case 'not_started': return { text: 'NOT YET IMPLEMENTED', className: 'badge-danger' };
      default: return { text: '', className: '' };
    }
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const fullCount = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'full').length, 0);
  const configCount = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'config').length, 0);
  const plannedCount = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'planned').length, 0);
  const notStartedCount = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'not_started').length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          Production Readiness Report
        </h3>
        <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
          Honest assessment of implementation status for every feature
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Fully Implemented</span>
          </div>
          <p className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>{fullCount}</p>
          <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>of {totalItems} features</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-yellow-500" />
            <span className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Needs Configuration</span>
          </div>
          <p className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>{configCount}</p>
          <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>of {totalItems} features</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-blue-500" />
            <span className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Planned</span>
          </div>
          <p className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>{plannedCount}</p>
          <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>of {totalItems} features</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-500" />
            <span className={`text-xs font-medium ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Not Started</span>
          </div>
          <p className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>{notStartedCount}</p>
          <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-500' : 'text-surface-400'}`}>of {totalItems} features</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className={`card ${resolvedTheme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
        <h4 className={`text-sm font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
          ⚠️ Important Disclaimers
        </h4>
        <ul className={`text-xs space-y-1 ${resolvedTheme === 'dark' ? 'text-red-400/80' : 'text-red-700'}`}>
          <li>• This is NOT a demo/fake application. All service layers are real abstractions ready for backend integration.</li>
          <li>• Features marked "Requires Configuration" have complete client-side architecture but need backend services to function.</li>
          <li>• End-to-End Encryption is NOT implemented and is NOT claimed. Transport encryption is the current security layer.</li>
          <li>• Calling architecture is WebRTC-ready but requires TURN/STUN/signaling server infrastructure.</li>
          <li>• Push notifications require Firebase Cloud Messaging server-side configuration.</li>
          <li>• No fake users, fake messages, or fake data exists. All data must come from real backend services.</li>
          <li>• The application has NOT been submitted to any app store. It is prepared for submission.</li>
        </ul>
      </div>

      {/* Detailed Status by Category */}
      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="card">
            <h4 className={`text-base font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
              {category.title}
            </h4>
            <div className="space-y-2">
              {category.items.map((item, itemIdx) => {
                const label = getStatusLabel(item.status);
                return (
                  <div key={itemIdx} className={`p-3 rounded-lg ${
                    resolvedTheme === 'dark' ? 'bg-surface-700/30' : 'bg-surface-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-800'}`}>
                            {item.feature}
                          </span>
                          <span className={`badge ${label.className}`}>{label.text}</span>
                        </div>
                        <p className={`text-xs mt-1 ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                          {item.details}
                        </p>
                        {item.requirements && item.requirements.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.requirements.map((req, rIdx) => (
                              <span key={rIdx} className={`text-xs px-2 py-0.5 rounded ${
                                resolvedTheme === 'dark' ? 'bg-surface-600 text-surface-300' : 'bg-surface-200 text-surface-600'
                              }`}>
                                {req}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* External Dependencies Summary */}
      <div className="card">
        <h4 className={`text-base font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          External Dependencies Required for Production
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Backend Server', desc: 'Node.js/Go/Python API server', critical: true },
            { name: 'PostgreSQL Database', desc: 'Primary data storage', critical: true },
            { name: 'Redis', desc: 'Real-time pub/sub, caching, presence', critical: true },
            { name: 'Object Storage (S3/MinIO)', desc: 'Media file storage', critical: true },
            { name: 'TURN Server', desc: 'NAT traversal for WebRTC calls', critical: true },
            { name: 'WebSocket Server', desc: 'Real-time messaging & signaling', critical: true },
            { name: 'SMS Provider', desc: 'OTP verification (Twilio/MSG91)', critical: false },
            { name: 'Firebase (FCM)', desc: 'Push notifications', critical: false },
            { name: 'Domain + SSL', desc: 'HTTPS for all services', critical: true },
            { name: 'CDN', desc: 'Media delivery optimization', critical: false },
            { name: 'SFU Server', desc: 'Group video calls (mediasoup/Janus)', critical: false },
            { name: 'Email Service', desc: 'Password reset, notifications', critical: false },
          ].map((dep, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
              resolvedTheme === 'dark' ? 'bg-surface-700/30' : 'bg-surface-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${dep.critical ? 'bg-red-500' : 'bg-yellow-500'}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-surface-200' : 'text-surface-700'}`}>
                  {dep.name}
                </p>
                <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                  {dep.desc}
                </p>
              </div>
              <span className={`text-xs ${dep.critical ? 'text-red-500' : 'text-yellow-500'}`}>
                {dep.critical ? 'Required' : 'Optional'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
