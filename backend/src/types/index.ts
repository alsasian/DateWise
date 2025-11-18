import { Request } from 'express';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// User types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
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
  created_at: Date;
  last_active: Date;
  profile_completed: boolean;
}

export interface UserProfile extends Omit<User, 'password_hash'> {
  activities?: UserActivity[];
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
  activity?: Activity;
  specific_venue?: string;
  location_area?: string;
  preferred_time?: string;
  notes?: string;
  created_at: Date;
}

// Match types
export interface Match {
  id: number;
  user_a_id: number;
  user_b_id: number;
  shown_date: Date;
  ai_compatibility_reasons?: string[];
  ai_date_suggestions?: DateSuggestion[];
  shared_activities?: SharedActivity[];
  created_at: Date;
}

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

export interface AIMatchRecommendation {
  compatibility_reasons: string[];
  date_suggestions: DateSuggestion[];
}

// Interest types
export enum InterestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Interest {
  id: number;
  from_user_id: number;
  to_user_id: number;
  match_id: number;
  status: InterestStatus;
  created_at: Date;
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
  match_id: number;
  selected_activity_id?: number;
  venue_name?: string;
  date_time?: Date;
  status: DatePlanStatus;
  user_a_contact?: string;
  user_b_contact?: string;
  user_a_feedback?: 'good' | 'not_good' | 'no_show';
  user_b_feedback?: 'good' | 'not_good' | 'no_show';
  created_at: Date;
  confirmed_at?: Date;
  completed_at?: Date;
}

// Message types
export interface Message {
  id: number;
  match_id: number;
  from_user_id: number;
  message_text: string;
  created_at: Date;
  expires_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Match display types
export interface MatchDisplay {
  match: Match;
  profile: UserProfile;
  aiInsights: {
    whyMeet: string[];
    dateIdeas: DateSuggestion[];
  };
  sharedActivities: SharedActivity[];
}

// Dashboard types
export interface DashboardData {
  todaysMatches: MatchDisplay[];
  pending: Array<{
    profile: UserProfile;
    interestSentAt: Date;
  }>;
  mutualMatches: Array<{
    match: Match;
    profile: UserProfile;
    datePlan?: DatePlan;
    unreadMessages: number;
  }>;
  stats: {
    totalMatches: number;
    mutualMatches: number;
    datesPlanned: number;
    datesCompleted: number;
  };
}
