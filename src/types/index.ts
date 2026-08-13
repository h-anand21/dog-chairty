export type UserRole = 'owner' | 'adopter' | 'shelter' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  role: UserRole;
  location: string;
  isVerified: boolean;
  joinedDate: string;
  homeType: 'Apartment' | 'House' | 'Villa' | 'Farm';
  hasYard: boolean;
  otherPets: string;
  experienceLevel: 'First-time' | 'Intermediate' | 'Expert' | 'Professional Trainer';
  bio: string;
}

export type DogStatus = 
  | 'available' 
  | 'pending' 
  | 'meet_scheduled' 
  | 'agreement_pending' 
  | 'handover_pending' 
  | 'adopted';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  energy: 'Low (Couch Potato)' | 'Moderate' | 'High Energy' | 'Zoomies Master';
  location: string;
  photos: string[];
  coverPhoto: string;
  bio: string;
  reasonForAdoption: string;
  adoptionType: 'Free Adoption' | 'Adoption Fee';
  adoptionFee?: number;
  status: DogStatus;
  
  // Ownership Details
  currentOwnerId: string;
  currentOwnerName: string;
  currentOwnerAvatar: string;
  currentOwnerPhone?: string;
  isOwnerVerified: boolean;
  
  // Post-Adoption Transfer Details
  previousOwnerId?: string;
  previousOwnerName?: string;
  newOwnerId?: string;
  newOwnerName?: string;
  adoptedDate?: string;
  certificateId?: string;
  
  // Health & Care
  vaccinated: boolean;
  neutered: boolean;
  microchipped: boolean;
  medicalNotes?: string;
  
  // Personality & Favorites
  favoriteThings: string[];
  personalityTraits: string[];
  
  // Social metrics
  interestedCount: number;
  likesCount: number;
  isLiked?: boolean;
}

export type ApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'accepted' 
  | 'declined' 
  | 'completed';

export interface AdoptionApplication {
  id: string;
  dogId: string;
  dogName: string;
  dogPhoto: string;
  dogBreed: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantLocation: string;
  applicantPhone: string;
  applicantEmail?: string;
  
  // Questionnaire answers
  reason: string;
  homeType: 'Apartment' | 'House' | 'Villa' | 'Farm';
  hasYard: boolean;
  otherPets: string;
  experienceWithDogs: string;
  vetCareAgreement: boolean;
  workSchedule: string;
  preferredMeetDate?: string;
  
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  declineReason?: string;
}

export interface MeetAndGreet {
  id: string;
  applicationId: string;
  dogId: string;
  dogName: string;
  ownerId: string;
  adopterId: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
}

export interface AdoptionAgreement {
  id: string;
  applicationId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  currentOwnerId: string;
  currentOwnerName: string;
  adopterId: string;
  adopterName: string;
  adoptionDate: string;
  termsAccepted: boolean;
  ownerSignature?: string;
  ownerSignedAt?: string;
  adopterSignature?: string;
  adopterSignedAt?: string;
  isFullySigned: boolean;
}

export interface HandoverConfirmation {
  id: string;
  applicationId: string;
  dogId: string;
  ownerConfirmed: boolean;
  ownerConfirmedAt?: string;
  adopterConfirmed: boolean;
  adopterConfirmedAt?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  image?: string;
  audioNote?: boolean;
  isDogBark?: boolean;
  meetingInvite?: MeetAndGreet;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  dogId: string;
  dogName: string;
  dogAvatar: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogAvatar: string;
  ownerId: string;
  ownerName: string;
  image: string;
  caption: string;
  location: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: PostComment[];
  createdAt: string;
}

export interface Story {
  id: string;
  dogId: string;
  dogName: string;
  dogAvatar: string;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  viewed: boolean;
}

export interface ReportItem {
  id: string;
  listingId: string;
  dogName: string;
  reportedById: string;
  reportedByName: string;
  reason: 'Fake dog / Scam' | 'Animal abuse / neglect' | 'Incorrect information' | 'Suspicious owner' | 'Commercial breeding' | 'Other';
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application_received' | 'application_accepted' | 'chat_message' | 'meeting_scheduled' | 'agreement_signed' | 'handover_confirmed' | 'dog_transferred';
  relatedDogId?: string;
  relatedApplicationId?: string;
  timestamp: string;
  read: boolean;
}

export interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number;
}
