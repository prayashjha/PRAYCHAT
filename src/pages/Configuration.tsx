import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Settings, Key, Globe, Database, Cloud, Bell, Radio, Lock, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

const configSections = [
  {
    id: 'environment',
    title: 'Environment Configuration',
    icon: Settings,
    description: 'Required environment variables for all services',
    content: `# .env.example - PrayChat Configuration
# NEVER commit actual values to version control

# ============================================
# API Configuration
# ============================================
API_BASE_URL=https://api.praychat.example.com
API_VERSION=v1
API_TIMEOUT=30000

# ============================================
# WebSocket Configuration
# ============================================
WEBSOCKET_URL=wss://ws.praychat.example.com
WS_RECONNECT_INTERVAL=5000
WS_HEARTBEAT_INTERVAL=30000

# ============================================
# Database Configuration (Backend)
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/praychat
DATABASE_POOL_SIZE=20
DATABASE_SSL=true

# ============================================
# Redis Configuration
# ============================================
REDIS_URL=redis://host:6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# ============================================
# Object Storage Configuration
# ============================================
STORAGE_ENDPOINT=https://storage.praychat.example.com
STORAGE_BUCKET=praychat-media
STORAGE_REGION=ap-south-1
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
STORAGE_MAX_FILE_SIZE=104857600
STORAGE_CDN_URL=https://cdn.praychat.example.com

# ============================================
# Authentication Configuration
# ============================================
JWT_SECRET=your_jwt_secret_min_256_bits
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
OTP_LENGTH=6
OTP_EXPIRY=300

# ============================================
# SMS/OTP Provider Configuration
# ============================================
SMS_PROVIDER=twilio
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret
SMS_SENDER_ID=PRAYCHAT
SMS_FROM_NUMBER=+1234567890

# ============================================
# Push Notification Configuration
# ============================================
FCM_SERVER_KEY=your_fcm_server_key
FCM_PROJECT_ID=your_firebase_project_id
FCM_SENDER_ID=your_fcm_sender_id
APNS_KEY_ID=your_apns_key_id
APNS_TEAM_ID=your_apns_team_id
APNS_KEY_PATH=/path/to/apns_key.p8

# ============================================
# WebRTC Configuration
# ============================================
WEBRTC_STUN_URL=stun:stun.l.google.com:19302
WEBRTC_TURN_URL=turn:turn.praychat.example.com:3478
WEBRTC_TURN_USERNAME=turn_username
WEBRTC_TURN_PASSWORD=turn_password
WEBRTC_ICE_SERVERS_CONFIG=config_json

# ============================================
# Signaling Server
# ============================================
SIGNALING_URL=wss://signal.praychat.example.com
SIGNALING_AUTH_TOKEN=your_signaling_auth_token

# ============================================
# Email Configuration
# ============================================
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@praychat.example.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_NAME=PrayChat
SMTP_FROM_EMAIL=noreply@praychat.example.com

# ============================================
# Security Configuration
# ============================================
CORS_ORIGINS=https://praychat.example.com,https://admin.praychat.example.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
ENCRYPTION_KEY=your_encryption_key_for_data_at_rest

# ============================================
# Logging & Monitoring
# ============================================
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
METRICS_ENABLED=true`
  },
  {
    id: 'android',
    title: 'Android Build Configuration',
    icon: Globe,
    description: 'Android-specific build and release configuration',
    content: `# android/app/build.gradle (Release Configuration)

android {
    namespace "com.praychat.app"
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.praychat.app"
        minSdkVersion 23
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        
        // Environment variables injected at build time
        resValue "string", "api_base_url", project.findProperty("API_BASE_URL") ?: ""
        resValue "string", "websocket_url", project.findProperty("WEBSOCKET_URL") ?: ""
    }
    
    signingConfigs {
        release {
            // Loaded from key.properties (gitignored)
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            signingConfig signingConfigs.debug
            applicationIdSuffix ".debug"
        }
    }
}

# android/app/src/main/AndroidManifest.xml (Permissions)

<manifest>
    <!-- Required -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Media (Android 13+) -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    
    <!-- Legacy Media (pre-Android 13) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="29" />
    
    <!-- On-demand permissions -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <!-- Hardware features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />
</manifest>

# Build Commands

# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# Release AAB (for Play Store)
flutter build appbundle --release

# With environment variables
flutter build appbundle --release \\
  --dart-define=API_BASE_URL=https://api.praychat.com \\
  --dart-define=WEBSOCKET_URL=wss://ws.praychat.com`
  },
  {
    id: 'firebase',
    title: 'Firebase & Push Configuration',
    icon: Bell,
    description: 'Firebase Cloud Messaging and push notification setup',
    content: `# Firebase Configuration for PrayChat

## Setup Steps:

1. Create Firebase Project at console.firebase.google.com
2. Add Android App with package: com.praychat.app
3. Download google-services.json → android/app/
4. Enable Cloud Messaging in Firebase Console
5. Configure APNs for iOS (future)

## google-services.json (Place in android/app/)
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "praychat-xxxxx",
    "storage_bucket": "praychat-xxxxx.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:xxx:android:xxx",
        "android_client_info": {
          "package_name": "com.praychat.app"
        }
      },
      "api_key": [
        {
          "current_key": "YOUR_API_KEY"
        }
      ]
    }
  ]
}

## Push Notification Types:

New Message:
{
  "to": "user_fcm_token",
  "notification": {
    "title": "New Message",
    "body": "Sender: Message preview...",
    "icon": "notification_icon",
    "channel_id": "messages"
  },
  "data": {
    "type": "message",
    "chat_id": "chat_uuid",
    "message_id": "message_uuid",
    "sender_id": "user_uuid"
  }
}

Incoming Call:
{
  "to": "user_fcm_token",
  "priority": "high",
  "notification": {
    "title": "Incoming Call",
    "body": "Caller Name is calling...",
    "channel_id": "calls"
  },
  "data": {
    "type": "call",
    "call_id": "call_uuid",
    "caller_id": "user_uuid",
    "call_type": "voice"
  }
}

## Notification Channels (Android):

messages     → Message notifications (default sound)
calls        → Call notifications (ringtone)
groups       → Group notifications (silent by default)
status       → Status updates (silent)
system       → System notifications (default sound)

## IMPORTANT:
- FCM Server Key must be stored server-side only
- Never include FCM credentials in Flutter code
- Use Firebase Admin SDK on backend
- Token refresh must be handled in Flutter app`
  },
  {
    id: 'storage',
    title: 'Object Storage Configuration',
    icon: Cloud,
    description: 'Media storage using S3-compatible object storage',
    content: `# Object Storage Configuration

## Supported Providers:
- AWS S3
- Google Cloud Storage
- MinIO (self-hosted)
- DigitalOcean Spaces
- Backblaze B2

## Configuration (Backend):

const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 's3',
  endpoint: process.env.STORAGE_ENDPOINT,
  region: process.env.STORAGE_REGION,
  bucket: process.env.STORAGE_BUCKET,
  accessKey: process.env.STORAGE_ACCESS_KEY,
  secretKey: process.env.STORAGE_SECRET_KEY,
  cdnUrl: process.env.STORAGE_CDN_URL,
};

## Bucket Structure:

praychat-media/
├── profile-photos/
│   └── {user_id}/
│       └── {timestamp}_{uuid}.{ext}
├── chat-media/
│   └── {chat_id}/
│       ├── images/
│       ├── videos/
│       ├── documents/
│       └── audio/
├── status-media/
│   └── {user_id}/
│       └── {timestamp}_{uuid}.{ext}
├── group-photos/
│   └── {group_id}/
│       └── {timestamp}_{uuid}.{ext}
└── voice-messages/
    └── {message_id}/
        └── {timestamp}_{uuid}.ogg

## File Validation Rules:

Images:
├── Allowed: JPEG, PNG, GIF, WebP
├── Max size: 16 MB
├── Max dimensions: 4096 x 4096
└── Thumbnails: 200x200 generated

Videos:
├── Allowed: MP4, WebM, MOV
├── Max size: 100 MB
├── Max duration: 5 minutes (status), 30 min (chat)
└── Thumbnails: First frame extracted

Documents:
├── Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
├── Max size: 100 MB
└── Preview: PDF first page thumbnail

Audio:
├── Allowed: OGG, MP3, AAC, M4A
├── Max size: 16 MB
├── Max duration: 10 minutes
└── Waveform: Generated for voice messages

## Access Control:
├── Profile photos: Public read (CDN cached)
├── Chat media: Signed URLs with expiry
├── Status media: Signed URLs (24h expiry)
├── Voice messages: Signed URLs
└── Documents: Signed URLs with download headers

## CDN Configuration:
├── CloudFront (AWS) or Cloudflare
├── Cache TTL: Profile photos 24h, media 1h
├── Compression: Images auto-optimized
└── HTTPS only`
  },
  {
    id: 'webrtc-config',
    title: 'WebRTC & TURN Server Configuration',
    icon: Radio,
    description: 'TURN/STUN server setup for reliable calling',
    content: `# WebRTC Configuration

## TURN Server Setup (coturn):

# Install coturn
sudo apt install coturn

# /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
external-ip=YOUR_SERVER_PUBLIC_IP
relay-ip=YOUR_SERVER_PRIVATE_IP

realm=turn.praychat.example.com
server-name=praychat.example.com

lt-cred-mech
use-auth-secret
static-auth-secret=YOUR_TURN_SECRET

total-quota=100
bps-capacity=0
stale-nonce=600

cert=/etc/letsencrypt/live/turn.praychat.example.com/fullchain.pem
pkey=/etc/letsencrypt/live/turn.praychat.example.com/privkey.pem

no-cli
no-multicast-peers

# Start service
sudo systemctl enable coturn
sudo systemctl start coturn

## Flutter WebRTC Configuration:

// lib/services/webrtc_service.dart

class WebRTCConfig {
  final List<RTCIceServer> iceServers;
  
  WebRTCConfig.fromEnvironment() : iceServers = [
    RTCIceServer(
      urls: [String.fromEnvironment('WEBRTC_STUN_URL', 
        defaultValue: 'stun:stun.l.google.com:19302')],
    ),
    RTCIceServer(
      urls: [String.fromEnvironment('WEBRTC_TURN_URL')],
      username: String.fromEnvironment('WEBRTC_TURN_USERNAME'),
      credential: String.fromEnvironment('WEBRTC_TURN_PASSWORD'),
    ),
  ];
}

## Signaling Server (Node.js example):

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, 'http://localhost').searchParams.get('token');
  
  try {
    const user = jwt.verify(token, process.env.SIGNALING_AUTH_TOKEN);
    ws.userId = user.id;
    
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      // Route signaling messages between peers
      routeSignal(message, ws);
    });
  } catch (err) {
    ws.close(4001, 'Unauthorized');
  }
});

## IMPORTANT NOTES:
├── TURN credentials should be time-limited
├── Use HMAC-based temporary credentials
├── Never hardcode TURN passwords in Flutter
├── Signaling server needs proper authentication
├── WebRTC works P2P for 1:1 calls
├── Group calls require SFU (not P2P mesh)
└── SFU options: mediasoup, Janus, LiveKit`
  },
];

export default function Configuration() {
  const { resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('environment');
  const [copied, setCopied] = useState(false);

  const currentSection = configSections.find(s => s.id === activeSection);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSection?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
          Configuration Guide
        </h3>
        <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
          Complete configuration documentation for all external services
        </p>
      </div>

      {/* Warning Banner */}
      <div className={`card flex items-start gap-3 ${
        resolvedTheme === 'dark' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
      }`}>
        <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
            Security Notice
          </p>
          <p className={`text-xs mt-1 ${resolvedTheme === 'dark' ? 'text-yellow-400/80' : 'text-yellow-700'}`}>
            Never commit actual secrets, API keys, or passwords to version control. 
            Use environment variables and secure secret management in production.
            All configuration examples shown use placeholder values.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1 lg:sticky lg:top-20">
            {configSections.map((section) => {
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {currentSection && React.createElement(currentSection.icon, {
                  size: 24,
                  className: 'text-primary-500'
                })}
                <div>
                  <h4 className={`text-lg font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-surface-900'}`}>
                    {currentSection?.title}
                  </h4>
                  <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
                    {currentSection?.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`btn btn-secondary text-xs ${copied ? 'text-green-500' : ''}`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className={`text-xs leading-relaxed overflow-x-auto p-4 rounded-lg whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto scrollbar-thin ${
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
