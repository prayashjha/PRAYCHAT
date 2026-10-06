import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageGet, storageSet, KEYS } from './utils/storage';

type Lang = 'en' | 'hi';

// All translations - ek hi jagah, koi duplicate nahi
const T: Record<string, [string, string]> = {
  // Auth
  welcome: ['Welcome to PrayChat', 'PrayChat mein swagat hai'],
  tagline: ['Connect with Faith', 'Vishwas se juden'],
  phone: ['Phone Number', 'Phone Number'],
  enterPhone: ['Enter your phone number', 'Apna phone number daalein'],
  name: ['Your Name', 'Aapka Naam'],
  enterName: ['Enter your name', 'Apna naam daalein'],
  otp: ['Verify OTP', 'OTP Verify Karein'],
  otpSent: ['OTP sent to', 'OTP bheja gaya'],
  enterOtp: ['Enter 6-digit code', '6-digit code daalein'],
  demoOtp: ['Demo OTP', 'Demo OTP'],
  continue: ['Continue', 'Aage Badhein'],
  verify: ['Verify', 'Verify Karein'],
  startChat: ['Start Chatting', 'Chat Shuru Karein'],
  back: ['Back', 'Peeche'],
  changeNum: ['Change number', 'Number badlein'],
  // Tabs
  chats: ['Chats', 'Chats'],
  status: ['Status', 'Status'],
  calls: ['Calls', 'Calls'],
  // Chat
  search: ['Search...', 'Khojein...'],
  typeMsg: ['Type a message', 'Message likhein'],
  online: ['online', 'online'],
  lastSeen: ['last seen', 'aakhri baar'],
  noChats: ['No conversations yet', 'Abhi koi baatcheet nahi'],
  startConv: ['Start a conversation', 'Baatcheet shuru karein'],
  newChat: ['New Chat', 'Nayi Chat'],
  newGroup: ['New Group', 'Naya Group'],
  members: ['members', 'sadasya'],
  admin: ['Admin', 'Admin'],
  today: ['Today', 'Aaj'],
  yesterday: ['Yesterday', 'Kal'],
  pinned: ['Pinned', 'Pin kiya'],
  you: ['You', 'Aap'],
  // Messages
  reply: ['Reply', 'Jawab'],
  edit: ['Edit', 'Badlein'],
  delete: ['Delete', 'Hataein'],
  deleteMe: ['Delete for me', 'Mere liye hatayein'],
  deleteAll: ['Delete for everyone', 'Sabke liye hatayein'],
  star: ['Star', 'Taara'],
  copy: ['Copy', 'Copy'],
  forward: ['Forward', 'Aage bhejein'],
  reacted: ['Reacted', 'React kiya'],
  msgDeleted: ['This message was deleted', 'Ye message hata diya gaya'],
  edited: ['edited', 'badla gaya'],
  // Status
  myStatus: ['My Status', 'Mera Status'],
  addStatus: ['Add status', 'Status add karein'],
  recent: ['Recent updates', 'Haal ke updates'],
  noStatus: ['No status updates', 'Koi status nahi'],
  // Calls
  noCalls: ['No call history', 'Koi call history nahi'],
  incoming: ['Incoming', 'Aane wali'],
  outgoing: ['Outgoing', 'Jaane wali'],
  missed: ['Missed', 'Chhoot gayi'],
  // Settings
  settings: ['Settings', 'Settings'],
  profile: ['Profile', 'Profile'],
  about: ['About', 'About'],
  username: ['Username', 'Username'],
  phoneNum: ['Phone', 'Phone'],
  editProfile: ['Edit Profile', 'Profile Badlein'],
  save: ['Save', 'Save'],
  appearance: ['Appearance', 'Appearance'],
  darkMode: ['Dark Mode', 'Dark Mode'],
  lightMode: ['Light Mode', 'Light Mode'],
  systemTheme: ['System Theme', 'System Theme'],
  language: ['Language', 'Bhasha'],
  logout: ['Log Out', 'Log Out'],
  deleteAccount: ['Delete Account', 'Account Delete Karein'],
  deleteConfirm: ['Are you sure? This cannot be undone.', 'Kya aap sure hain? Ye wapas nahi hoga.'],
  // Group
  groupName: ['Group Name', 'Group Ka Naam'],
  groupDesc: ['Description (optional)', 'Vivaran (optional)'],
  selectMembers: ['Select Members', 'Sadasya Chunein'],
  create: ['Create', 'Banao'],
  leaveGroup: ['Leave Group', 'Group Chhodein'],
  deleteChat: ['Delete Chat', 'Chat Hataein'],
  // Install
  installApp: ['Install PrayChat', 'PrayChat Install Karein'],
  installDesc: ['Install on phone for quick access', 'Phone pe install karein jaldi access ke liye'],
  later: ['Later', 'Baad mein'],
  install: ['Install', 'Install'],
};

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string; }
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => storageGet(KEYS.LANG, 'en'));
  const setLang = (l: Lang) => { setLangState(l); storageSet(KEYS.LANG, l); };
  const t = (key: string): string => T[key]?.[lang === 'hi' ? 1 : 0] ?? key;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
