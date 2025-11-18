import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Calendar, CheckCircle, Clock, TrendingUp, Sparkles } from 'lucide-react';
import api from '../services/api';
import type { DashboardData } from '../types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to <span className="text-gradient">DateWise</span>
        </h1>
        <p className="text-lg text-gray-600">
          Your matches are ready. Let's make some real connections! 💚
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
          <TrendingUp className="w-8 h-8 text-pink-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{dashboard.stats.totalMatches}</p>
          <p className="text-sm text-gray-600">Total Matches</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <Heart className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{dashboard.stats.mutualMatches}</p>
          <p className="text-sm text-gray-600">Mutual Matches</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{dashboard.stats.datesPlanned}</p>
          <p className="text-sm text-gray-600">Dates Planned</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{dashboard.stats.datesCompleted}</p>
          <p className="text-sm text-gray-600">Dates Completed</p>
        </div>
      </div>

      {/* Today's Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Today's Matches</h2>
          </div>
          {dashboard.todaysMatches.length > 0 && (
            <Link to="/matches" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          )}
        </div>

        {dashboard.todaysMatches.length === 0 ? (
          <div className="card text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No new matches today</p>
            <p className="text-sm text-gray-500 mt-2">Check back tomorrow for fresh matches!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.todaysMatches.slice(0, 3).map((match) => (
              <Link
                key={match.match.id}
                to="/matches"
                className="card hover:shadow-xl transition-shadow cursor-pointer"
              >
                {/* Profile Preview */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                  <Heart className="w-20 h-20 text-primary-400" />
                </div>

                <h3 className="text-xl font-semibold mb-1">
                  {match.profile.name}, {match.profile.age}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  📍 {match.profile.location} • {match.profile.occupation}
                </p>

                {/* Shared Activities */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    {match.sharedActivities.length} Shared Activities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {match.sharedActivities.slice(0, 3).map((sa, idx) => (
                      <span key={idx} className="badge badge-primary text-xs">
                        {sa.activity_name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Insights Preview */}
                {match.aiInsights.whyMeet[0] && (
                  <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                    <p className="text-sm text-gray-700">
                      "{match.aiInsights.whyMeet[0]}"
                    </p>
                  </div>
                )}

                <button className="btn btn-primary w-full mt-4">
                  View Full Profile
                </button>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pending Responses */}
      {dashboard.pending.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Waiting for Response</h2>
          </div>

          <div className="card">
            <p className="text-gray-600 mb-4">
              You've expressed interest in {dashboard.pending.length} {dashboard.pending.length === 1 ? 'person' : 'people'}.
              Waiting for their response!
            </p>
            <div className="flex flex-wrap gap-2">
              {dashboard.pending.map((pending, idx) => (
                <span key={idx} className="badge badge-warning">
                  {pending.profile.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mutual Matches CTA */}
      {dashboard.stats.mutualMatches > 0 && (
        <section>
          <Link to="/mutual-matches" className="card bg-gradient-primary text-white hover:shadow-2xl transition-all block">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">You have mutual matches!</h3>
                </div>
                <p className="text-white/90">
                  {dashboard.stats.mutualMatches} {dashboard.stats.mutualMatches === 1 ? 'person wants' : 'people want'} to meet you. Start planning dates!
                </p>
              </div>
              <div className="text-4xl font-bold">{dashboard.stats.mutualMatches}</div>
            </div>
          </Link>
        </section>
      )}

      {/* Getting Started Tips */}
      {dashboard.stats.totalMatches === 0 && (
        <section className="card bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="text-xl font-semibold mb-4">Getting Started with DateWise</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium">Complete your profile</p>
                <p className="text-sm text-gray-600">Add more details and select activities</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium">Check your matches daily</p>
                <p className="text-sm text-gray-600">You'll get 2-3 curated matches every day</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium">Like profiles that interest you</p>
                <p className="text-sm text-gray-600">When they like you back, it's a match!</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium">Plan a date together</p>
                <p className="text-sm text-gray-600">Skip the endless chat and meet in real life</p>
              </div>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
