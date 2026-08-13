import { User, Dog, AdoptionApplication, Post, Story, NotificationItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_sarah',
    name: 'Sarah Jenkins',
    phone: '+91 98765 43210',
    email: 'sarah.jenkins@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    role: 'adopter',
    location: 'Kolkata, New Town',
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
    phone: '+91 98300 12345',
    email: 'alex.rivera@pawconnect.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'owner',
    location: 'Kolkata, Salt Lake Area',
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
    isVerified: true,
    joinedDate: 'November 2023',
    homeType: 'Farm',
    hasYard: true,
    otherPets: 'Rescue dogs in foster',
    experienceLevel: 'Professional Trainer',
    bio: 'Licensed vet & rescue coordinator helping dogs find responsible families.'
  },
  {
    id: 'user_admin',
    name: 'PawConnect Safety Team',
    phone: '+91 98000 00000',
    email: 'safety@pawconnect.org',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    location: 'Headquarters',
    isVerified: true,
    joinedDate: 'January 2023',
    homeType: 'House',
    hasYard: true,
    otherPets: '2 office dogs',
    experienceLevel: 'Professional Trainer',
    bio: 'Platform Trust & Safety Moderator.'
  }
];

export const INITIAL_DOGS: Dog[] = [
  {
    id: 'dog_bruno',
    name: 'Bruno',
    breed: 'Golden Retriever',
    age: '2 Years',
    gender: 'Male',
    size: 'Large',
    energy: 'High Energy',
    location: 'Kolkata, Salt Lake',
    coverPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80'
    ],
    bio: 'Professional tennis ball chaser and certified champion snuggler. Extremely gentle with children, loves car rides with his head out the window, and knows 8 trick commands!',
    reasonForAdoption: 'Current owner relocating overseas for work and cannot take large dogs due to quarantine regulations.',
    adoptionType: 'Free Adoption',
    status: 'available',
    currentOwnerId: 'user_alex',
    currentOwnerName: 'Alex Rivera',
    currentOwnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    currentOwnerPhone: '+91 98300 12345',
    isOwnerVerified: true,
    vaccinated: true,
    neutered: true,
    microchipped: true,
    medicalNotes: 'Up to date on rabies, DHPP & Bordetella. No chronic allergies. Regular vet visits recorded.',
    favoriteThings: ['🎾 Tennis Balls', '🍗 Roast Chicken Treats', '🌳 Lake Park Walks', '🛋️ Sofa Cuddles'],
    personalityTraits: ['Playful', 'House-Trained', 'Good with Kids', 'Friendly with Dogs', 'Gentle Leash Walker'],
    interestedCount: 24,
    likesCount: 142
  },
  {
    id: 'dog_luna',
    name: 'Luna',
    breed: 'Labrador Retriever',
    age: '1.5 Years',
    gender: 'Female',
    size: 'Large',
    energy: 'Zoomies Master',
    location: 'Delhi, GK-2',
    coverPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&auto=format&fit=crop&q=80'
    ],
    bio: 'Sweet chocolate-eyed darling who adores swimming in puppy pools and making puppy-eyes at anyone holding snacks. Very social and eager to please.',
    reasonForAdoption: 'Rescued from overcrowded shelter; fostered and rehabilitated by Dr. David.',
    adoptionType: 'Free Adoption',
    status: 'available',
    currentOwnerId: 'user_david',
    currentOwnerName: 'Dr. David Chen',
    currentOwnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    currentOwnerPhone: '+91 98111 22334',
    isOwnerVerified: true,
    vaccinated: true,
    neutered: true,
    microchipped: true,
    medicalNotes: 'Fully vaccinated & spayed. Passed full health panel with flying colors.',
    favoriteThings: ['🏊 Pool Dips', '🥕 Crunchy Carrots', '🧸 Squeaky Ducks', '💤 Belly Scratches'],
    personalityTraits: ['Affectionate', 'Water Lover', 'High Intelligence', 'Loves People'],
    interestedCount: 19,
    likesCount: 98
  },
  {
    id: 'dog_milo',
    name: 'Milo',
    breed: 'Beagle',
    age: '1 Year',
    gender: 'Male',
    size: 'Medium',
    energy: 'Moderate',
    location: 'Mumbai, Bandra West',
    coverPhoto: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80'
    ],
    bio: 'Curious scent hound who loves sniffing out autumn leaves and sleeping in sunbeams. Highly food motivated and already potty-trained.',
    reasonForAdoption: 'Owner downsized to pet-restricted apartment.',
    adoptionType: 'Free Adoption',
    status: 'available',
    currentOwnerId: 'user_david',
    currentOwnerName: 'Dr. David Chen',
    currentOwnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    currentOwnerPhone: '+91 98111 22334',
    isOwnerVerified: true,
    vaccinated: true,
    neutered: true,
    microchipped: true,
    medicalNotes: 'Dewormed, monthly flea/tick preventative active. Healthy ears checked weekly.',
    favoriteThings: ['👃 Scent Trails', '🧀 Cheese Cubes', '🦴 Chew Bones', '🌞 Sunbathing'],
    personalityTraits: ['Curious', 'Gentle', 'Foodie', 'Loves Naps'],
    interestedCount: 31,
    likesCount: 167
  },
  {
    id: 'dog_rocky',
    name: 'Rocky',
    breed: 'German Shepherd',
    age: '3 Years',
    gender: 'Male',
    size: 'Large',
    energy: 'High Energy',
    location: 'Bengaluru, Indiranagar',
    coverPhoto: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop&q=80'
    ],
    bio: 'Loyal, alert, and exceptionally smart. Thrives on agility courses and learning new tricks. Looking for an active owner who loves outdoor trails.',
    reasonForAdoption: 'Owner had health changes preventing active exercise.',
    adoptionType: 'Free Adoption',
    status: 'available',
    currentOwnerId: 'user_david',
    currentOwnerName: 'Dr. David Chen',
    currentOwnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    currentOwnerPhone: '+91 98111 22334',
    isOwnerVerified: true,
    vaccinated: true,
    neutered: true,
    microchipped: true,
    medicalNotes: 'Strong hips (OFA cleared), fully vaccinated, pristine dental health.',
    favoriteThings: ['🥏 Frisbee', '🏔️ Mountain Hikes', '🧩 Puzzle Toys', '🐾 Agility Jumps'],
    personalityTraits: ['Loyal Guardian', 'Fast Learner', 'Athletic', 'Obedient'],
    interestedCount: 15,
    likesCount: 112
  }
];

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'app_sarah_bruno',
    dogId: 'dog_bruno',
    dogName: 'Bruno',
    dogPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    dogBreed: 'Golden Retriever',
    applicantId: 'user_sarah',
    applicantName: 'Sarah Jenkins',
    applicantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    applicantLocation: 'Kolkata, New Town (5 miles away)',
    applicantPhone: '+91 98765 43210',
    applicantEmail: 'sarah.jenkins@gmail.com',
    reason: 'We have a fenced 2000 sq ft green garden and another friendly Golden Retriever (Luna). Bruno will have companionship, 2 daily park walks, and 24/7 care since I work from home!',
    homeType: 'House',
    hasYard: true,
    otherPets: '1 friendly spayed Golden Retriever (Luna, 3 yrs old)',
    experienceWithDogs: 'Over 12 years of Golden Retriever parenting experience, trained in basic pet CPR & agility.',
    vetCareAgreement: true,
    workSchedule: 'Full-time Remote / Work from Home',
    preferredMeetDate: 'Tomorrow at Eco Park, 5:00 PM',
    status: 'submitted',
    submittedAt: 'Today at 10:30 AM'
  }
];

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
    location: 'Eco Park Lakefront',
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
    location: 'Canine Care Center',
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
