import { useEffect, useState } from 'react';
import { User, MapPin, Briefcase, Heart, Edit, X } from 'lucide-react';
import api from '../services/api';
import type { UserProfile } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    occupation: '',
    interests: '',
    values: '',
    lifestyle: '',
    relationship_goals: '',
    deal_breakers: '',
    personality: '',
    age_preference_min: 18,
    age_preference_max: 100,
    location_preference: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      // Initialize form data with current profile values
      setFormData({
        occupation: data.occupation || '',
        interests: data.interests || '',
        values: data.values || '',
        lifestyle: data.lifestyle || '',
        relationship_goals: data.relationship_goals || '',
        deal_breakers: data.deal_breakers || '',
        personality: data.personality || '',
        age_preference_min: data.age_preference_min || 18,
        age_preference_max: data.age_preference_max || 100,
        location_preference: data.location_preference || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        occupation: profile.occupation || '',
        interests: profile.interests || '',
        values: profile.values || '',
        lifestyle: profile.lifestyle || '',
        relationship_goals: profile.relationship_goals || '',
        deal_breakers: profile.deal_breakers || '',
        personality: profile.personality || '',
        age_preference_min: profile.age_preference_min || 18,
        age_preference_max: profile.age_preference_max || 100,
        location_preference: profile.location_preference || '',
      });
    }
    setIsEditing(false);
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
        {isEditing ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancelEdit}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        )}
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
            {isEditing ? (
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Software Engineer, Teacher, etc."
              />
            ) : (
              <p className="text-gray-700">{profile.occupation || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
            {isEditing ? (
              <textarea
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Hiking, photography, cooking, reading sci-fi..."
              />
            ) : (
              <p className="text-gray-700">{profile.interests || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Values</h3>
            {isEditing ? (
              <textarea
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Honesty, family, adventure, personal growth..."
              />
            ) : (
              <p className="text-gray-700">{profile.values || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Lifestyle</h3>
            {isEditing ? (
              <textarea
                value={formData.lifestyle}
                onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Active and social, quiet evenings at home, traveling often..."
              />
            ) : (
              <p className="text-gray-700">{profile.lifestyle || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Relationship Goals</h3>
            {isEditing ? (
              <textarea
                value={formData.relationship_goals}
                onChange={(e) => setFormData({ ...formData, relationship_goals: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Looking for long-term partnership, casual dating, marriage..."
              />
            ) : (
              <p className="text-gray-700">{profile.relationship_goals || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Deal-Breakers</h3>
            {isEditing ? (
              <textarea
                value={formData.deal_breakers}
                onChange={(e) => setFormData({ ...formData, deal_breakers: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Smoking, no pets, long distance..."
              />
            ) : (
              <p className="text-gray-700">{profile.deal_breakers || 'Not specified'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Personality</h3>
            {isEditing ? (
              <textarea
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Outgoing and spontaneous, thoughtful and introspective..."
              />
            ) : (
              <p className="text-gray-700">{profile.personality || 'Not specified'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Match Preferences</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Age Range</p>
            {isEditing ? (
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Min Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age_preference_min}
                    onChange={(e) => setFormData({ ...formData, age_preference_min: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Max Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age_preference_max}
                    onChange={(e) => setFormData({ ...formData, age_preference_max: parseInt(e.target.value) || 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-900">
                {profile.age_preference_min} - {profile.age_preference_max} years old
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Location Preference</p>
            {isEditing ? (
              <input
                type="text"
                value={formData.location_preference}
                onChange={(e) => setFormData({ ...formData, location_preference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Within 10 miles, Same city, Willing to relocate..."
              />
            ) : (
              <p className="text-gray-900">{profile.location_preference || 'Not specified'}</p>
            )}
          </div>
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
