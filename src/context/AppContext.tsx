import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Dog,
  AdoptionApplication,
  MeetAndGreet,
  AdoptionAgreement,
  HandoverConfirmation,
  ChatMessage,
  Conversation,
  Post,
  Story,
  ReportItem,
  NotificationItem,
  OtpSession,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOGS,
  INITIAL_APPLICATIONS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { otpService } from '../services/otpService';
import { socketEngine, SocketMessagePayload } from '../services/socketService';
import { convexClient } from '../services/convexService';
import { api } from '../../convex/_generated/api';

interface AppContextType {
  // Authentication & Dynamic Users
  currentUser: User | null;
  allUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authPromptReason: string;
  setAuthPromptReason: (reason: string) => void;
  requireAuth: (reason: string, action?: () => void) => boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; code?: string }>;
  verifyOtp: (phone: string, code: string) => { success: boolean; isNewUser: boolean; message: string };
  completeRegistration: (userData: Omit<User, 'id' | 'joinedDate'>) => User;
  switchUser: (userId: string) => void;
  logout: () => void;
  dismissOtpToast: () => void;

  // Dogs & Marketplace
  dogs: Dog[];
  selectedDog: Dog | null;
  setSelectedDog: (dog: Dog | null) => void;
  addDog: (dogData: Omit<Dog, 'id' | 'interestedCount' | 'likesCount' | 'status'>) => Dog;
  toggleLikeDog: (dogId: string) => void;
  updateDogStatus: (dogId: string, status: Dog['status']) => void;

  // Adoption Applications
  applications: AdoptionApplication[];
  submitApplication: (data: Omit<AdoptionApplication, 'id' | 'status' | 'submittedAt'>) => void;
  acceptApplication: (applicationId: string) => void;
  declineApplication: (applicationId: string, reason?: string) => void;

  // Meet and Greets
  meetups: MeetAndGreet[];
  scheduleMeetup: (data: Omit<MeetAndGreet, 'id' | 'status'>) => void;
  acceptMeetup: (meetupId: string) => void;

  // Agreements & Transfer Handover
  agreements: AdoptionAgreement[];
  signAgreement: (applicationId: string, role: 'owner' | 'adopter', signature: string) => void;
  
  handovers: HandoverConfirmation[];
  confirmHandover: (applicationId: string, role: 'owner' | 'adopter') => void;

  // Chat System
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  setActiveConversationId: (convId: string | null) => void;
  sendMessage: (convId: string, text: string, image?: string, isDogBark?: boolean) => void;
  openChatForDog: (dog: Dog, initialMessage?: string) => void;

  // Social Feed & Stories
  posts: Post[];
  stories: Story[];
  likePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  createPost: (image: string, caption: string, tags: string[], dogId: string) => void;
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;

  // Reports & Safety Moderation
  reports: ReportItem[];
  submitReport: (listingId: string, dogName: string, reason: ReportItem['reason'], details: string) => void;
  resolveReport: (reportId: string, action: 'resolve' | 'dismiss') => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (notifId: string) => void;
  unreadNotifsCount: number;

  // Theme (Light / Dark Mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Modals & Navigation Views
  activeTab: 'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs' | 'admin';
  setActiveTab: (tab: 'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs' | 'admin') => void;
  isListDogOpen: boolean;
  setIsListDogOpen: (open: boolean) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  celebrationData: {
    isOpen: boolean;
    dog: Dog | null;
    adopter: User | null;
    owner: User | null;
    type: 'match' | 'transfer';
  } | null;
  setCelebrationData: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    dog: Dog | null;
    adopter: User | null;
    owner: User | null;
    type: 'match' | 'transfer';
  } | null>>;
  viewingCertificateDog: Dog | null;
  setViewingCertificateDog: (dog: Dog | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const cleanPhone = (p?: string) => (p || '').replace(/\D/g, '').slice(-10);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Registry & Auth State
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pawconnect_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pawconnect_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it's a seed/mock demo user, discard it and start logged out
        if (!parsed || parsed.id === 'user_sarah' || parsed.id === 'user_alex' || parsed.id === 'user_priya' || parsed.name === 'Sarah Jenkins') {
          localStorage.removeItem('pawconnect_current_user');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null; // Start logged out as guest
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState('');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);

  // 2. Theme State ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pawconnect_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('pawconnect_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist allUsers to localStorage whenever users list changes
  useEffect(() => {
    localStorage.setItem('pawconnect_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 3. Navigation Tab
  const [activeTab, setActiveTab] = useState<'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs' | 'admin'>('discover');

  // 4. Dogs State (Real user-listed dogs only)
  const [dogs, setDogs] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('pawconnect_dogs');
    if (saved) {
      try {
        const parsed: Dog[] = JSON.parse(saved);
        const mockIds = ['dog_bruno', 'dog_luna', 'dog_milo', 'dog_rocky', 'dog_coco', 'dog_pogo'];
        const filtered = parsed.filter(d => !mockIds.includes(d.id) && d.breed !== 'Golden Retriever Mix');
        if (filtered.length > 0) {
          try { localStorage.setItem('pawconnect_dogs', JSON.stringify(filtered)); } catch (e) {}
          return filtered;
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Persist dogs state to localStorage whenever dogs list changes
  useEffect(() => {
    localStorage.setItem('pawconnect_dogs', JSON.stringify(dogs));
  }, [dogs]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  // 4. Applications State (Only keep applications for currently existing listed dogs)
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    const saved = localStorage.getItem('pawconnect_applications');
    if (saved) {
      try {
        const parsed: AdoptionApplication[] = JSON.parse(saved);
        const validDogIds = dogs.map(d => d.id);
        return parsed.filter(a =>
          validDogIds.includes(a.dogId) &&
          !['dog_bruno', 'dog_luna', 'dog_milo', 'dog_rocky'].includes(a.dogId) &&
          !a.dogId.includes('bruno') && !a.dogId.includes('luna') && !a.dogId.includes('milo') && !a.dogId.includes('rocky')
        );
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 5. Meetups
  const [meetups, setMeetups] = useState<MeetAndGreet[]>(() => {
    const saved = localStorage.getItem('pawconnect_meetups');
    if (saved) {
      try {
        const parsed: MeetAndGreet[] = JSON.parse(saved);
        const validDogIds = dogs.map(d => d.id);
        return parsed.filter(m => validDogIds.includes(m.dogId));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 6. Agreements
  const [agreements, setAgreements] = useState<AdoptionAgreement[]>(() => {
    const saved = localStorage.getItem('pawconnect_agreements');
    if (saved) {
      try {
        const parsed: AdoptionAgreement[] = JSON.parse(saved);
        const validDogIds = dogs.map(d => d.id);
        return parsed.filter(a => validDogIds.includes(a.dogId));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 7. Handover Confirmations
  const [handovers, setHandovers] = useState<HandoverConfirmation[]>(() => {
    const saved = localStorage.getItem('pawconnect_handovers');
    if (saved) {
      try {
        const parsed: HandoverConfirmation[] = JSON.parse(saved);
        const validDogIds = dogs.map(d => d.id);
        return parsed.filter(h => validDogIds.includes(h.dogId));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 8. Chat Conversations — deduplicated by dogId (one thread per dog)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('pawconnect_conversations');
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved);
        const validDogIds = dogs.map(d => d.id);
        const filtered = Array.isArray(parsed)
          ? parsed.filter(c => validDogIds.includes(c.dogId))
          : [];
        // Deduplicate: keep only the latest conversation per dogId
        const deduped = Object.values(
          filtered.reduce((acc: Record<string, Conversation>, conv) => {
            const existing = acc[conv.dogId];
            // Prefer the one with more recent timestamp or higher unread count
            if (!existing || (conv.unreadCount || 0) >= (existing.unreadCount || 0)) {
              acc[conv.dogId] = conv;
            }
            return acc;
          }, {})
        );
        if (deduped.length > 0) {
          // Persist the cleaned-up version back immediately
          try { localStorage.setItem('pawconnect_conversations', JSON.stringify(deduped)); } catch (e) {}
          return deduped;
        }
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // 🌟 Clean up legacy orphaned data if no dogs exist
  useEffect(() => {
    if (dogs.length === 0) {
      setApplications([]);
      setConversations([]);
      setMeetups([]);
      setAgreements([]);
      setHandovers([]);
      setMessages({});
      localStorage.removeItem('pawconnect_applications');
      localStorage.removeItem('pawconnect_conversations');
      localStorage.removeItem('pawconnect_messages');
      localStorage.removeItem('pawconnect_meetups');
      localStorage.removeItem('pawconnect_agreements');
      localStorage.removeItem('pawconnect_handovers');
    }
  }, [dogs]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('pawconnect_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          // Strip ALL msg_auto_ bot messages and old mock conversation keys
          const cleaned: Record<string, ChatMessage[]> = {};
          const OLD_MOCK_KEYS = ['conv_alex_sarah_bruno', 'conv_david_sarah_luna', 'conv_david_sarah_milo', 'conv_david_sarah_rocky'];
          for (const [convId, msgs] of Object.entries(parsed)) {
            if (OLD_MOCK_KEYS.includes(convId)) continue; // skip old mock data
            const realMsgs = (msgs as ChatMessage[]).filter(m => !m.id.startsWith('msg_auto_'));
            if (realMsgs.length > 0) cleaned[convId] = realMsgs;
          }
          if (Object.keys(cleaned).length > 0) return cleaned;
        }
      } catch (e) {
        // fallback to empty
      }
    }
    return {};
  });


  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // 9. Social Posts & Stories
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('pawconnect_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('pawconnect_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // 10. Reports & Safety
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('pawconnect_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // 11. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pawconnect_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 12. Modals
  const [isListDogOpen, setIsListDogOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    dog: Dog | null;
    adopter: User | null;
    owner: User | null;
    type: 'match' | 'transfer';
  } | null>(null);
  const [viewingCertificateDog, setViewingCertificateDog] = useState<Dog | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pawconnect_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pawconnect_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pawconnect_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pawconnect_dogs', JSON.stringify(dogs));
  }, [dogs]);

  useEffect(() => {
    localStorage.setItem('pawconnect_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('pawconnect_meetups', JSON.stringify(meetups));
  }, [meetups]);

  useEffect(() => {
    localStorage.setItem('pawconnect_agreements', JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem('pawconnect_handovers', JSON.stringify(handovers));
  }, [handovers]);

  useEffect(() => {
    localStorage.setItem('pawconnect_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('pawconnect_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('pawconnect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('pawconnect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pawconnect_reports', JSON.stringify(reports));
  }, [reports]);

  // 🧹 One-time startup cleanup: purge old auto-bot messages & mock data from localStorage
  useEffect(() => {
    const CLEANUP_VERSION = 'v3_no_auto_msgs';
    if (localStorage.getItem('pawconnect_cleanup') !== CLEANUP_VERSION) {
      const OLD_MOCK_KEYS = ['conv_alex_sarah_bruno', 'conv_david_sarah_luna', 'conv_david_sarah_milo', 'conv_david_sarah_rocky'];
      const savedMsgs = localStorage.getItem('pawconnect_messages');
      if (savedMsgs) {
        try {
          const parsed = JSON.parse(savedMsgs);
          const cleaned: Record<string, unknown[]> = {};
          for (const [convId, msgs] of Object.entries(parsed)) {
            if (OLD_MOCK_KEYS.includes(convId)) continue;
            const realMsgs = (msgs as Array<{ id: string }>).filter(m => !m.id.startsWith('msg_auto_'));
            if (realMsgs.length > 0) cleaned[convId] = realMsgs;
          }
          localStorage.setItem('pawconnect_messages', JSON.stringify(cleaned));
          // Also purge from in-memory state
          setMessages(cleaned as Record<string, ChatMessage[]>);
        } catch (e) {}
      }
      localStorage.setItem('pawconnect_cleanup', CLEANUP_VERSION);
    }
  }, []);


    const fetchConvexCloudData = async () => {
      try {
        const cloudDogs = await convexClient.query(api.dogs.list);
        if (isMounted && Array.isArray(cloudDogs) && cloudDogs.length > 0) {
          const formatted: Dog[] = cloudDogs.map((d: any) => ({
            id: d.id,
            name: d.name,
            breed: d.breed,
            age: d.age,
            gender: d.gender,
            size: d.size,
            energy: d.energy,
            location: d.location,
            lat: d.lat,
            lng: d.lng,
            city: d.city || 'Kolkata',
            coverPhoto: d.coverPhoto,
            photos: d.photos || [d.coverPhoto],
            bio: d.bio,
            reasonForAdoption: d.reasonForAdoption,
            adoptionType: d.adoptionType,
            status: d.status,
            currentOwnerId: d.currentOwnerId,
            currentOwnerName: d.currentOwnerName,
            currentOwnerAvatar: d.currentOwnerAvatar,
            currentOwnerPhone: d.currentOwnerPhone,
            isOwnerVerified: d.isOwnerVerified,
            vaccinated: d.vaccinated,
            neutered: d.neutered,
            microchipped: d.microchipped,
            medicalNotes: d.medicalNotes,
            favoriteThings: d.favoriteThings || [],
            personalityTraits: d.personalityTraits || [],
            interestedCount: d.interestedCount || 0,
            likesCount: d.likesCount || 0,
          }));
          setDogs(formatted);
        }

        // ☁️ Sync Cloud Users across all ports
        try {
          const cloudUsers = await convexClient.query(api.users.list);
          if (isMounted && Array.isArray(cloudUsers) && cloudUsers.length > 0) {
            setAllUsers(prev => {
              const map = new Map<string, User>();
              prev.forEach(u => map.set(u.id, u));
              cloudUsers.forEach((u: any) => {
                if (u.id && u.name) {
                  map.set(u.id, {
                    id: u.id,
                    name: u.name,
                    phone: u.phone || '',
                    email: u.email || '',
                    avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                    role: u.role || 'adopter',
                    location: u.location || 'Kolkata',
                    isVerified: u.isVerified ?? true,
                    joinedDate: u.joinedDate || 'February 2025',
                    homeType: u.homeType || 'Apartment',
                    hasYard: u.hasYard ?? false,
                    otherPets: u.otherPets || 'None',
                    experienceLevel: u.experienceLevel || 'Intermediate',
                    bio: u.bio || 'Verified pet lover',
                  });
                }
              });
              return Array.from(map.values());
            });
          }
        } catch (e) {}

        // ☁️ Sync Cloud Messages across all ports (5173 <-> 5174 etc.)
        const cloudMsgs = await convexClient.query(api.messages.listAll);
        if (isMounted && Array.isArray(cloudMsgs) && cloudMsgs.length > 0) {
          // Only add genuinely NEW messages (by id)
          setMessages(prev => {
            const existingIds = new Set<string>();
            Object.values(prev).forEach((msgs: ChatMessage[]) =>
              msgs.forEach(m => existingIds.add(m.id))
            );

            const updated = { ...prev };
            let changed = false;
            cloudMsgs.forEach((m: any) => {
              if (m.id.startsWith('msg_auto_')) return; // Block auto bot messages from cloud sync
              if (!existingIds.has(m.id)) {
                const convMsgs = updated[m.conversationId] || [];
                updated[m.conversationId] = [...convMsgs, {
                  id: m.id,
                  conversationId: m.conversationId,
                  senderId: m.senderId,
                  senderName: m.senderName,
                  senderAvatar: m.senderAvatar,
                  recipientId: m.recipientId,
                  text: m.text,
                  image: m.image,
                  isDogBark: m.isDogBark,
                  timestamp: m.timestamp,
                  read: true
                }];
                changed = true;
              }
            });
            return changed ? updated : prev;
          });

          // Sync conversations with the latest messages from cloud
          setConversations(prev => {
            const currentDogs = dogsRef.current;
            let updated = [...prev];
            let changed = false;

            // Group cloud messages by dogId to get the latest message for each dog
            const dogLatestMsgMap = new Map<string, any>();
            cloudMsgs.forEach((m: any) => {
              const matchedDog = currentDogs.find(d => m.conversationId.includes(d.id));
              const dogId = matchedDog?.id || currentDogs[0]?.id || '';
              if (dogId) {
                const prevMsg = dogLatestMsgMap.get(dogId);
                if (!prevMsg || m.id > prevMsg.id) {
                  dogLatestMsgMap.set(dogId, { ...m, dogId, matchedDog });
                }
              }
            });

            dogLatestMsgMap.forEach((latest, dogId) => {
              const existingIndex = updated.findIndex(c => c.dogId === dogId);
              if (existingIndex >= 0) {
                const existing = updated[existingIndex];
                if (existing.lastMessage !== latest.text) {
                  updated[existingIndex] = {
                    ...existing,
                    lastMessage: latest.text,
                    lastMessageTimestamp: latest.timestamp || 'Just now',
                  };
                  changed = true;
                }
              } else {
                // Add conversation thread
                updated.unshift({
                  id: latest.conversationId,
                  dogId: dogId,
                  dogName: latest.matchedDog?.name || 'Adoptable Pup',
                  dogAvatar: latest.matchedDog?.coverPhoto || latest.senderAvatar,
                  participants: [latest.senderId, latest.recipientId],
                  lastMessage: latest.text,
                  lastMessageTimestamp: latest.timestamp || 'Just now',
                  unreadCount: 1
                });
                changed = true;
              }
            });

            return changed ? updated : prev;
          });
        }
      } catch (err) {
        // Fallback to local state
      }
    };

    fetchConvexCloudData();
    // Poll every 2 seconds — less aggressive than 1.5s to reduce UI thrashing
    const interval = setInterval(fetchConvexCloudData, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Empty array: run once. dogs accessed via dogsRef to avoid infinite loop.

  // ⚡ Live Bidirectional Web Socket Subscription
  useEffect(() => {
    const unsubscribe = socketEngine.subscribe((payload: SocketMessagePayload) => {
      setMessages(prev => {
        const existing = prev[payload.conversationId] || [];
        if (existing.some(m => m.id === payload.id || (m.senderId === payload.senderId && m.text === payload.text && m.timestamp === payload.timestamp))) return prev;
        const incomingMsg: ChatMessage = {
          id: payload.id,
          conversationId: payload.conversationId,
          senderId: payload.senderId,
          senderName: payload.senderName,
          senderAvatar: payload.senderAvatar,
          recipientId: payload.recipientId,
          text: payload.text,
          image: payload.image,
          isDogBark: payload.isDogBark,
          timestamp: payload.timestamp,
          read: true
        };
        return {
          ...prev,
          [payload.conversationId]: [...existing, incomingMsg]
        };
      });

      setConversations(prev => {
        const existsByConvId = prev.some(c => c.id === payload.conversationId);
        const existsByDogId = payload.dogId ? prev.some(c => c.dogId === payload.dogId) : false;

        if (existsByConvId) {
          // Update last message on the existing conversation
          return prev.map(c =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  lastMessage: payload.isDogBark ? '🐾 Woof! (Audio Bark)' : payload.text,
                  lastMessageTimestamp: 'Just now',
                  unreadCount: c.id === activeConversationId ? c.unreadCount : c.unreadCount + 1
                }
              : c
          );
        } else if (existsByDogId) {
          // A conversation for this dog already exists with a different convId — don't add a new one
          return prev;
        } else {
          // Genuinely new dog conversation — add it
          const newThread: Conversation = {
            id: payload.conversationId,
            dogId: payload.dogId || 'dog_general',
            dogName: payload.dogName || 'Adoptable Pup',
            dogAvatar: payload.dogAvatar || payload.senderAvatar,
            participants: payload.participants || [payload.senderId, payload.recipientId],
            lastMessage: payload.isDogBark ? '🐾 Woof! (Audio Bark)' : payload.text,
            lastMessageTimestamp: 'Just now',
            unreadCount: 1
          };
          return [newThread, ...prev];
        }
      });
    });
    return () => unsubscribe();
  }, [activeConversationId]);

  // ⚡ Cross-Tab Storage Event Listener for Instant Synchronized State Across 5173 & 5174
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pawconnect_messages' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setMessages(parsed);
        } catch (err) {}
      }
      if (e.key === 'pawconnect_conversations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setConversations(parsed);
        } catch (err) {}
      }
      if (e.key === 'pawconnect_dogs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDogs(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // Auth Guard Helper
  const requireAuth = (reason: string, action?: () => void): boolean => {
    if (currentUser) {
      if (action) action();
      return true;
    }
    setAuthPromptReason(reason);
    setPendingAuthAction(() => action || null);
    setIsAuthModalOpen(true);
    return false;
  };

  // Send OTP via Dynamic OTP Service
  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string; code?: string }> => {
    try {
      return await otpService.sendOtp(phone);
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to dispatch OTP.',
      };
    }
  };

  // Verify OTP via Dynamic OTP Service or Firebase
  const verifyOtp = (phone: string, code: string) => {
    const cleanInput = cleanPhone(phone);
    const existing = allUsers.find(u => cleanPhone(u.phone) === cleanInput);

    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem('pawconnect_current_user', JSON.stringify(existing));
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      }
      return { success: true, isNewUser: false, message: `Welcome back, ${existing.name}!` };
    }

    // Use phone-based stable ID so SAME phone always gets SAME user ID across all browser windows/ports
    const stableUserId = `user_${cleanInput}`;

    const defaultNewUser: User = {
      id: stableUserId,
      name: `Pet Lover (${cleanInput.slice(-4)})`,
      phone: phone,
      role: 'adopter',
      location: '',
      bio: 'Loving dog guardian and verified pet adopter.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isVerified: true,
      homeType: 'Apartment',
      hasYard: false,
      otherPets: 'None',
      experienceLevel: 'Intermediate',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    setAllUsers(prev => [defaultNewUser, ...prev]);
    setCurrentUser(defaultNewUser);
    localStorage.setItem('pawconnect_current_user', JSON.stringify(defaultNewUser));

    // ☁️ Sync to Convex Cloud Users Table
    try {
      convexClient.mutation(api.users.upsertUser, {
        id: defaultNewUser.id,
        name: defaultNewUser.name,
        phone: defaultNewUser.phone,
        avatar: defaultNewUser.avatar,
        role: defaultNewUser.role,
        location: defaultNewUser.location || 'Kolkata',
        isVerified: defaultNewUser.isVerified,
        joinedDate: defaultNewUser.joinedDate,
        homeType: defaultNewUser.homeType,
        hasYard: defaultNewUser.hasYard,
        otherPets: defaultNewUser.otherPets,
        experienceLevel: defaultNewUser.experienceLevel,
        bio: defaultNewUser.bio,
      }).catch(() => {});
    } catch (e) {}

    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }

    return { success: true, isNewUser: true, message: 'OTP verified! Complete your profile.' };
  };

  // Complete Registration for New User
  const completeRegistration = (userData: Omit<User, 'id' | 'joinedDate'>): User => {
    const newUser: User = {
      ...userData,
      id: currentUser?.id || `user_${Date.now()}`,
      joinedDate: currentUser?.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    setAllUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
    setCurrentUser(newUser);
    localStorage.setItem('pawconnect_current_user', JSON.stringify(newUser));

    // ☁️ Sync to Convex Cloud Users Table
    try {
      convexClient.mutation(api.users.upsertUser, {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
        location: newUser.location || 'Kolkata',
        isVerified: newUser.isVerified,
        joinedDate: newUser.joinedDate,
        homeType: newUser.homeType,
        hasYard: newUser.hasYard,
        otherPets: newUser.otherPets,
        experienceLevel: newUser.experienceLevel,
        bio: newUser.bio,
      }).catch(() => {});
    } catch (e) {}

    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pawconnect_current_user');
  };

  const dismissOtpToast = () => {
    setActiveOtpSession(null);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Add Dog
  const addDog = (dogData: Omit<Dog, 'id' | 'interestedCount' | 'likesCount' | 'status'>): Dog => {
    const ownerId = currentUser?.id || 'user_guest';
    const ownerName = currentUser?.name || 'Pet Guardian';
    const ownerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
    const ownerPhone = currentUser?.phone || '+91 98765 00000';

    const newDog: Dog = {
      ...dogData,
      id: `dog_${Date.now()}`,
      status: 'available',
      interestedCount: 0,
      likesCount: 1,
      currentOwnerId: ownerId,
      currentOwnerName: ownerName,
      currentOwnerAvatar: ownerAvatar,
      currentOwnerPhone: ownerPhone,
      isOwnerVerified: currentUser?.isVerified ?? true,
    };
    setDogs(prev => [newDog, ...prev]);

    // ☁️ Sync to Convex Cloud Dogs Table
    try {
      convexClient.mutation(api.dogs.create, {
        id: newDog.id,
        name: newDog.name,
        breed: newDog.breed,
        age: newDog.age,
        gender: newDog.gender,
        size: newDog.size,
        energy: newDog.energy,
        location: newDog.location,
        lat: newDog.lat,
        lng: newDog.lng,
        city: newDog.city || 'Kolkata',
        coverPhoto: newDog.coverPhoto,
        photos: newDog.photos,
        bio: newDog.bio,
        reasonForAdoption: newDog.reasonForAdoption,
        adoptionType: newDog.adoptionType,
        status: newDog.status,
        currentOwnerId: newDog.currentOwnerId,
        currentOwnerName: newDog.currentOwnerName,
        currentOwnerAvatar: newDog.currentOwnerAvatar,
        currentOwnerPhone: newDog.currentOwnerPhone,
        isOwnerVerified: newDog.isOwnerVerified,
        vaccinated: newDog.vaccinated,
        neutered: newDog.neutered,
        microchipped: newDog.microchipped,
        medicalNotes: newDog.medicalNotes || 'Up to date on vaccinations.',
        favoriteThings: newDog.favoriteThings,
        personalityTraits: newDog.personalityTraits,
        interestedCount: newDog.interestedCount,
        likesCount: newDog.likesCount,
      }).catch(() => {});
    } catch (e) {}

    // Announcement post on PawFeed
    const announcementPost: Post = {
      id: `post_${Date.now()}`,
      dogId: newDog.id,
      dogName: newDog.name,
      dogBreed: newDog.breed,
      dogAvatar: newDog.photos[0] || newDog.coverPhoto,
      ownerId: ownerId,
      ownerName: ownerName,
      image: newDog.coverPhoto,
      caption: `🐾 Exciting news! ${newDog.name} (${newDog.breed}, ${newDog.age}) is officially listed for adoption on PawConnect! Let's help them find a forever home! ❤️`,
      location: newDog.location,
      tags: [`#${newDog.breed.replace(/\s+/g, '')}`, '#AdoptDontShop', '#PawConnect'],
      likes: 12,
      likedBy: [ownerId],
      comments: [],
      createdAt: 'Just now'
    };
    setPosts(prev => [announcementPost, ...prev]);

    return newDog;
  };

  const toggleLikeDog = (dogId: string) => {
    setDogs(prev =>
      prev.map(dog => {
        if (dog.id === dogId) {
          const isLiked = !dog.isLiked;
          return {
            ...dog,
            isLiked,
            likesCount: isLiked ? dog.likesCount + 1 : dog.likesCount - 1
          };
        }
        return dog;
      })
    );
  };

  const updateDogStatus = (dogId: string, status: Dog['status']) => {
    setDogs(prev => prev.map(d => (d.id === dogId ? { ...d, status } : d)));
  };

  // Submit Application
  const submitApplication = (data: Omit<AdoptionApplication, 'id' | 'status' | 'submittedAt'>) => {
    const appId = `app_${Date.now()}`;
    const newApp: AdoptionApplication = {
      ...data,
      id: appId,
      status: 'submitted',
      submittedAt: 'Just now'
    };
    setApplications(prev => [newApp, ...prev]);

    setDogs(prev => prev.map(d => d.id === data.dogId ? { ...d, interestedCount: d.interestedCount + 1 } : d));

    const targetDog = dogs.find(d => d.id === data.dogId);
    if (targetDog) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: targetDog.currentOwnerId,
        title: `🐾 New Adoption Request for ${targetDog.name}!`,
        message: `${data.applicantName} submitted an adoption application. Check their profile & living situation.`,
        type: 'application_received',
        relatedDogId: targetDog.id,
        relatedApplicationId: newApp.id,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);

      // 🌟 Conversation Unlock on Application Received (1.5s delay)
      setTimeout(() => {
        setApplications(prev =>
          prev.map(a => (a.id === appId ? { ...a, status: 'accepted', reviewedAt: 'Just now' } : a))
        );
        updateDogStatus(data.dogId, 'pending');

        const convId = `conv_${data.dogId}_${data.applicantId}`;

        // Only unlock the conversation thread — no auto-generated bot messages
        setConversations(prev => {
          const exists = prev.some(c => c.id === convId || c.dogId === data.dogId);
          if (exists) return prev;
          return [
            {
              id: convId,
              dogId: data.dogId,
              dogName: data.dogName,
              dogAvatar: data.dogPhoto,
              participants: [targetDog.currentOwnerId, data.applicantId],
              lastMessage: `Chat unlocked — say hi to start the conversation!`,
              lastMessageTimestamp: 'Just now',
              unreadCount: 0
            },
            ...prev
          ];
        });

        const acceptNotif: NotificationItem = {
          id: `notif_accept_${Date.now()}`,
          userId: data.applicantId,
          title: `🎉 Application Approved for ${data.dogName}!`,
          message: `Guardian approved your request! Private chat is now active — send them a message.`,
          type: 'application_accepted',
          relatedDogId: targetDog.id,
          relatedApplicationId: appId,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prev => [acceptNotif, ...prev]);
      }, 1500);
    }
  };

  // Accept Application (Manual Owner Trigger)
  const acceptApplication = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    const currentUserId = currentUser?.id || 'user_alex';
    const currentUserName = currentUser?.name || 'Alex Rivera';
    const currentUserAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    setApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'accepted', reviewedAt: 'Just now' } : a))
    );

    updateDogStatus(app.dogId, 'pending');

    const convId = `conv_${app.dogId}_${app.applicantId}`;
    setConversations(prev => {
      const exists = prev.some(c => c.id === convId);
      if (exists) return prev;
      return [
        {
          id: convId,
          dogId: app.dogId,
          dogName: app.dogName,
          dogAvatar: app.dogPhoto,
          participants: [currentUserId, app.applicantId],
          lastMessage: `Application accepted! Say hi to ${app.applicantName}.`,
          lastMessageTimestamp: 'Just now',
          unreadCount: 0
        },
        ...prev
      ];
    });

    const msgId = `msg_${Date.now()}`;
    const msgText = `🎉 Hi ${app.applicantName}! I loved your application for ${app.dogName}. The chat is now unlocked so we can coordinate questions and schedule our Meet & Greet!`;

    setMessages(prev => ({
      ...prev,
      [convId]: [
        {
          id: msgId,
          conversationId: convId,
          senderId: currentUserId,
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          recipientId: app.applicantId,
          text: msgText,
          timestamp: 'Just now',
          read: false
        }
      ]
    }));

    // ⚡ Emit live socket payload so applicant instantly gets approved conversation on tab/window!
    socketEngine.emitMessage({
      id: msgId,
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      recipientId: app.applicantId,
      text: msgText,
      timestamp: 'Just now',
      dogId: app.dogId,
      dogName: app.dogName,
      dogAvatar: app.dogPhoto,
      participants: [currentUserId, app.applicantId]
    });

    const dog = dogs.find(d => d.id === app.dogId) || null;
    const applicant = allUsers.find(u => u.id === app.applicantId) || {
      id: app.applicantId,
      name: app.applicantName,
      phone: app.applicantPhone,
      email: app.applicantEmail,
      avatar: app.applicantAvatar,
      role: 'adopter' as const,
      location: app.applicantLocation,
      isVerified: true,
      joinedDate: '2025',
      homeType: app.homeType,
      hasYard: app.hasYard,
      otherPets: app.otherPets,
      experienceLevel: 'Intermediate' as const,
      bio: app.reason
    };

    setCelebrationData({
      isOpen: true,
      dog,
      adopter: applicant,
      owner: currentUser,
      type: 'match'
    });

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: app.applicantId,
      title: `🎉 ${app.dogName}'s Guardian Accepted Your Application!`,
      message: `${currentUserName} accepted your request. Private chat is now unlocked!`,
      type: 'application_accepted',
      relatedDogId: app.dogId,
      relatedApplicationId: app.id,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const declineApplication = (applicationId: string, reason?: string) => {
    setApplications(prev =>
      prev.map(a =>
        a.id === applicationId
          ? { ...a, status: 'declined', reviewedAt: 'Just now', declineReason: reason || 'Application declined by guardian.' }
          : a
      )
    );
  };

  const scheduleMeetup = (data: Omit<MeetAndGreet, 'id' | 'status'>) => {
    const meetId = `meet_${Date.now()}`;
    const newMeet: MeetAndGreet = {
      ...data,
      id: meetId,
      status: 'scheduled'
    };
    setMeetups(prev => [newMeet, ...prev]);
    updateDogStatus(data.dogId, 'meet_scheduled');

    const convId = `conv_${data.dogId}_${data.adopterId}`;
    sendMessage(
      convId,
      `📅 Meet & Greet Scheduled for ${data.date} at ${data.time} (📍 ${data.locationName}). Looking forward to meeting!`
    );

    // 🌟 Real-time Guardian Meetup Confirmation (1.5s delay)
    setTimeout(() => {
      setMeetups(prev => prev.map(m => (m.id === meetId ? { ...m, status: 'completed' } : m)));
      updateDogStatus(data.dogId, 'agreement_pending');

      sendMessage(
        convId,
        `🤝 Park Meet & Greet for ${data.dogName} is confirmed! Stage 5 (Digital Legal Agreement) is now unlocked.`
      );

      const notif: NotificationItem = {
        id: `notif_meet_${Date.now()}`,
        userId: data.adopterId,
        title: `🌳 Meet & Greet Confirmed for ${data.dogName}!`,
        message: `Guardian confirmed the meetup. You can now review and sign the Digital Adoption Agreement.`,
        type: 'meeting_scheduled',
        relatedDogId: data.dogId,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }, 1500);
  };

  const acceptMeetup = (meetupId: string) => {
    setMeetups(prev => prev.map(m => (m.id === meetupId ? { ...m, status: 'completed' } : m)));
    const meet = meetups.find(m => m.id === meetupId);
    if (meet) {
      updateDogStatus(meet.dogId, 'agreement_pending');
    }
  };

  const signAgreement = (applicationId: string, role: 'owner' | 'adopter', signature: string) => {
    const targetApp = applications.find(a => a.id === applicationId);
    const targetDog = dogs.find(d => d.id === targetApp?.dogId);
    const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    setAgreements(prev =>
      prev.map(agree => {
        if (agree.applicationId === applicationId) {
          const updated = {
            ...agree,
            ownerSignature: role === 'owner' ? signature : agree.ownerSignature,
            ownerSignedAt: role === 'owner' ? nowStr : agree.ownerSignedAt,
            adopterSignature: role === 'adopter' ? signature : agree.adopterSignature,
            adopterSignedAt: role === 'adopter' ? nowStr : agree.adopterSignedAt,
          };
          updated.isFullySigned = Boolean(updated.ownerSignature && updated.adopterSignature);
          return updated;
        }
        return agree;
      })
    );

    // 🌟 If adopter signed, simulate Guardian counter-signing automatically (1.2s delay)
    if (role === 'adopter' && targetDog && targetApp) {
      setTimeout(() => {
        const guardianSig = targetDog.currentOwnerName || 'Alex Rivera';
        setAgreements(prev =>
          prev.map(agree => {
            if (agree.applicationId === applicationId) {
              return {
                ...agree,
                ownerSignature: guardianSig,
                ownerSignedAt: nowStr,
                isFullySigned: true,
              };
            }
            return agree;
          })
        );

        const convId = `conv_${targetApp.dogId}_${targetApp.applicantId}`;
        sendMessage(
          convId,
          `✍️ Both parties have digitally signed the Legal Transfer Agreement for ${targetApp.dogName}! Proceeding to Stage 6 (Dual Handover).`
        );

        const signNotif: NotificationItem = {
          id: `notif_sign_${Date.now()}`,
          userId: targetApp.applicantId,
          title: `📜 Agreement Fully Signed for ${targetApp.dogName}!`,
          message: `Guardian counter-signed the agreement. Dual Handover confirmation is now ready.`,
          type: 'agreement_signed',
          relatedDogId: targetApp.dogId,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prev => [signNotif, ...prev]);
      }, 1200);
    }
  };

  const confirmHandover = (applicationId: string, role: 'owner' | 'adopter') => {
    const targetApp = applications.find(a => a.id === applicationId);
    const targetDog = dogs.find(d => d.id === targetApp?.dogId);
    const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    // Mark current role confirmation
    setHandovers(prev =>
      prev.map(h => {
        if (h.applicationId === applicationId) {
          return {
            ...h,
            ownerConfirmed: role === 'owner' ? true : h.ownerConfirmed,
            ownerConfirmedAt: role === 'owner' ? nowStr : h.ownerConfirmedAt,
            adopterConfirmed: role === 'adopter' ? true : h.adopterConfirmed,
            adopterConfirmedAt: role === 'adopter' ? nowStr : h.adopterConfirmedAt,
          };
        }
        return h;
      })
    );

    // 🌟 Real-time Guardian Handover Confirmation (1.2s delay) to complete adoption!
    setTimeout(() => {
      const certId = `CERT-PAW-${Date.now().toString().slice(-6)}`;
      const adoptedDateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

      setHandovers(prev =>
        prev.map(h => {
          if (h.applicationId === applicationId) {
            return {
              ...h,
              ownerConfirmed: true,
              ownerConfirmedAt: nowStr,
              adopterConfirmed: true,
              adopterConfirmedAt: nowStr,
              isCompleted: true,
              completedAt: nowStr
            };
          }
          return h;
        })
      );

      if (targetApp && targetDog) {
        const adopterUser = allUsers.find(u => u.id === targetApp.applicantId) || currentUser || INITIAL_USERS[0];

        setDogs(prev =>
          prev.map(dog => {
            if (dog.id === targetDog.id) {
              return {
                ...dog,
                status: 'adopted',
                previousOwnerId: dog.currentOwnerId,
                previousOwnerName: dog.currentOwnerName,
                newOwnerId: adopterUser.id,
                newOwnerName: adopterUser.name,
                currentOwnerId: adopterUser.id,
                currentOwnerName: adopterUser.name,
                currentOwnerAvatar: adopterUser.avatar,
                adoptedDate: adoptedDateStr,
                certificateId: certId,
              };
            }
            return dog;
          })
        );

        setApplications(prev =>
          prev.map(a => (a.id === applicationId ? { ...a, status: 'completed' } : a))
        );

        setCelebrationData({
          isOpen: true,
          dog: { ...targetDog, status: 'adopted', newOwnerName: adopterUser.name, certificateId: certId },
          adopter: adopterUser,
          owner: currentUser,
          type: 'transfer'
        });

        const convId = `conv_${targetDog.id}_${targetApp.applicantId}`;
        sendMessage(
          convId,
          `🏆 Official Handover Completed! ${targetDog.name} is legally registered under ${adopterUser.name}. Certificate #${certId} generated!`
        );

        const transferNotif: NotificationItem = {
          id: `notif_trans_${Date.now()}`,
          userId: targetApp.applicantId,
          title: `🏆 Adoption Completed! ${targetDog.name} is officially yours!`,
          message: `Physical handover confirmed. Certificate #${certId} has been generated on your dashboard!`,
          type: 'dog_transferred',
          relatedDogId: targetDog.id,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prev => [transferNotif, ...prev]);
      }
    }, 1200);
  };

  const sendMessage = (convId: string, text: string, image?: string, isDogBark?: boolean) => {
    if (!currentUser) return; // Must be logged in to send
    const senderId = currentUser.id;
    const senderName = currentUser.name || 'User';
    const senderAvatar = currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    const targetConv = conversations.find(c => c.id === convId);

    // Resolve recipientId reliably: find the OTHER participant who is NOT the sender
    // Also fallback to dog's owner if we can't figure it out from participants
    const targetDogForMsg = targetConv ? dogs.find(d => d.id === targetConv.dogId) : null;
    let recipientId = targetConv?.participants.find(p => p !== senderId) || '';
    if (!recipientId && targetDogForMsg) {
      // If sender IS the owner, recipient is unknown adopter — use first participant
      // If sender is NOT the owner, recipient is the dog's current owner
      recipientId = senderId === targetDogForMsg.currentOwnerId
        ? (targetConv?.participants.find(p => p !== senderId) || 'user_adopter')
        : targetDogForMsg.currentOwnerId;
    }
    if (!recipientId) recipientId = 'user_unknown'; // Absolute fallback — never let it be empty

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId,
      senderName,
      senderAvatar,
      recipientId,
      text,
      image,
      isDogBark,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    // Emit live socket payload with conversation metadata
    socketEngine.emitMessage({
      id: newMsg.id,
      conversationId: convId,
      senderId,
      senderName,
      senderAvatar,
      recipientId,
      text,
      image,
      timestamp: newMsg.timestamp,
      isDogBark,
      dogId: targetConv?.dogId,
      dogName: targetConv?.dogName,
      dogAvatar: targetConv?.dogAvatar,
      participants: targetConv?.participants
    });

    // ☁️ Persist to Convex Cloud Database for multi-origin & multi-port real-time syncing
    try {
      convexClient.mutation(api.messages.send, {
        id: newMsg.id,
        conversationId: convId,
        senderId,
        senderName,
        senderAvatar,
        recipientId,
        text,
        image: image || undefined,
        isDogBark: isDogBark || undefined,
        timestamp: newMsg.timestamp,
        read: true,
      }).catch(() => {});
    } catch (e) {}

    setMessages(prev => {
      const existing = prev[convId] || [];
      if (existing.some(m => m.id === newMsg.id || (m.senderId === senderId && m.text === text && m.timestamp === newMsg.timestamp))) {
        return prev;
      }
      return {
        ...prev,
        [convId]: [...existing, newMsg]
      };
    });

    setConversations(prev =>
      prev.map(c =>
        c.id === convId
          ? {
              ...c,
              lastMessage: isDogBark ? '🐾 Woof! (Audio Bark)' : text,
              lastMessageTimestamp: 'Just now'
            }
          : c
      )
    );
  };

  const openChatForDog = (dog: Dog, initialMessage?: string) => {
    if (!currentUser) return; // Must be logged in
    const currentUserId = currentUser.id;
    const isOwner = currentUserId === dog.currentOwnerId;

    // If a conversation for this exact dog already exists in state, just open it
    const existingConv = conversations.find(c => c.dogId === dog.id);

    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('chat');
      return;
    }

    // Create a new dedicated thread for this dog
    // Participants: [ownerID, adopterID] — always keep owner as first participant
    const adopterId = isOwner ? 'user_adopter' : currentUserId;
    const ownerId = isOwner ? currentUserId : dog.currentOwnerId;
    const convId = `conv_${dog.id}_${adopterId}`;

    const newConv: Conversation = {
      id: convId,
      dogId: dog.id,
      dogName: dog.name,
      dogAvatar: dog.coverPhoto,
      participants: [ownerId, adopterId],
      lastMessage: initialMessage || `Hi ${dog.currentOwnerName}! I am interested in adopting ${dog.name}.`,
      lastMessageTimestamp: 'Just now',
      unreadCount: 0
    };

    const initialMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUser.name || 'User',
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      recipientId: isOwner ? adopterId : ownerId,
      text: initialMessage || `Hi ${dog.currentOwnerName}! I am interested in learning more about ${dog.name} and would love to ask a few questions about their daily routine.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    // Remove ALL existing conversations for this dog before adding new one
    setConversations(prev => [newConv, ...prev.filter(c => c.dogId !== dog.id)]);
    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), initialMsg]
    }));

    // ☁️ Persist initial message to Convex Cloud (critical for cross-port sync)
    try {
      convexClient.mutation(api.messages.send, {
        id: initialMsg.id,
        conversationId: convId,
        senderId: initialMsg.senderId,
        senderName: initialMsg.senderName,
        senderAvatar: initialMsg.senderAvatar,
        recipientId: initialMsg.recipientId,
        text: initialMsg.text,
        timestamp: initialMsg.timestamp,
        read: true,
      }).catch(() => {});
    } catch (e) {}

    // ⚡ Emit live socket payload so dog owner instantly gets conversation & message on their tab/window!
    socketEngine.emitMessage({
      id: initialMsg.id,
      conversationId: convId,
      senderId: currentUserId,
      senderName: initialMsg.senderName,
      senderAvatar: initialMsg.senderAvatar,
      recipientId: initialMsg.recipientId,
      text: initialMsg.text,
      timestamp: initialMsg.timestamp,
      dogId: dog.id,
      dogName: dog.name,
      dogAvatar: dog.coverPhoto,
      participants: [ownerId, adopterId]
    });

    setActiveConversationId(convId);
    setActiveTab('chat');
  };



  const likePost = (postId: string) => {
    const userId = currentUser?.id || 'user_guest';
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter(id => id !== userId)
              : [...post.likedBy, userId]
          };
        }
        return post;
      })
    );
  };

  const addPostComment = (postId: string, text: string) => {
    const userId = currentUser?.id || 'user_guest';
    const userName = currentUser?.name || 'Guest User';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    const newComment = {
      id: `c_${Date.now()}`,
      userId,
      userName,
      userAvatar,
      text,
      timestamp: 'Just now'
    };
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  const createPost = (image: string, caption: string, tags: string[], dogId: string) => {
    const dog = dogs.find(d => d.id === dogId) || dogs[0];
    const userId = currentUser?.id || 'user_guest';
    const userName = currentUser?.name || 'Guest User';

    const newPost: Post = {
      id: `post_${Date.now()}`,
      dogId: dog.id,
      dogName: dog.name,
      dogBreed: dog.breed,
      dogAvatar: dog.photos[0] || dog.coverPhoto,
      ownerId: userId,
      ownerName: userName,
      image,
      caption,
      location: dog.location,
      tags,
      likes: 1,
      likedBy: [userId],
      comments: [],
      createdAt: 'Just now'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const submitReport = (listingId: string, dogName: string, reason: ReportItem['reason'], details: string) => {
    const userId = currentUser?.id || 'user_guest';
    const userName = currentUser?.name || 'Guest User';

    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      listingId,
      dogName,
      reportedById: userId,
      reportedByName: userName,
      reason,
      details,
      timestamp: 'Just now',
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'resolve' | 'dismiss') => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r))
    );
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = currentUser
    ? notifications.filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authPromptReason,
        setAuthPromptReason,
        requireAuth,
        sendOtp,
        verifyOtp,
        completeRegistration,
        switchUser,
        logout,
        dismissOtpToast,
        dogs,
        selectedDog,
        setSelectedDog,
        addDog,
        toggleLikeDog,
        updateDogStatus,
        applications,
        submitApplication,
        acceptApplication,
        declineApplication,
        meetups,
        scheduleMeetup,
        acceptMeetup,
        agreements,
        signAgreement,
        handovers,
        confirmHandover,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        openChatForDog,
        posts,
        stories,
        likePost,
        addPostComment,
        createPost,
        activeStory,
        setActiveStory,
        reports,
        submitReport,
        resolveReport,
        notifications,
        markNotificationAsRead,
        unreadNotifsCount,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        isListDogOpen,
        setIsListDogOpen,
        isApplyModalOpen,
        setIsApplyModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        celebrationData,
        setCelebrationData,
        viewingCertificateDog,
        setViewingCertificateDog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
