import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (parseInt(formData.age) < 18) {
      alert('You must be at least 18 years old to register');
      return;
    }

    try {
      await register({
        ...formData,
        age: parseInt(formData.age),
      });
      navigate('/onboarding');
    } catch (error) {
      // Error is handled by store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gradient mb-2">Join DateWise</h1>
          <p className="text-gray-600">Create your account and start dating smarter</p>
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="label">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="input"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with a number
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="label">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="18"
                  max="100"
                  className="input"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="location" className="label">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  required
                  className="input"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <optgroup label="Singapore">
                    <option value="Singapore">Singapore</option>
                  </optgroup>
                  <optgroup label="Indonesia">
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bali">Bali</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Bandung">Bandung</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
