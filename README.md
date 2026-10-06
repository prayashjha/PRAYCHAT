# 🙏 PrayChat - Connect with Faith

**Ek complete WhatsApp-jaisa messaging PWA jo seedha aapke phone par install hoti hai.**

![PrayChat](https://img.shields.io/badge/PrayChat-v1.0.0-6366f1)
![Size](https://img.shields.io/badge/gzipped-63KB-green)
![PWA](https://img.shields.io/badge/PWA-ready-blue)

---

## 📁 Folder Structure

```
praychat/
├── src/
│   ├── App.tsx              → Routing + tabs + auth + new chat/group
│   ├── store.ts             → Single Zustand store (poora state)
│   ├── firebase.ts          → Firebase config + lazy init
│   ├── ThemeContext.tsx     → Sirf theme (dark/light/system)
│   ├── LanguageContext.tsx  → Sirf language (en/hi)
│   ├── main.tsx             → Entry point
│   ├── index.css            → Tailwind + custom styles
│   ├── components/
│   │   ├── ChatList.tsx     → Chat list screen
│   │   ├── ChatScreen.tsx   → Individual chat view
│   │   ├── MessageBubble.tsx → Single message UI
│   │   ├── StatusTab.tsx    → Status/Stories screen
│   │   ├── CallsTab.tsx     → Call history screen
│   │   └── SettingsTab.tsx  → Settings screen
│   └── utils/
│       ├── storage.ts       → localStorage + BroadcastChannel adapter
│       └── time.ts          → Timestamp formatting
├── public/
│   ├── manifest.json        → PWA manifest
│   ├── sw.js                → Service worker (offline support)
│   └── icons/
│       └── icon.svg         → App icon (all sizes)
├── index.html               → HTML with PWA meta tags
├── README.md                → This file
└── INSTALL_GUIDE.md         → Phone install steps
```

---

## ✨ Features

### ✅ Fully Working
- **Phone + OTP Login** (demo OTP screen pe dikhta hai)
- **1-to-1 Chat** - Text messages with full CRUD
- **Group Chat** - Create, add members, admin roles
- **Message Features** - Reply, edit, delete, reactions, star, copy
- **Read Receipts** - ✓ sent, ✓✓ delivered, ✓✓ blue (read)
- **Emoji Picker** - Quick emoji insertion
- **Status/Stories** - Text status with custom colors, 24h expiry
- **Call History** - Incoming/outgoing/missed tracking
- **Dark/Light/System Theme** - Smooth transitions
- **English/Hindi** - Complete i18n
- **PWA Install** - Home screen icon, full-screen, offline
- **Cross-Tab Sync** - Do tabs mein real-time chat (BroadcastChannel)
- **Privacy-First** - Sab data aapke phone mein, koi server nahi

### 🔜 Firebase Integration Ready
Sirf `src/firebase.ts` mein config bharo, aur app automatic Firebase pe switch ho jayegi:
- Firebase Auth (phone OTP)
- Firestore (real-time messages)
- Firebase Storage (media)
- FCM (push notifications)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy
Upload `dist/` folder to any static hosting:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Any server**: Copy `dist/` to web root

**Important**: HTTPS zaroori hai PWA ke liye!

---

## 📱 Phone Par Install Kaise Karein

### Android (Chrome/Edge)
1. Website kholein Chrome mein
2. 3 seconds baad popup aayega "Install PrayChat"
3. **"Install"** button dabayein
4. Confirm karein
5. ✅ Home screen pe icon ban jayega!

### iPhone (Safari)
1. Website kholein Safari mein
2. Share button (↑) dabayein
3. **"Add to Home Screen"** select karein
4. **"Add"** dabayein
5. ✅ Home screen pe icon ban jayega!

---

## 🔥 Firebase Setup (Optional)

Agar aap real backend chahte hain:

### Step 1: Firebase Project Banao
1. [Firebase Console](https://console.firebase.google.com) jao
2. **"Add project"** click karo
3. Project name: `praychat`
4. Google Analytics disable karo (optional)
5. **"Create project"** click karo

### Step 2: Web App Add Karo
1. Project dashboard pe gear icon ⚙️ > **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Web icon (</>) click karo
4. App nickname: `PrayChat`
5. **"Register app"** click karo
6. Config copy karo (ye next step mein chahiye)

### Step 3: Config Bharo
`src/firebase.ts` file kholo aur config bharo:

```typescript
export const firebaseConfig = {
  apiKey: 'AIza...',              // Firebase se copy karo
  authDomain: 'praychat.firebaseapp.com',
  projectId: 'praychat',
  storageBucket: 'praychat.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123:web:abc...',
};
```

### Step 4: Firestore Enable Karo
1. Firebase Console > **"Build"** > **"Firestore Database"**
2. **"Create database"** click karo
3. **"Start in test mode"** select karo
4. Location: `asia-south1` (Mumbai)
5. **"Enable"** click karo

### Step 5: Auth Enable Karo
1. Firebase Console > **"Build"** > **"Authentication"**
2. **"Get started"** click karo
3. **"Phone"** sign-in method enable karo
4. Save karo

### Step 6: Storage Enable Karo
1. Firebase Console > **"Build"** > **"Storage"**
2. **"Get started"** click karo
3. **"Start in test mode"** select karo
4. **"Done"** click karo

### Step 7: Deploy
```bash
npm run build
# dist/ folder deploy karo
```

**Bas! Ab app Firebase use karegi for real-time messaging.**

---

## 🧪 Testing (Bina Firebase Ke)

Agar Firebase config nahi bhari, to app localStorage mode mein chalegi:

### Cross-Tab Chat Test:
1. Browser mein 2 tabs kholo (same URL)
2. Tab 1 mein: Phone `9876543210`, Name `Alice`
3. Tab 2 mein: Phone `9876543211`, Name `Bob`
4. Tab 1 mein: New Chat > Bob select karo
5. Message type karo
6. Tab 2 mein automatic message dikhega! ✅

Ye BroadcastChannel API se hota hai - real-time sync across tabs.

---

## 📊 Size Breakdown

| Chunk | Size (gzipped) | Description |
|-------|----------------|-------------|
| Main bundle | 63 KB | React + App code |
| CSS | 6 KB | Tailwind styles |
| Firebase (lazy) | 171 KB | Only loads when configured |
| **Total (no Firebase)** | **69 KB** | ✅ Under 100KB |
| **Total (with Firebase)** | **240 KB** | Still fast with code-splitting |

---

## 🔒 Privacy

- ✅ **No server** - Sab data aapke phone mein
- ✅ **No tracking** - Koi analytics nahi
- ✅ **No ads** - Completely ad-free
- ✅ **Offline** - Bina internet ke bhi kaam kare
- ✅ **Open source** - Code dekh sakte ho

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (super fast)
- **Tailwind CSS 4** - Styling
- **Zustand** - State management (single store)
- **Firebase** (optional) - Backend
- **BroadcastChannel** - Cross-tab sync
- **Service Worker** - Offline support

---

## 📝 TODO (Future Enhancements)

- [ ] Media sharing (images, videos, documents)
- [ ] Voice messages
- [ ] Voice/Video calls (WebRTC)
- [ ] End-to-end encryption
- [ ] Push notifications (FCM)
- [ ] Contact synchronization
- [ ] Message search (full-text)
- [ ] Link previews
- [ ] Message forwarding
- [ ] Group mentions (@user)

---

## 🐛 Troubleshooting

### Install button nahi dikh raha?
- Browser refresh karo
- Cache clear karo (Settings > Clear browsing data)
- Ensure HTTPS hai (PWA ke liye zaroori)
- Different browser try karo

### Messages sync nahi ho rahe?
- Same browser use karo jisme login kiya
- Private/Incognito mode use mat karo
- localStorage enabled hona chahiye

### Firebase switch nahi ho raha?
- `src/firebase.ts` mein config check karo
- Firebase Console mein project active hona chahiye
- Browser console mein errors check karo

---

## 📞 Support

- **Issue found?** GitHub pe report karo
- **Feature request?** Suggestion do
- **Love the app?** Star karo! ⭐

---

## 📄 License

MIT License - Use freely, modify as needed.

---

**Built with ❤️ for PrayChat**

*Connect with Faith* 🙏✨
