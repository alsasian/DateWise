import { useEffect, useState } from 'react';
import { User, MapPin, Briefcase, Heart, Edit, X } from 'lucide-react';
import api from '../services/api';
import type { UserProfile } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveActivity = async (userActivityId: number) => {
    if (!confirm('Remove this activity?')) return;

    try {
      await api.removeActivity(userActivityId);
      await loadProfile();
    } catch (error) {
      console.error('Failed to remove activity:', error);
      alert('Failed to remove activity. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Failed to load profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-5 h-5" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {/* Basic Info */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex flex-col space-y-1 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                {profile.occupation && (
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {profile.profile_completed ? (
            <span className="badge badge-success">✓ Complete</span>
          ) : (
            <span className="badge badge-warning">Incomplete</span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">{profile.email}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Occupation</h3>
            <p className="text-gray-700">{profile.occupation || 'Not specified'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
            <p className="text-gray-700">{profile.interests || 'Not specified'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Values</h3>
            <p className="text-gray-700">{profile.values || 'Not specified'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Lifestyle</h3>
            <p className="text-gray-700">{profile.lifestyle || 'Not specified'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Relationship Goals</h3>
            <p className="text-gray-700">{profile.relationship_goals || 'Not specified'}</p>
          </div>

          {profile.deal_breakers && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Deal-Breakers</h3>
              <p className="text-gray-700">{profile.deal_breakers}</p>
            </div>
          )}

          {profile.personality && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Personality</h3>
              <p className="text-gray-700">{profile.personality}</p>
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Match Preferences</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Age Range</p>
            <p className="text-gray-900">
              {profile.age_preference_min} - {profile.age_preference_max} years old
            </p>
          </div>
          {profile.location_preference && (
            <div>
              <p className="text-sm text-gray-600">Location Preference</p>
              <p className="text-gray-900">{profile.location_preference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Activities */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-600" />
            <span>Your Activities ({profile.activities?.length || 0})</span>
          </h3>
        </div>

        {!profile.activities || profile.activities.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No activities selected yet</p>
            <p className="text-sm text-gray-500">
              Add activities you'd love to do on dates!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.activities.map((ua) => (
              <div
                key={ua.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{ua.activity.icon}</span>
                    <h4 className="font-semibold text-gray-900">
                      {ua.activity.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemoveActivity(ua.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  {ua.specific_venue && (
                    <p>📍 {ua.specific_venue}</p>
                  )}
                  {ua.location_area && (
                    <p>🗺️ {ua.location_area}</p>
                  )}
                  {ua.preferred_time && (
                    <p>🕐 {ua.preferred_time}</p>
                  )}
                  {ua.notes && (
                    <p className="italic">💭 {ua.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ Select at least 3-5 activities for better matches</li>
          <li>✅ Add specific details to your activities (venues, times, notes)</li>
          <li>✅ Keep your profile info authentic and detailed</li>
          <li>✅ Update your preferences as they change</li>
        </ul>
      </div>
    </div>
  );
}
