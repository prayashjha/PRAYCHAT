import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Network, Database, Shield, Radio, Cloud, Smartphone, Lock, Server, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

const architectureSections = [
  {
    id: 'overview',
    title: 'System Architecture Overview',
    icon: Network,
    content: `PrayChat follows a clean layered architecture separating the Flutter client from backend services.

┌─────────────────────────────────────────────────────────────┐
│                    PRAYCHAT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │   Flutter    │    │   API        │    │   Backend     │   │
│  │   Client     │◄──►│   Gateway    │◄──►│   Services    │   │
│  │  (Android)   │    │  (REST/WS)   │    │   (Micro)     │   │
│  └─────────────┘    └──────────────┘    └───────────────┘   │
│        │                    │                     │           │
│        ▼                    ▼                     ▼           │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │  Local       │    │  Redis       │    │  PostgreSQL   │   │
│  │  Cache       │    │  (Realtime)  │    │  (Primary DB) │   │
│  └─────────────┘    └──────────────┘    └───────────────┘   │
│                                                               │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │  Object      │    │  WebRTC      │    │  Push         │   │
│  │  Storage     │    │  Signaling   │    │  (FCM/APNs)   │   │
│  └─────────────┘    └──────────────┘    └───────────────┘   │
└─────────────────────────────────────────────────────────────┘`
  },
  {
    id: 'services',
    title: 'Service Layer Architecture',
    icon: Layers,
    content: `The Flutter application communicates with backend through service abstractions:

AuthService
├── loginWithPhone(phone, callback)
├── loginWithEmail(email, password)
├── verifyOTP(phone, code)
├── logout()
├── resetPassword(email)
├── deleteAccount()
└── refreshToken()

UserService
├── getProfile(userId)
├── updateProfile(data)
├── updateProfilePhoto(file)
├── searchUsers(query)
├── getOnlineStatus(userId)
└── getLastSeen(userId)

ChatService
├── getChats(page, limit)
├── createChat(userId)
├── deleteChat(chatId)
├── archiveChat(chatId)
├── pinChat(chatId)
├── muteChat(chatId, duration)
└── getUnreadCount()

MessageService
├── getMessages(chatId, before, limit)
├── sendMessage(chatId, content, type)
├── editMessage(messageId, content)
├── deleteMessage(messageId, forEveryone)
├── forwardMessage(messageId, targetChatId)
├── replyToMessage(messageId, content)
├── reactToMessage(messageId, emoji)
├── starMessage(messageId)
├── pinMessage(messageId)
└── searchMessages(chatId, query)

GroupService
├── createGroup(name, members, photo)
├── updateGroup(groupId, data)
├── addMembers(groupId, userIds)
├── removeMember(groupId, userId)
├── promoteAdmin(groupId, userId)
├── demoteAdmin(groupId, userId)
├── leaveGroup(groupId)
├── getInviteLink(groupId)
├── revokeInviteLink(groupId)
├── joinGroup(inviteCode)
└── getGroupMedia(groupId)

StatusService
├── createStatus(content, type)
├── getStatuses()
├── viewStatus(statusId)
├── deleteStatus(statusId)
├── muteStatus(userId)
└── getStatusViewers(statusId)

MediaService
├── uploadMedia(file, onProgress)
├── downloadMedia(mediaId, onProgress)
├── getMediaUrl(mediaId)
├── validateFile(file)
└── generateThumbnail(mediaId)

CallService
├── startCall(userId, type)
├── acceptCall(callId)
├── rejectCall(callId)
├── endCall(callId)
├── getCallHistory()
└── getMissedCalls()

NotificationService
├── registerForPush(token)
├── unregisterPush()
├── updateNotificationSettings(settings)
└── getNotificationHistory()

RealtimeService
├── connect()
├── disconnect()
├── onMessage(callback)
├── onTyping(callback)
├── onPresence(callback)
├── onReadReceipt(callback)
├── onCallSignal(callback)
└── onGroupUpdate(callback)

StorageService
├── saveSecure(key, value)
├── getSecure(key)
├── deleteSecure(key)
├── saveLocal(key, value)
├── getLocal(key)
└── clearLocal()`
  },
  {
    id: 'database',
    title: 'Database Schema',
    icon: Database,
    content: `PostgreSQL database with proper relationships and indexes:

TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  about TEXT,
  profile_photo_url TEXT,
  password_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE
);

TABLE contacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  contact_user_id UUID REFERENCES users(id),
  nickname VARCHAR(100),
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, contact_user_id)
);

TABLE chats (
  id UUID PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- 'direct', 'group'
  name VARCHAR(200),
  description TEXT,
  photo_url TEXT,
  created_by UUID REFERENCES users(id),
  is_archived BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  muted_until TIMESTAMPTZ,
  invite_code VARCHAR(50) UNIQUE,
  disappearing_messages VARCHAR(20), -- 'off', '24h', '7d', '90d'
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

TABLE chat_members (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_message_id UUID,
  UNIQUE(chat_id, user_id)
);

TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  type VARCHAR(30) NOT NULL, -- 'text', 'image', 'video', 'audio', 'document', 'location', 'contact'
  content TEXT,
  reply_to_id UUID REFERENCES messages(id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  deleted_for_everyone BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

TABLE message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name VARCHAR(255),
  mime_type VARCHAR(100),
  file_size BIGINT,
  duration INTEGER, -- for audio/video
  width INTEGER, -- for images/video
  height INTEGER
);

TABLE message_reactions (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ,
  UNIQUE(message_id, user_id, emoji)
);

TABLE message_reads (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

TABLE statuses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- 'text', 'image', 'video'
  content TEXT,
  media_url TEXT,
  background_color VARCHAR(20),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

TABLE status_views (
  id UUID PRIMARY KEY,
  status_id UUID REFERENCES statuses(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id),
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

TABLE calls (
  id UUID PRIMARY KEY,
  caller_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- 'voice', 'video'
  status VARCHAR(20) NOT NULL, -- 'initiated', 'ringing', 'connected', 'ended', 'missed', 'rejected'
  started_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration INTEGER,
  group_chat_id UUID REFERENCES chats(id)
);

TABLE reports (
  id UUID PRIMARY KEY,
  reporter_id UUID REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL, -- 'user', 'message', 'group', 'status'
  target_id UUID NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

TABLE privacy_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  last_seen VARCHAR(20) DEFAULT 'everyone',
  online_status VARCHAR(20) DEFAULT 'everyone',
  profile_photo VARCHAR(20) DEFAULT 'everyone',
  about VARCHAR(20) DEFAULT 'everyone',
  status_privacy VARCHAR(20) DEFAULT 'contacts',
  read_receipts BOOLEAN DEFAULT TRUE,
  group_invites VARCHAR(20) DEFAULT 'everyone',
  calls VARCHAR(20) DEFAULT 'everyone'
);

TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_name VARCHAR(100),
  platform VARCHAR(20),
  ip_address INET,
  last_active_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

TABLE audit_logs (
  id UUID PRIMARY KEY,
  actor_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_messages_chat_created ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_chat_members_user ON chat_members(user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_statuses_expires ON statuses(expires_at);
CREATE INDEX idx_status_views_status ON status_views(status_id);`
  },
  {
    id: 'webrtc',
    title: 'WebRTC Calling Architecture',
    icon: Radio,
    content: `WebRTC architecture for voice and video calling:

┌──────────────┐                    ┌──────────────┐
│   Caller      │                    │   Receiver   │
│   (Flutter)   │                    │   (Flutter)  │
└──────┬───────┘                    └──────┬───────┘
       │                                    │
       │  1. Create Offer (SDP)             │
       ├───────────────────────────────────►│
       │         via Signaling Server       │
       │                                    │
       │  2. Answer with SDP                │
       │◄───────────────────────────────────┤
       │         via Signaling Server       │
       │                                    │
       │  3. ICE Candidates Exchange        │
       ├◄──────────────────────────────────►┤
       │                                    │
       │  4. Peer Connection Established    │
       ├◄══════════════════════════════════►┤
       │         Direct P2P (via TURN)      │
       │                                    │
       │  5. Media Stream Active            │
       ├◄══════════════════════════════════►┤
       │      Audio/Video RTP Streams       │
       └────────────────────────────────────┘

Service Architecture:

WebRTCService
├── initialize(config)
├── createPeerConnection()
├── createOffer() → RTCSessionDescription
├── handleAnswer(sdp)
├── addIceCandidate(candidate)
├── addMediaStream(stream)
├── removeMediaStream()
├── getLocalStream(constraints)
├── toggleAudio(enabled)
├── toggleVideo(enabled)
├── switchCamera()
├── close()
└── onStateChange(callback)

SignalingService
├── connect(token)
├── sendOffer(targetUserId, sdp)
├── sendAnswer(targetUserId, sdp)
├── sendIceCandidate(targetUserId, candidate)
├── sendCallEnd(targetUserId)
├── onOffer(callback)
├── onAnswer(callback)
├── onIceCandidate(callback)
├── onCallEnd(callback)
└── disconnect()

GroupCallService (Future SFU Integration)
├── joinRoom(roomId, userId)
├── leaveRoom(roomId)
├── publishStream(stream)
├── subscribeToStream(userId)
├── muteSelf()
├── unmuteSelf()
├── getParticipants()
└── onParticipantJoined(callback)

Required External Configuration:
├── STUN Server (e.g., Google STUN for dev)
├── TURN Server (e.g., coturn, Twilio)
├── Signaling Server (WebSocket-based)
└── SFU Server (for group calls - e.g., mediasoup, Janus)

NOTE: This architecture is WebRTC-ready but requires:
- TURN server credentials (not hardcoded)
- Signaling server deployment
- Proper STUN/TURN configuration via environment
- SFU for scalable group calls (not P2P)`
  },
  {
    id: 'security',
    title: 'Security Architecture',
    icon: Shield,
    content: `Security layers in PrayChat:

1. TRANSPORT SECURITY
   ├── All API calls over HTTPS (TLS 1.3)
   ├── WebSocket connections over WSS
   ├── Certificate pinning (configurable)
   └── No plaintext communication

2. AUTHENTICATION SECURITY
   ├── Password hashing: bcrypt (cost factor 12)
   ├── JWT tokens with short expiry (15 min access, 7 day refresh)
   ├── Refresh token rotation
   ├── OTP verification for phone login
   ├── Rate limiting on auth endpoints
   ├── Account lockout after failed attempts
   └── No secrets in Flutter source code

3. DATA SECURITY
   ├── Sensitive data in Flutter Secure Storage
   ├── API tokens never stored in SharedPreferences
   ├── Input validation on all user inputs
   ├── SQL injection prevention (parameterized queries)
   ├── XSS prevention in message rendering
   └── File upload validation (MIME, size, content)

4. AUTHORIZATION
   ├── Role-based access control (user, admin, superadmin)
   ├── Resource-level permissions
   ├── Chat membership verification
   ├── Group admin permission checks
   ├── Server-side enforcement (not client-only)
   └── Audit logging for admin actions

5. ENCRYPTION STATUS
   ├── Transport Encryption: IMPLEMENTED (HTTPS/WSS)
   ├── Server-side Encryption at Rest: REQUIRES CONFIGURATION
   ├── End-to-End Encryption: NOT YET IMPLEMENTED
   
   NOTE: PrayChat does NOT claim E2EE.
   Messages are encrypted in transit and at rest on server.
   True E2EE requires additional implementation:
   - Signal Protocol or similar
   - Key exchange mechanism
   - Per-device key management
   - Security audit before claiming E2EE

6. ENVIRONMENT SECURITY
   ├── No API keys in source code
   ├── No database credentials in Flutter
   ├── Environment variables for all secrets
   ├── .env files in .gitignore
   ├── CI/CD secret management
   └── Example config files (no real values)`
  },
  {
    id: 'realtime',
    title: 'Real-time Communication',
    icon: Cloud,
    content: `Real-time architecture using WebSocket connections:

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Flutter     │◄──────►│   WebSocket  │◄──────►│   Redis      │
│   Client      │   WSS  │   Gateway    │        │   Pub/Sub    │
└──────────────┘         └──────────────┘         └──────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Backend    │
                         │   Services   │
                         └──────────────┘

Real-time Events:
├── message.new          → New message in chat
├── message.edited       → Message was edited
├── message.deleted      → Message was deleted
├── message.reaction     → Reaction added/removed
├── typing.start         → User started typing
├── typing.stop          → User stopped typing
├── presence.online      → User came online
├── presence.offline     → User went offline
├── presence.lastSeen    → Last seen update
├── read.receipt         → Message read by user
├── delivery.receipt     → Message delivered
├── call.incoming        → Incoming call
├── call.accepted        → Call accepted
├── call.rejected        → Call rejected
├── call.ended           → Call ended
├── group.updated        → Group info changed
├── group.memberAdded    → Member added to group
├── group.memberRemoved  → Member removed from group
├── status.new           → New status posted
├── status.expired       → Status expired
└── notification.push    → Push notification trigger

Connection Management:
├── Auto-reconnect with exponential backoff
├── Heartbeat/ping-pong every 30 seconds
├── Connection state tracking
├── Message queue for offline period
├── Sync on reconnect
└── Graceful degradation

Offline Support:
├── Local SQLite cache for recent messages
├── Pending message queue
├── Automatic sync on reconnect
├── Conflict resolution (server wins for edits)
├── Cache invalidation on updates
└── Storage quota management`
  },
  {
    id: 'mobile',
    title: 'Flutter Mobile Architecture',
    icon: Smartphone,
    content: `Flutter application structure:

praychat/
├── android/                    # Android platform config
│   ├── app/
│   │   ├── build.gradle       # App signing, versions
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/           # Icons, splash
│   └── build.gradle
├── ios/                        # iOS platform (future)
├── lib/
│   ├── main.dart              # App entry point
│   ├── app/
│   │   ├── app.dart           # MaterialApp config
│   │   ├── routes.dart        # Navigation routes
│   │   └── theme.dart         # Theme configuration
│   ├── core/
│   │   ├── constants/         # App constants
│   │   ├── errors/            # Error handling
│   │   ├── network/           # HTTP client, interceptors
│   │   ├── storage/           # Secure storage, local cache
│   │   └── utils/             # Helpers, validators
│   ├── data/
│   │   ├── datasources/       # Remote & local data sources
│   │   ├── models/            # Data models (JSON serialization)
│   │   └── repositories/      # Repository implementations
│   ├── domain/
│   │   ├── entities/          # Business entities
│   │   ├── repositories/      # Repository interfaces
│   │   └── usecases/          # Business logic use cases
│   ├── presentation/
│   │   ├── pages/             # Screen widgets
│   │   ├── widgets/           # Reusable widgets
│   │   ├── providers/         # State management
│   │   └── themes/            # UI themes
│   └── services/
│       ├── auth_service.dart
│       ├── chat_service.dart
│       ├── message_service.dart
│       ├── group_service.dart
│       ├── media_service.dart
│       ├── call_service.dart
│       ├── webrtc_service.dart
│       ├── signaling_service.dart
│       ├── notification_service.dart
│       ├── realtime_service.dart
│       ├── storage_service.dart
│       ├── report_service.dart
│       └── status_service.dart
├── test/                       # Unit & widget tests
├── integration_test/           # Integration tests
├── pubspec.yaml               # Dependencies
├── .env.example               # Environment config template
├── .gitignore
└── README.md

State Management: Riverpod or BLoC pattern
Navigation: Go Router
HTTP Client: Dio with interceptors
Local Storage: flutter_secure_storage + sqflite
Real-time: web_socket_channel
WebRTC: flutter_webrtc
Camera: camera package
Audio: record + just_audio
Permissions: permission_handler
Push: firebase_messaging

Android Permissions Required:
├── INTERNET
├── CAMERA
├── RECORD_AUDIO
├── READ_CONTACTS (on demand)
├── ACCESS_FINE_LOCATION (on demand)
├── POST_NOTIFICATIONS (Android 13+)
├── READ_MEDIA_IMAGES (Android 13+)
├── READ_MEDIA_VIDEO (Android 13+)
└── VIBRATE`
  },
  {
    id: 'deployment',
    title: 'Deployment & Distribution',
    icon: Server,
    content: `Android Release Configuration:

1. BUILD VARIANTS
   ├── Debug: Development with hot reload
   ├── Profile: Performance profiling
   ├── Release APK: Direct installation
   └── Release AAB: App store distribution

2. SIGNING CONFIGURATION
   ├── Generate keystore: keytool -genkey -v -keystore upload-keystore.jks
   ├── Configure in android/key.properties (gitignored)
   ├── storeFile, storePassword, keyAlias, keyPassword
   ├── Separate signing configs for debug/release
   └── Never commit keystore or passwords

3. GOOGLE PLAY STORE PREPARATION
   ├── Release AAB (Android App Bundle)
   ├── App icon: 512x512 PNG
   ├── Feature graphic: 1024x500
   ├── Screenshots: Phone & tablet
   ├── Privacy policy URL (required)
   ├── Data safety form
   ├── Content rating questionnaire
   ├── Target audience declaration
   └── App description & short description

4. INDUS APPSTORE PREPARATION
   ├── Standard APK (same as Play Store)
   ├── App icon & screenshots
   ├── Description in English/Hindi
   ├── Privacy policy
   └── Category selection

5. VERSION MANAGEMENT
   ├── version: 1.0.0+1 (pubspec.yaml)
   ├── Semantic versioning: major.minor.patch+build
   ├── Changelog maintenance
   └── Version code auto-increment

6. REQUIRED EXTERNAL SERVICES FOR PRODUCTION
   ├── Backend Server (Node.js/Go/Python)
   ├── PostgreSQL Database
   ├── Redis (real-time, caching)
   ├── Object Storage (S3/MinIO for media)
   ├── TURN Server (coturn/Twilio for calls)
   ├── Signaling Server (WebSocket)
   ├── FCM Configuration (push notifications)
   ├── SMS Provider (Twilio/MSG91 for OTP)
   ├── Domain with SSL certificate
   └── CDN for media delivery`
  },
];

export default function Architecture() {
  const { resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');

  const currentSection = architectureSections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          System Architecture
        </h3>
        <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
          Complete technical architecture documentation for PrayChat
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className={`card p-2 space-y-1 lg:sticky lg:top-20`}>
            {architectureSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`sidebar-item w-full text-left ${activeSection === section.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span className="text-xs">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              {currentSection && React.createElement(currentSection.icon, {
                size: 24,
                className: 'text-primary-500'
              })}
              <h4 className={`text-lg font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                {currentSection?.title}
              </h4>
            </div>
            <pre className={`text-xs leading-relaxed overflow-x-auto p-4 rounded-lg whitespace-pre-wrap font-mono ${
              resolvedTheme === 'dark' ? 'bg-surface-900 text-surface-300 border border-surface-700' : 'bg-surface-50 text-surface-700 border border-surface-200'
            }`}>
              {currentSection?.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
