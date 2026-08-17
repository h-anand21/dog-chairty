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

interface AppContextType {
  // Authentication & Dynamic Users
  currentUser: User | null;
  allUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authPromptReason: string;
  setAuthPromptReason: (reason: string) => void;
  requireAuth: (reason: string, action?: () => void) => boolean;
  activeOtpSession: OtpSession | null;
  sendOtp: (phone: string) => string;
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 3. Navigation Tab
  const [activeTab, setActiveTab] = useState<'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs' | 'admin'>('discover');

  // 4. Dogs State
  const [dogs, setDogs] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('pawconnect_dogs');
    if (saved) {
      try {
        const parsed: Dog[] = JSON.parse(saved);
        // Ensure all active dogs are open and available for adoption (unless fully adopted)
        return parsed.map(d => (d.status === 'adopted' ? d : { ...d, status: 'available' as const }));
      } catch (e) {
        return INITIAL_DOGS;
      }
    }
    return INITIAL_DOGS;
  });
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  // 4. Applications State
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    const saved = localStorage.getItem('pawconnect_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // 5. Meetups
  const [meetups, setMeetups] = useState<MeetAndGreet[]>(() => {
    const saved = localStorage.getItem('pawconnect_meetups');
    return saved ? JSON.parse(saved) : [
      {
        id: 'meet_1',
        applicationId: 'app_sarah_bruno',
        dogId: 'dog_bruno',
        dogName: 'Bruno',
        ownerId: 'user_alex',
        adopterId: 'user_sarah',
        date: 'Tomorrow (Sunday)',
        time: '5:00 PM',
        locationName: 'Eco Park Canine Playground',
        locationAddress: 'Major Arterial Road, Action Area II, New Town',
        notes: 'Bring tennis balls! Bruno is excited to meet Luna.',
        status: 'scheduled'
      }
    ];
  });

  // 6. Agreements
  const [agreements, setAgreements] = useState<AdoptionAgreement[]>(() => {
    const saved = localStorage.getItem('pawconnect_agreements');
    return saved ? JSON.parse(saved) : [
      {
        id: 'agree_sarah_bruno',
        applicationId: 'app_sarah_bruno',
        dogId: 'dog_bruno',
        dogName: 'Bruno',
        dogBreed: 'Golden Retriever',
        currentOwnerId: 'user_alex',
        currentOwnerName: 'Alex Rivera',
        adopterId: 'user_sarah',
        adopterName: 'Sarah Jenkins',
        adoptionDate: 'August 18, 2026',
        termsAccepted: true,
        ownerSignature: 'Alex Rivera',
        ownerSignedAt: '14 Aug 2026, 11:30 AM',
        isFullySigned: false
      }
    ];
  });

  // 7. Handover Confirmations
  const [handovers, setHandovers] = useState<HandoverConfirmation[]>(() => {
    const saved = localStorage.getItem('pawconnect_handovers');
    return saved ? JSON.parse(saved) : [
      {
        id: 'handover_sarah_bruno',
        applicationId: 'app_sarah_bruno',
        dogId: 'dog_bruno',
        ownerConfirmed: false,
        adopterConfirmed: false,
        isCompleted: false
      }
    ];
  });

  // 8. Chat Conversations
  // 8. Chat Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('pawconnect_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'conv_alex_sarah_bruno',
        dogId: 'dog_bruno',
        dogName: 'Bruno',
        dogAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80',
        participants: ['user_alex', 'user_sarah'],
        lastMessage: 'Sure! Bruno loves playing with tennis balls at Eco Park.',
        lastMessageTimestamp: '10:45 AM',
        unreadCount: 0
      },
      {
        id: 'conv_david_sarah_luna',
        dogId: 'dog_luna',
        dogName: 'Luna',
        dogAvatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80',
        participants: ['user_david', 'user_sarah'],
        lastMessage: 'Luna is completely vaccinated and loves agility courses & swimming!',
        lastMessageTimestamp: '9:30 AM',
        unreadCount: 0
      },
      {
        id: 'conv_david_sarah_milo',
        dogId: 'dog_milo',
        dogName: 'Milo',
        dogAvatar: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&auto=format&fit=crop&q=80',
        participants: ['user_david', 'user_sarah'],
        lastMessage: 'Milo is fully house-trained and super gentle with children.',
        lastMessageTimestamp: 'Yesterday',
        unreadCount: 0
      },
      {
        id: 'conv_david_sarah_rocky',
        dogId: 'dog_rocky',
        dogName: 'Rocky',
        dogAvatar: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80',
        participants: ['user_david', 'user_sarah'],
        lastMessage: 'Rocky knows 8 commands and would love an active outdoor parent!',
        lastMessageTimestamp: 'Yesterday',
        unreadCount: 0
      }
    ];
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('pawconnect_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      'conv_alex_sarah_bruno': [
        {
          id: 'm1',
          conversationId: 'conv_alex_sarah_bruno',
          senderId: 'user_sarah',
          senderName: 'Sarah Jenkins',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
          recipientId: 'user_alex',
          text: 'Hi Alex! I submitted an adoption application for Bruno. We have a huge fenced yard and my Golden Luna is super excited!',
          timestamp: '10:35 AM',
          read: true
        },
        {
          id: 'm2',
          conversationId: 'conv_alex_sarah_bruno',
          senderId: 'user_alex',
          senderName: 'Alex Rivera',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          recipientId: 'user_sarah',
          text: 'Hi Sarah! Thank you so much for the detailed application. Your home and experience sound wonderful for Bruno!',
          timestamp: '10:40 AM',
          read: true
        },
        {
          id: 'm3',
          conversationId: 'conv_alex_sarah_bruno',
          senderId: 'user_alex',
          senderName: 'Alex Rivera',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          recipientId: 'user_sarah',
          text: 'Sure! Bruno loves playing with tennis balls at Eco Park. Let us schedule a Meet & Greet!',
          image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
          timestamp: '10:45 AM',
          read: true
        }
      ],
      'conv_david_sarah_luna': [
        {
          id: 'm_luna_1',
          conversationId: 'conv_david_sarah_luna',
          senderId: 'user_david',
          senderName: 'Dr. David Chen',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          recipientId: 'user_sarah',
          text: 'Hello! Luna is a 1.5-year-old Chocolate Labrador who is 100% vaccinated, spayed, and loves swimming. Let me know if you would like to meet her!',
          timestamp: '9:30 AM',
          read: true
        }
      ],
      'conv_david_sarah_milo': [
        {
          id: 'm_milo_1',
          conversationId: 'conv_david_sarah_milo',
          senderId: 'user_david',
          senderName: 'Dr. David Chen',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          recipientId: 'user_sarah',
          text: 'Hi there! Milo is a sweet 1-year-old Beagle in Mumbai. He is potty-trained, vaccinated, and loves squeaky toys.',
          timestamp: 'Yesterday',
          read: true
        }
      ],
      'conv_david_sarah_rocky': [
        {
          id: 'm_rocky_1',
          conversationId: 'conv_david_sarah_rocky',
          senderId: 'user_david',
          senderName: 'Dr. David Chen',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          recipientId: 'user_sarah',
          text: 'Rocky is an energetic German Shepherd in Bengaluru. Strong health records and knows all basic agility commands.',
          timestamp: 'Yesterday',
          read: true
        }
      ]
    };
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_alex_sarah_bruno');

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

  // Clean / normalize phone numbers
  const cleanPhone = (p: string) => p.replace(/\D/g, '');

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
  const sendOtp = (phone: string): string => {
    const sessionResult = otpService.generateOtp(4);
    const session: OtpSession = {
      phone,
      code: sessionResult,
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    setActiveOtpSession(session);
    otpService.sendOtp(phone);
    return sessionResult;
  };

  // Verify OTP via Dynamic OTP Service
  const verifyOtp = (phone: string, code: string) => {
    const validation = otpService.verifyOtp(phone, code);
    if (!validation.success) {
      return { success: false, isNewUser: false, message: validation.message };
    }

    const cleanInput = cleanPhone(phone);
    const existing = allUsers.find(u => cleanPhone(u.phone) === cleanInput);

    if (existing) {
      setCurrentUser(existing);
      setActiveOtpSession(null);
      if (pendingAuthAction) {
        pendingAuthAction();
        setPendingAuthAction(null);
      }
      return { success: true, isNewUser: false, message: `Welcome back, ${existing.name}!` };
    }

    // New Indian mobile user -> proceed to profile registration
    return { success: true, isNewUser: true, message: 'OTP verified! Complete your profile.' };
  };

  // Complete Registration for New User
  const completeRegistration = (userData: Omit<User, 'id' | 'joinedDate'>): User => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveOtpSession(null);
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
    const newApp: AdoptionApplication = {
      ...data,
      id: `app_${Date.now()}`,
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
    }
  };

  // Accept Application
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

    setMessages(prev => ({
      ...prev,
      [convId]: [
        {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          senderId: currentUserId,
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          recipientId: app.applicantId,
          text: `🎉 Hi ${app.applicantName}! I loved your application for ${app.dogName}. The chat is now unlocked so we can coordinate questions and schedule our Meet & Greet!`,
          timestamp: 'Just now',
          read: false
        }
      ]
    }));

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
    const newMeet: MeetAndGreet = {
      ...data,
      id: `meet_${Date.now()}`,
      status: 'scheduled'
    };
    setMeetups(prev => [newMeet, ...prev]);
    updateDogStatus(data.dogId, 'meet_scheduled');

    const convId = `conv_${data.dogId}_${data.adopterId}`;
    sendMessage(
      convId,
      `📅 Meet & Greet Scheduled for ${data.date} at ${data.time} (📍 ${data.locationName}). Looking forward to meeting!`
    );
  };

  const acceptMeetup = (meetupId: string) => {
    setMeetups(prev => prev.map(m => (m.id === meetupId ? { ...m, status: 'completed' } : m)));
    const meet = meetups.find(m => m.id === meetupId);
    if (meet) {
      updateDogStatus(meet.dogId, 'agreement_pending');
    }
  };

  const signAgreement = (applicationId: string, role: 'owner' | 'adopter', signature: string) => {
    setAgreements(prev =>
      prev.map(agree => {
        if (agree.applicationId === applicationId) {
          const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
  };

  const confirmHandover = (applicationId: string, role: 'owner' | 'adopter') => {
    let completedTransfer = false;
    let targetDogId = '';
    let adopterId = '';

    setHandovers(prev =>
      prev.map(h => {
        if (h.applicationId === applicationId) {
          const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          const updated = {
            ...h,
            ownerConfirmed: role === 'owner' ? true : h.ownerConfirmed,
            ownerConfirmedAt: role === 'owner' ? nowStr : h.ownerConfirmedAt,
            adopterConfirmed: role === 'adopter' ? true : h.adopterConfirmed,
            adopterConfirmedAt: role === 'adopter' ? nowStr : h.adopterConfirmedAt,
          };
          if (updated.ownerConfirmed && updated.adopterConfirmed) {
            updated.isCompleted = true;
            updated.completedAt = nowStr;
            completedTransfer = true;
            targetDogId = h.dogId;
          }
          return updated;
        }
        return h;
      })
    );

    if (completedTransfer || (role === 'owner' && handovers.find(h => h.applicationId === applicationId)?.adopterConfirmed) || (role === 'adopter' && handovers.find(h => h.applicationId === applicationId)?.ownerConfirmed)) {
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        targetDogId = app.dogId;
        adopterId = app.applicantId;

        const adopterUser = allUsers.find(u => u.id === app.applicantId) || currentUser || INITIAL_USERS[0];
        const certId = `CERT-PAW-${Date.now().toString().slice(-6)}`;
        const adoptedDateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

        setDogs(prev =>
          prev.map(dog => {
            if (dog.id === targetDogId) {
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

        const transferredDog = dogs.find(d => d.id === targetDogId);
        if (transferredDog) {
          setCelebrationData({
            isOpen: true,
            dog: { ...transferredDog, status: 'adopted', newOwnerName: adopterUser.name, certificateId: certId },
            adopter: adopterUser,
            owner: currentUser,
            type: 'transfer'
          });
        }

        const transferNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: adopterId,
          title: `🏆 Adoption Completed! ${app.dogName} is officially yours!`,
          message: `Both parties confirmed handover. Certificate #${certId} has been issued to your dashboard!`,
          type: 'dog_transferred',
          relatedDogId: targetDogId,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prev => [transferNotif, ...prev]);
      }
    }
  };

  const sendMessage = (convId: string, text: string, image?: string, isDogBark?: boolean) => {
    const senderId = currentUser?.id || 'user_guest';
    const senderName = currentUser?.name || 'Guest User';
    const senderAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId,
      senderName,
      senderAvatar,
      recipientId: '',
      text,
      image,
      isDogBark,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

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
    const currentUserId = currentUser?.id || 'user_guest';
    const existingConv = conversations.find(c => c.dogId === dog.id);

    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('chat');
      return;
    }

    // Create a new dedicated thread for this dog
    const convId = `conv_${dog.id}_${currentUserId}`;
    const newConv: Conversation = {
      id: convId,
      dogId: dog.id,
      dogName: dog.name,
      dogAvatar: dog.coverPhoto,
      participants: [dog.currentOwnerId, currentUserId],
      lastMessage: initialMessage || `Hi ${dog.currentOwnerName}! I am interested in adopting ${dog.name}.`,
      lastMessageTimestamp: 'Just now',
      unreadCount: 0
    };

    const initialMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUser?.name || 'Interested Adopter',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      recipientId: dog.currentOwnerId,
      text: initialMessage || `Hi ${dog.currentOwnerName}! I am interested in learning more about ${dog.name} and would love to ask a few questions about their daily routine.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setConversations(prev => [newConv, ...prev]);
    setMessages(prev => ({
      ...prev,
      [convId]: [initialMsg]
    }));
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
        activeOtpSession,
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
