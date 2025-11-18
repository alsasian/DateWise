import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, MapPin, Briefcase } from 'lucide-react';
import api from '../services/api';
import type { MutualMatch } from '../types';
import { format } from 'date-fns';

export default function MutualMatchesPage() {
  const [matches, setMatches] = useState<MutualMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await api.getMutualMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load mutual matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your connections...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Mutual Matches</h1>

        <div className="card text-center py-12">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Mutual Matches Yet</h2>
          <p className="text-gray-600 mb-4">
            When someone likes you back, they'll appear here.
          </p>
          <Link to="/matches" className="btn btn-primary inline-flex">
            View Today's Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mutual Matches 💚</h1>
          <p className="text-gray-600">
            You have {matches.length} mutual {matches.length === 1 ? 'match' : 'matches'}. Start planning dates!
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div key={match.matchId} className="card hover:shadow-xl transition-shadow">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {match.profile.name}, {match.profile.age}
                  </h3>
                  <div className="flex flex-col space-y-1 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{match.profile.location}</span>
                    </div>
                    {match.profile.occupation && (
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{match.profile.occupation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {match.unreadMessages > 0 && (
                <span className="badge badge-primary">
                  {match.unreadMessages} new
                </span>
              )}
            </div>

            {/* Match Info */}
            <div className="text-xs text-gray-500 mb-4">
              Matched {format(new Date(match.matchedAt), 'MMM d, yyyy')}
            </div>

            {/* Shared Activities */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {match.sharedActivities.length} Shared Activities
              </p>
              <div className="flex flex-wrap gap-2">
                {match.sharedActivities.slice(0, 3).map((sa, idx) => (
                  <span key={idx} className="badge badge-primary text-xs">
                    {sa.activity_name}
                  </span>
                ))}
                {match.sharedActivities.length > 3 && (
                  <span className="badge badge-secondary text-xs">
                    +{match.sharedActivities.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Date Status */}
            {match.datePlan ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">
                    Date {match.datePlan.status === 'confirmed' ? 'Confirmed' : 'Planning'}
                  </span>
                </div>
                {match.datePlan.venueName && (
                  <p className="text-sm text-green-800">📍 {match.datePlan.venueName}</p>
                )}
                {match.datePlan.dateTime && (
                  <p className="text-sm text-green-800">
                    🗓️ {format(new Date(match.datePlan.dateTime), 'MMM d, h:mm a')}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-900 font-medium">
                  📅 No date planned yet - Start the conversation!
                </p>
              </div>
            )}

            {/* AI Date Ideas */}
            {match.aiInsights.dateIdeas[0] && (
              <div className="bg-primary-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-primary-900 mb-1">AI Suggestion</p>
                <p className="text-sm text-gray-700">{match.aiInsights.dateIdeas[0].description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <Link
              to={`/chat/${match.matchId}`}
              className="btn btn-primary w-full flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {match.datePlan?.status === 'confirmed' ? 'View Chat' : 'Plan Your Date'}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
