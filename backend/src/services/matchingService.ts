import pool from '../config/database';
import { config } from '../config';
import AIService from './aiService';
import { UserProfile, Match, SharedActivity, MatchDisplay } from '../types';

export class MatchingService {
  /**
   * Find shared activities between two users
   */
  static async findSharedActivities(userAId: number, userBId: number): Promise<SharedActivity[]> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT
          a.id as activity_id,
          a.name as activity_name,
          a.category,
          a.icon,
          json_build_object(
            'venue', ua_a.specific_venue,
            'area', ua_a.location_area,
            'time', ua_a.preferred_time,
            'notes', ua_a.notes
          ) as user_a_details,
          json_build_object(
            'venue', ua_b.specific_venue,
            'area', ua_b.location_area,
            'time', ua_b.preferred_time,
            'notes', ua_b.notes
          ) as user_b_details
         FROM activities a
         INNER JOIN user_activities ua_a ON a.id = ua_a.activity_id AND ua_a.user_id = $1
         INNER JOIN user_activities ua_b ON a.id = ua_b.activity_id AND ua_b.user_id = $2
         ORDER BY a.category, a.name`,
        [userAId, userBId]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Get user profile with activities
   */
  static async getUserProfile(userId: number): Promise<UserProfile | null> {
    const client = await pool.connect();

    try {
      // Get user data
      const userResult = await client.query(
        `SELECT id, email, name, age, location, occupation, interests, values,
                lifestyle, relationship_goals, deal_breakers, personality, photos,
                age_preference_min, age_preference_max, location_preference,
                profile_completed, created_at, last_active
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];

      // Get user's activities
      const activitiesResult = await client.query(
        `SELECT ua.id, ua.activity_id, ua.specific_venue, ua.location_area,
                ua.preferred_time, ua.notes, ua.created_at,
                a.name as activity_name, a.category, a.icon, a.description, a.country
         FROM user_activities ua
         JOIN activities a ON ua.activity_id = a.id
         WHERE ua.user_id = $1`,
        [userId]
      );

      return {
        ...user,
        activities: activitiesResult.rows.map(row => ({
          id: row.id,
          user_id: userId,
          activity_id: row.activity_id,
          activity: {
            id: row.activity_id,
            name: row.activity_name,
            category: row.category,
            icon: row.icon,
            description: row.description,
            country: row.country,
          },
          specific_venue: row.specific_venue,
          location_area: row.location_area,
          preferred_time: row.preferred_time,
          notes: row.notes,
          created_at: row.created_at,
        })),
      };
    } finally {
      client.release();
    }
  }

  /**
   * Create a match with AI-generated insights
   */
  static async createMatch(userAId: number, userBId: number): Promise<Match> {
    const client = await pool.connect();

    try {
      // Get user profiles
      const [userA, userB] = await Promise.all([
        this.getUserProfile(userAId),
        this.getUserProfile(userBId),
      ]);

      if (!userA || !userB) {
        throw new Error('User not found');
      }

      // Find shared activities
      const sharedActivities = await this.findSharedActivities(userAId, userBId);

      if (sharedActivities.length < config.matching.minSharedActivities) {
        throw new Error('Not enough shared activities');
      }

      // Generate AI recommendation
      const aiRecommendation = await AIService.generateMatchRecommendation({
        userA,
        userB,
        sharedActivities,
      });

      // Create match record
      const matchResult = await client.query(
        `INSERT INTO matches
         (user_a_id, user_b_id, shown_date, ai_compatibility_reasons,
          ai_date_suggestions, shared_activities)
         VALUES ($1, $2, CURRENT_DATE, $3, $4, $5)
         RETURNING *`,
        [
          userAId,
          userBId,
          JSON.stringify(aiRecommendation.compatibility_reasons),
          JSON.stringify(aiRecommendation.date_suggestions),
          JSON.stringify(sharedActivities),
        ]
      );

      // Store AI recommendation for analytics
      await client.query(
        `INSERT INTO ai_recommendations (match_id, response_json, model_version)
         VALUES ($1, $2, $3)`,
        [matchResult.rows[0].id, JSON.stringify(aiRecommendation), 'claude-3-5-sonnet-20241022']
      );

      return matchResult.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Get potential matches for a user
   * (for admin to manually assign or for automated matching)
   */
  static async findPotentialMatches(
    userId: number,
    limit: number = 10
  ): Promise<Array<{ user: UserProfile; sharedActivitiesCount: number; score: number }>> {
    const client = await pool.connect();

    try {
      const user = await this.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find users with shared activities who haven't been matched yet
      const result = await client.query(
        `SELECT DISTINCT
          u.id,
          COUNT(DISTINCT ua_shared.activity_id) as shared_activities_count
         FROM users u
         INNER JOIN user_activities ua_them ON u.id = ua_them.user_id
         INNER JOIN user_activities ua_me ON ua_them.activity_id = ua_me.activity_id
         INNER JOIN user_activities ua_shared ON ua_shared.activity_id = ua_me.activity_id
         WHERE ua_me.user_id = $1
           AND u.id != $1
           AND u.profile_completed = true
           AND u.age BETWEEN $2 AND $3
           AND NOT EXISTS (
             SELECT 1 FROM matches m
             WHERE (m.user_a_id = $1 AND m.user_b_id = u.id)
                OR (m.user_a_id = u.id AND m.user_b_id = $1)
           )
         GROUP BY u.id
         HAVING COUNT(DISTINCT ua_shared.activity_id) >= $4
         ORDER BY shared_activities_count DESC
         LIMIT $5`,
        [
          userId,
          user.age_preference_min,
          user.age_preference_max,
          config.matching.minSharedActivities,
          limit,
        ]
      );

      // Get full profiles and calculate scores
      const potentialMatches = await Promise.all(
        result.rows.map(async row => {
          const matchUser = await this.getUserProfile(row.id);
          if (!matchUser) return null;

          const score = AIService.calculateCompatibilityScore(
            user,
            matchUser,
            parseInt(row.shared_activities_count)
          );

          return {
            user: matchUser,
            sharedActivitiesCount: parseInt(row.shared_activities_count),
            score,
          };
        })
      );

      return potentialMatches.filter(Boolean) as Array<{
        user: UserProfile;
        sharedActivitiesCount: number;
        score: number;
      }>;
    } finally {
      client.release();
    }
  }

  /**
   * Get today's matches for a user
   */
  static async getTodaysMatches(userId: number): Promise<MatchDisplay[]> {
    const client = await pool.connect();

    try {
      const matchesResult = await client.query(
        `SELECT m.*,
                CASE
                  WHEN m.user_a_id = $1 THEN m.user_b_id
                  ELSE m.user_a_id
                END as other_user_id
         FROM matches m
         WHERE (m.user_a_id = $1 OR m.user_b_id = $1)
           AND m.shown_date = CURRENT_DATE
           AND NOT EXISTS (
             SELECT 1 FROM interests i
             WHERE i.from_user_id = $1
               AND i.match_id = m.id
           )
         ORDER BY m.created_at DESC`,
        [userId]
      );

      const matchDisplays = await Promise.all(
        matchesResult.rows.map(async match => {
          const otherUserId = match.other_user_id;
          const profile = await this.getUserProfile(otherUserId);

          if (!profile) return null;

          return {
            match: {
              id: match.id,
              user_a_id: match.user_a_id,
              user_b_id: match.user_b_id,
              shown_date: match.shown_date,
              ai_compatibility_reasons: match.ai_compatibility_reasons,
              ai_date_suggestions: match.ai_date_suggestions,
              shared_activities: match.shared_activities,
              created_at: match.created_at,
            },
            profile,
            aiInsights: {
              whyMeet: match.ai_compatibility_reasons || [],
              dateIdeas: match.ai_date_suggestions || [],
            },
            sharedActivities: match.shared_activities || [],
          };
        })
      );

      return matchDisplays.filter(Boolean) as MatchDisplay[];
    } finally {
      client.release();
    }
  }
}

export default MatchingService;
