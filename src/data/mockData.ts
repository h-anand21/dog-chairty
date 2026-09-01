import { User, Dog, AdoptionApplication, Post, Story, NotificationItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_dipu_anand',
    name: 'Dipu Anand',
    phone: '+91 8252990057',
    email: 'dipuanand563@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    role: 'owner',
    location: 'Kolkata, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5867,
    lng: 88.4178,
    isVerified: true,
    joinedDate: 'February 2025',
    homeType: 'House',
    hasYard: true,
    otherPets: 'None',
    experienceLevel: 'Expert',
    bio: 'Loving pet parent looking for a wonderful, caring family for Pogo.'
  },
  {
    id: 'user_sarah',
    name: 'Sarah Jenkins',
    phone: '+91 99999 00001',
    email: 'sarah.jenkins@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    role: 'adopter',
    location: 'Kolkata, New Town',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.4639,
    isVerified: true,
    joinedDate: 'January 2025',
    homeType: 'House',
    hasYard: true,
    otherPets: '1 friendly Golden Retriever (Luna)',
    experienceLevel: 'Expert',
    bio: 'Lifelong dog parent, freelance designer working from home. Lots of space, love, and daily park walks!'
  },
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    phone: '+91 99999 00002',
    email: 'alex.rivera@pawconnect.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'owner',
    location: 'Kolkata, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5867,
    lng: 88.4178,
    isVerified: true,
    joinedDate: 'March 2024',
    homeType: 'House',
    hasYard: true,
    otherPets: 'None currently',
    experienceLevel: 'Intermediate',
    bio: 'Dedicated dog lover & volunteer. Seeking a loving forever home for Bruno due to overseas relocation.'
  },
  {
    id: 'user_david',
    name: 'Dr. David Chen',
    phone: '+91 98111 22334',
    email: 'dr.david@pawsanctuary.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'shelter',
    location: 'Delhi, South Extension',
    city: 'Delhi',
    state: 'Delhi',
    lat: 28.5729,
    lng: 77.2228,
    isVerified: true,
    joinedDate: 'November 2023',
    homeType: 'Farm',
    hasYard: true,
    otherPets: 'Rescue dogs in foster',
    experienceLevel: 'Professional Trainer',
    bio: 'Licensed vet & rescue coordinator helping dogs find responsible families.'
  },
  {
    id: 'user_dipu_anand',
    name: 'Dipu Anand',
    phone: '+91 8252990057',
    email: 'dipuanand@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    role: 'owner',
    location: 'Kolkata, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5867,
    lng: 88.4178,
    isVerified: true,
    joinedDate: 'February 2025',
    homeType: 'House',
    hasYard: true,
    otherPets: 'None',
    experienceLevel: 'Expert',
    bio: 'Loving dog parent looking for a warm, caring forever family for Pogo.'
  },
  {
    id: 'user_admin',
    name: 'PawConnect Safety Team',
    phone: '+91 98000 00000',
    email: 'safety@pawconnect.org',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    location: 'Headquarters, India',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    isVerified: true,
    joinedDate: 'January 2023',
    homeType: 'House',
    hasYard: true,
    otherPets: '2 office dogs',
    experienceLevel: 'Professional Trainer',
    bio: 'Platform Trust & Safety Moderator.'
  }
];

export const INITIAL_DOGS: Dog[] = [];

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    dogId: 'dog_bruno',
    dogName: 'Bruno',
    dogBreed: 'Golden Retriever',
    dogAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_alex',
    ownerName: 'Alex Rivera',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000&auto=format&fit=crop&q=80',
    caption: 'First beach trip of the month! Caught 14 sticks and gave 30 paw-shakes to passersby 🌊🐾 Who else has a water-loving pup?',
    location: 'Eco Park Lakefront, Kolkata',
    lat: 22.6033,
    lng: 88.4658,
    tags: ['#GoldenRetriever', '#BeachDog', '#PawAdventures', '#GoodBoy'],
    likes: 1284,
    likedBy: ['user_sarah', 'user_david'],
    comments: [
      {
        id: 'c_1',
        userId: 'user_sarah',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        text: 'Bruno looks so radiant in the water! Luna would love a swim date with him! 🐕🌊',
        timestamp: '2h ago'
      }
    ],
    createdAt: '3 hours ago'
  },
  {
    id: 'post_2',
    dogId: 'dog_luna',
    dogName: 'Luna',
    dogBreed: 'Labrador',
    dogAvatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_david',
    ownerName: 'Dr. David Chen',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&auto=format&fit=crop&q=80',
    caption: 'Training milestone: Luna mastered the "Wait for treat" challenge on her nose for 10 straight seconds! 🦴✨ Ready for her forever home!',
    location: 'Siri Fort Park, Delhi',
    lat: 28.5526,
    lng: 77.2217,
    tags: ['#LabradorLife', '#SmartDog', '#AdoptionReady', '#GoodGirl'],
    likes: 852,
    likedBy: ['user_alex'],
    comments: [],
    createdAt: '5 hours ago'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    dogId: 'dog_bruno',
    dogName: 'Bruno',
    dogAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80',
    caption: 'Catching morning zoomies in the dew grass! 🏃💨',
    timestamp: '15m ago',
    viewed: false
  },
  {
    id: 'story_2',
    dogId: 'dog_luna',
    dogName: 'Luna',
    dogAvatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    caption: 'Someone stole the peanut butter jar 🤫',
    timestamp: '1h ago',
    viewed: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_alex',
    title: '🐾 New Adoption Request for Bruno!',
    message: 'Sarah Jenkins submitted a comprehensive adoption application with a fenced yard in New Town.',
    type: 'application_received',
    relatedDogId: 'dog_bruno',
    relatedApplicationId: 'app_sarah_bruno',
    timestamp: '10 mins ago',
    read: false
  }
];

export const INITIAL_SUCCESS_STORIES = [
  {
    id: 'story_bella',
    dogName: 'Bella',
    dogBreed: 'Golden Retriever',
    dogPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    adopterName: 'Ananya Sharma',
    adopterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    location: 'Bandra, Mumbai',
    story: 'Bella brought so much warmth and energy into our home! The 6-Stage verified handover made everything completely transparent and safe.',
    date: 'February 2025',
    likesCount: 142,
    isLiked: false,
  },
  {
    id: 'story_rocky',
    dogName: 'Rocky',
    dogBreed: 'Beagle',
    dogPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    adopterName: 'Vikram Patel',
    adopterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'Indiranagar, Bengaluru',
    story: 'From our first video meet to the park meet & greet, PawConnect made adopting Rocky the smoothest experience. He loves his daily park runs!',
    date: 'January 2025',
    likesCount: 98,
    isLiked: false,
  },
  {
    id: 'story_daisy',
    dogName: 'Daisy',
    dogBreed: 'Indie Rescue Pup',
    dogPhoto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    adopterName: 'Pooja Roy',
    adopterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    location: 'Salt Lake, Kolkata',
    story: 'Adopting Daisy was the best decision of our lives. Her foster guardian gave us all medical and vaccination records digitally through PawConnect.',
    date: 'December 2024',
    likesCount: 175,
    isLiked: false,
  }
];

