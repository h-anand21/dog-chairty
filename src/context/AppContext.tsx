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
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOGS,
  INITIAL_APPLICATIONS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // User Management
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;

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
  // 1. User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('pawconnect_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Default to Sarah (Adopter) or Alex
  });
  const allUsers = INITIAL_USERS;

  // 2. Navigation Tab
  const [activeTab, setActiveTab] = useState<'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs' | 'admin'>('discover');

  // 3. Dogs State
  const [dogs, setDogs] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('pawconnect_dogs');
    return saved ? JSON.parse(saved) : INITIAL_DOGS;
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
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('pawconnect_conversations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'conv_alex_sarah_bruno',
        dogId: 'dog_bruno',
        dogName: 'Bruno',
        dogAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80',
        participants: ['user_alex', 'user_sarah'],
        lastMessage: 'Sure! Bruno loves playing with tennis balls at Eco Park.',
        lastMessageTimestamp: '10:45 AM',
        unreadCount: 1
      }
    ];
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('pawconnect_messages');
    return saved ? JSON.parse(saved) : {
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
    localStorage.setItem('pawconnect_current_user', JSON.stringify(currentUser));
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

  // Switch Active User Persona
  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Add Dog
  const addDog = (dogData: Omit<Dog, 'id' | 'interestedCount' | 'likesCount' | 'status'>): Dog => {
    const newDog: Dog = {
      ...dogData,
      id: `dog_${Date.now()}`,
      status: 'available',
      interestedCount: 0,
      likesCount: 1,
      currentOwnerId: currentUser.id,
      currentOwnerName: currentUser.name,
      currentOwnerAvatar: currentUser.avatar,
      isOwnerVerified: currentUser.isVerified,
    };
    setDogs(prev => [newDog, ...prev]);

    // Also auto-create an announcement post on PawFeed
    const announcementPost: Post = {
      id: `post_${Date.now()}`,
      dogId: newDog.id,
      dogName: newDog.name,
      dogBreed: newDog.breed,
      dogAvatar: newDog.photos[0] || newDog.coverPhoto,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      image: newDog.coverPhoto,
      caption: `🐾 Exciting news! ${newDog.name} (${newDog.breed}, ${newDog.age}) is officially listed for adoption on PawConnect! Let's help them find their forever home! ❤️`,
      location: newDog.location,
      tags: [`#${newDog.breed.replace(/\s+/g, '')}`, '#AdoptDontShop', '#PawConnect'],
      likes: 12,
      likedBy: [currentUser.id],
      comments: [],
      createdAt: 'Just now'
    };
    setPosts(prev => [announcementPost, ...prev]);

    return newDog;
  };

  // Toggle Like Dog
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

    // Increment interested count
    setDogs(prev => prev.map(d => d.id === data.dogId ? { ...d, interestedCount: d.interestedCount + 1 } : d));

    // Notify owner
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

    setApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'accepted', reviewedAt: 'Just now' } : a))
    );

    // Update Dog status to 'pending'
    updateDogStatus(app.dogId, 'pending');

    // Create / Ensure Chat Conversation exists
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
          participants: [currentUser.id, app.applicantId],
          lastMessage: `Application accepted! Say hi to ${app.applicantName}.`,
          lastMessageTimestamp: 'Just now',
          unreadCount: 0
        },
        ...prev
      ];
    });

    // Seed welcome message
    setMessages(prev => ({
      ...prev,
      [convId]: [
        {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          recipientId: app.applicantId,
          text: `🎉 Hi ${app.applicantName}! I loved your application for ${app.dogName}. The chat is now unlocked so we can coordinate questions and schedule our Meet & Greet!`,
          timestamp: 'Just now',
          read: false
        }
      ]
    }));

    // Trigger Match / Connection celebration
    const dog = dogs.find(d => d.id === app.dogId) || null;
    const applicant = allUsers.find(u => u.id === app.applicantId) || {
      id: app.applicantId,
      name: app.applicantName,
      email: app.applicantEmail,
      avatar: app.applicantAvatar,
      role: 'adopter' as const,
      phone: app.applicantPhone,
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

    // Notify Adopter
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: app.applicantId,
      title: `🎉 ${app.dogName}'s Owner Accepted Your Application!`,
      message: `${currentUser.name} accepted your request. Private chat is now unlocked!`,
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
          ? { ...a, status: 'declined', reviewedAt: 'Just now', declineReason: reason || 'Application declined by owner.' }
          : a
      )
    );
  };

  // Schedule Meet & Greet
  const scheduleMeetup = (data: Omit<MeetAndGreet, 'id' | 'status'>) => {
    const newMeet: MeetAndGreet = {
      ...data,
      id: `meet_${Date.now()}`,
      status: 'scheduled'
    };
    setMeetups(prev => [newMeet, ...prev]);
    updateDogStatus(data.dogId, 'meet_scheduled');

    // Notify chat
    const convId = `conv_${data.dogId}_${data.adopterId}`;
    sendMessage(
      convId,
      `📅 Meet & Greet Scheduled for ${data.date} at ${data.time} (📍 ${data.locationName}). Looking forward to meeting!`
    );
  };

  const acceptMeetup = (meetupId: string) => {
    setMeetups(prev => prev.map(m => (m.id === meetupId ? { ...m, status: 'completed' } : m)));
    // Transition dog to agreement pending
    const meet = meetups.find(m => m.id === meetupId);
    if (meet) {
      updateDogStatus(meet.dogId, 'agreement_pending');
    }
  };

  // Sign Agreement
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

  // Dual Handover Confirmation & Dog Transfer Logic
  const confirmHandover = (applicationId: string, role: 'owner' | 'adopter') => {
    let completedTransfer = false;
    let targetDogId = '';
    let adopterId = '';
    let ownerId = '';

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

    // If both confirmed -> Execute OFFICIAL OWNERSHIP TRANSFER
    if (completedTransfer || (role === 'owner' && handovers.find(h => h.applicationId === applicationId)?.adopterConfirmed) || (role === 'adopter' && handovers.find(h => h.applicationId === applicationId)?.ownerConfirmed)) {
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        targetDogId = app.dogId;
        adopterId = app.applicantId;
        ownerId = currentUser.id;

        const adopterUser = allUsers.find(u => u.id === app.applicantId) || currentUser;
        const certId = `CERT-PAW-${Date.now().toString().slice(-6)}`;
        const adoptedDateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

        // 1. Update Dog Ownership
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

        // 2. Mark Application completed
        setApplications(prev =>
          prev.map(a => (a.id === applicationId ? { ...a, status: 'completed' } : a))
        );

        // 3. Trigger Grand Handover Celebration
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

        // 4. Send Notifications
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

  // Send Message
  const sendMessage = (convId: string, text: string, image?: string, isDogBark?: boolean) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
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

  // Social Feed Actions
  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(currentUser.id);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter(id => id !== currentUser.id)
              : [...post.likedBy, currentUser.id]
          };
        }
        return post;
      })
    );
  };

  const addPostComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now'
    };
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  const createPost = (image: string, caption: string, tags: string[], dogId: string) => {
    const dog = dogs.find(d => d.id === dogId) || dogs[0];
    const newPost: Post = {
      id: `post_${Date.now()}`,
      dogId: dog.id,
      dogName: dog.name,
      dogBreed: dog.breed,
      dogAvatar: dog.photos[0] || dog.coverPhoto,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      image,
      caption,
      location: dog.location,
      tags,
      likes: 1,
      likedBy: [currentUser.id],
      comments: [],
      createdAt: 'Just now'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // Safety & Reporting
  const submitReport = (listingId: string, dogName: string, reason: ReportItem['reason'], details: string) => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      listingId,
      dogName,
      reportedById: currentUser.id,
      reportedByName: currentUser.name,
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

  // Notifications
  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        switchUser,
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
