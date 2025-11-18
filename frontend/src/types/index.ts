// User types
export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  location: string;
  occupation?: string;
  interests?: string;
  values?: string;
  lifestyle?: string;
  relationship_goals?: string;
  deal_breakers?: string;
  personality?: string;
  photos?: string[];
  age_preference_min: number;
  age_preference_max: number;
  location_preference?: string;
  profile_completed: boolean;
  created_at: string;
}

// Activity types
export enum ActivityCategory {
  COFFEE_CASUAL = 'coffee_casual',
  OUTDOOR_ACTIVE = 'outdoor_active',
  FOOD_DINING = 'food_dining',
  ARTS_CULTURE = 'arts_culture',
  FUN_GAMES = 'fun_games',
  ENTERTAINMENT = 'entertainment'
}

export interface Activity {
  id: number;
  name: string;
  category: ActivityCategory;
  icon: string;
  description?: string;
  country: 'singapore' | 'indonesia' | 'both';
}

export interface UserActivity {
  id: number;
  user_id: number;
  activity_id: number;
  activity: Activity;
  specific_venue?: string;
  location_area?: string;
  preferred_time?: string;
  notes?: string;
  created_at: string;
}

export interface UserProfile extends User {
  activities?: UserActivity[];
}

// Match types
export interface SharedActivity {
  activity_id: number;
  activity_name: string;
  user_a_details?: {
    venue?: string;
    area?: string;
    time?: string;
    notes?: string;
  };
  user_b_details?: {
    venue?: string;
    area?: string;
    time?: string;
    notes?: string;
  };
}

export interface DateSuggestion {
  activity: string;
  location?: string;
  description: string;
}

export interface Match {
  id: number;
  user_a_id: number;
  user_b_id: number;
  shown_date: string;
  ai_compatibility_reasons?: string[];
  ai_date_suggestions?: DateSuggestion[];
  shared_activities?: SharedActivity[];
  created_at: string;
}

export interface MatchDisplay {
  match: Match;
  profile: UserProfile;
  aiInsights: {
    whyMeet: string[];
    dateIdeas: DateSuggestion[];
  };
  sharedActivities: SharedActivity[];
}

// Interest types
export enum InterestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

// Date Plan types
export enum DatePlanStatus {
  PLANNING = 'planning',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface DatePlan {
  id: number;
  matchId: number;
  selectedActivityId?: number;
  venueName?: string;
  dateTime?: string;
  status: DatePlanStatus;
  userContact?: string;
  otherUserContact?: string;
  userFeedback?: 'good' | 'not_good' | 'no_show';
  otherUserFeedback?: 'good' | 'not_good' | 'no_show';
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

// Message types
export interface Message {
  id: number;
  match_id: number;
  from_user_id: number;
  message_text: string;
  sender_name?: string;
  created_at: string;
  expires_at: string;
  is_read: boolean;
}

// Dashboard types
export interface DashboardData {
  todaysMatches: MatchDisplay[];
  pending: Array<{
    profile: UserProfile;
    interestSentAt: string;
  }>;
  stats: {
    totalMatches: number;
    mutualMatches: number;
    datesPlanned: number;
    datesCompleted: number;
  };
}

export interface MutualMatch {
  matchId: number;
  profile: UserProfile;
  matchedAt: string;
  aiInsights: {
    whyMeet: string[];
    dateIdeas: DateSuggestion[];
  };
  sharedActivities: SharedActivity[];
  datePlan: DatePlan | null;
  unreadMessages: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  location: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
