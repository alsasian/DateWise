import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { UserProfile, AIMatchRecommendation, SharedActivity } from '../types';

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

interface MatchContext {
  userA: UserProfile;
  userB: UserProfile;
  sharedActivities: SharedActivity[];
}

export class AIService {
  /**
   * Generate match recommendations using Claude API
   */
  static async generateMatchRecommendation(
    context: MatchContext
  ): Promise<AIMatchRecommendation> {
    const { userA, userB, sharedActivities } = context;

    const prompt = this.buildMatchPrompt(userA, userB, sharedActivities);

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Parse the response
      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const recommendation = this.parseRecommendation(content.text);
      return recommendation;
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Return fallback recommendation
      return this.generateFallbackRecommendation(userA, userB, sharedActivities);
    }
  }

  /**
   * Build the prompt for Claude
   */
  private static buildMatchPrompt(
    userA: UserProfile,
    userB: UserProfile,
    sharedActivities: SharedActivity[]
  ): string {
    return `You are a dating app matchmaker. Generate a compelling match recommendation.

USER A PROFILE:
Name: ${userA.name}
Age: ${userA.age}
Location: ${userA.location}
Occupation: ${userA.occupation || 'Not specified'}
Interests: ${userA.interests || 'Not specified'}
Values: ${userA.values || 'Not specified'}
Lifestyle: ${userA.lifestyle || 'Not specified'}
Relationship Goals: ${userA.relationship_goals || 'Not specified'}
Personality: ${userA.personality || 'Not specified'}

USER B PROFILE:
Name: ${userB.name}
Age: ${userB.age}
Location: ${userB.location}
Occupation: ${userB.occupation || 'Not specified'}
Interests: ${userB.interests || 'Not specified'}
Values: ${userB.values || 'Not specified'}
Lifestyle: ${userB.lifestyle || 'Not specified'}
Relationship Goals: ${userB.relationship_goals || 'Not specified'}
Personality: ${userB.personality || 'Not specified'}

SHARED ACTIVITIES:
${sharedActivities.map(sa => {
  const userADetails = sa.user_a_details;
  const userBDetails = sa.user_b_details;
  return `- ${sa.activity_name}
  ${userADetails?.venue ? `  ${userA.name}'s preference: ${userADetails.venue}` : ''}
  ${userADetails?.area ? `  ${userA.name}'s area: ${userADetails.area}` : ''}
  ${userADetails?.time ? `  ${userA.name}'s preferred time: ${userADetails.time}` : ''}
  ${userADetails?.notes ? `  ${userA.name}'s notes: ${userADetails.notes}` : ''}
  ${userBDetails?.venue ? `  ${userB.name}'s preference: ${userBDetails.venue}` : ''}
  ${userBDetails?.area ? `  ${userB.name}'s area: ${userBDetails.area}` : ''}
  ${userBDetails?.time ? `  ${userB.name}'s preferred time: ${userBDetails.time}` : ''}
  ${userBDetails?.notes ? `  ${userB.name}'s notes: ${userBDetails.notes}` : ''}`;
}).join('\n\n')}

Generate a match recommendation with:

1. WHY THEY SHOULD MEET (3-4 reasons):
   - Focus on genuine compatibility based on values, interests, and lifestyle
   - Reference specific details from their profiles
   - Be encouraging but authentic
   - Make it personal and meaningful

2. WHAT THEY COULD DO TOGETHER (2-3 specific date ideas):
   - Based on their shared activities above
   - Include specific venues/locations if they mentioned them
   - Make suggestions concrete and actionable
   - Consider their locations (${userA.location} and ${userB.location})
   - Reference their preferences (time, notes, etc.)

Format your response EXACTLY as follows:

COMPATIBILITY_REASONS:
- [First reason]
- [Second reason]
- [Third reason]
- [Fourth reason if applicable]

DATE_IDEAS:
- [First idea with activity name and specific details]
- [Second idea with activity name and specific details]
- [Third idea if applicable]

Keep the tone warm, encouraging, and action-oriented. Focus on real compatibility, not superficial traits.`;
  }

  /**
   * Parse Claude's response into structured data
   */
  private static parseRecommendation(text: string): AIMatchRecommendation {
    const compatibility_reasons: string[] = [];
    const date_suggestions: Array<{ activity: string; location?: string; description: string }> = [];

    // Split into sections
    const sections = text.split(/(?:COMPATIBILITY_REASONS:|DATE_IDEAS:)/i);

    // Parse compatibility reasons
    if (sections[1]) {
      const reasons = sections[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
      compatibility_reasons.push(...reasons);
    }

    // Parse date ideas
    if (sections[2]) {
      const ideas = sections[2]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());

      for (const idea of ideas) {
        // Try to extract activity and details
        const parts = idea.split(/(?:at|in|near)/i, 2);
        if (parts.length > 1) {
          date_suggestions.push({
            activity: parts[0].trim(),
            location: parts[1].trim(),
            description: idea,
          });
        } else {
          date_suggestions.push({
            activity: idea.split(':')[0].trim(),
            description: idea,
          });
        }
      }
    }

    return {
      compatibility_reasons,
      date_suggestions,
    };
  }

  /**
   * Generate fallback recommendation if AI fails
   */
  private static generateFallbackRecommendation(
    userA: UserProfile,
    userB: UserProfile,
    sharedActivities: SharedActivity[]
  ): AIMatchRecommendation {
    const compatibility_reasons = [
      `You both live in ${userA.location === userB.location ? 'the same area' : 'nearby locations'}, making it convenient to meet up`,
      `You share ${sharedActivities.length} common ${sharedActivities.length === 1 ? 'activity' : 'activities'}, showing aligned interests`,
      `You're both looking for meaningful connections and have compatible lifestyles`,
    ];

    const date_suggestions = sharedActivities.slice(0, 3).map(activity => ({
      activity: activity.activity_name,
      description: `Try ${activity.activity_name} together - you both expressed interest in this activity`,
    }));

    return {
      compatibility_reasons,
      date_suggestions,
    };
  }

  /**
   * Generate a quick compatibility score (0-100)
   */
  static calculateCompatibilityScore(
    userA: UserProfile,
    userB: UserProfile,
    sharedActivitiesCount: number
  ): number {
    let score = 0;

    // Location proximity (30 points)
    if (userA.location === userB.location) {
      score += 30;
    } else if (
      userA.location.toLowerCase().includes(userB.location.toLowerCase()) ||
      userB.location.toLowerCase().includes(userA.location.toLowerCase())
    ) {
      score += 20;
    } else {
      score += 10;
    }

    // Shared activities (40 points)
    score += Math.min(40, sharedActivitiesCount * 10);

    // Age compatibility (15 points)
    const ageDiff = Math.abs(userA.age - userB.age);
    if (ageDiff <= 3) score += 15;
    else if (ageDiff <= 5) score += 10;
    else if (ageDiff <= 8) score += 5;

    // Profile completeness (15 points)
    const fieldsA = [
      userA.interests,
      userA.values,
      userA.lifestyle,
      userA.relationship_goals,
    ].filter(Boolean).length;
    const fieldsB = [
      userB.interests,
      userB.values,
      userB.lifestyle,
      userB.relationship_goals,
    ].filter(Boolean).length;
    score += ((fieldsA + fieldsB) / 8) * 15;

    return Math.round(Math.min(100, score));
  }
}

export default AIService;
