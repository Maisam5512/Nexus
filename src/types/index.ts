export type UserRole = "entrepreneur" | "investor"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string
  bio: string
  isOnline?: boolean
  createdAt: string
  lastSeen?: string
}

export interface Entrepreneur extends User {
  role: "entrepreneur"
  startupName: string
  pitchSummary: string
  fundingNeeded: string
  industry: string
  location: string
  foundedYear: number
  teamSize: number
   website?: string
  linkedin?: string
}

export interface Investor extends User {
  role: "investor"
  investmentInterests: string[]
  investmentStage: string[]
  portfolioCompanies: string[]
  totalInvestments: number
  minimumInvestment: string
  maximumInvestment: string
  location: string
}



export interface MessageUser {
  id: string;
  name: string;
  avatarUrl: string;
  email?: string;
  role?: string;
  bio?: string;
  createdAt?: Date;
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  messageType: "text" | "image" | "document" | "system"
  readAt?: string
  isEdited: boolean
  editedAt?: string
  replyTo?: string
  conversationId: string
  createdAt: string
  // For populated fields
  sender?: MessageUser;
  receiver?: MessageUser;
  isEncrypted?: boolean;
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage?: Message
  updatedAt: Date
  unreadCount: number
  otherUser: MessageUser;
}

export interface CollaborationRequest {
  id: string
  investorId: string
  entrepreneurId: string
  message: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface Document {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
  shared: boolean
  url: string
  ownerId: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}


export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalMessages: number
  hasNext: boolean
  hasPrev: boolean
}
