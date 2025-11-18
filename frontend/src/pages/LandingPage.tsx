import { Link } from 'react-router-dom';
import { Heart, Coffee, Calendar, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Coffee,
      title: 'Activity-First Matching',
      description: 'Select activities you want to do. Match with people who share your interests.',
    },
    {
      icon: Heart,
      title: 'AI-Powered Insights',
      description: 'Get personalized compatibility reasons and date ideas for each match.',
    },
    {
      icon: Calendar,
      title: 'Skip the Small Talk',
      description: 'No endless messaging. Plan a real date from day one.',
    },
    {
      icon: MessageCircle,
      title: 'Minimal Coordination',
      description: 'Just enough chat to set up the date, then meet in person.',
    },
  ];

  const howItWorks = [
    'Create your profile and select activities you love',
    'Get 2-3 curated matches daily with AI insights',
    'Like profiles that interest you',
    'When you match, plan a real date together',
    'Skip the chat, make it happen!',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-12 h-12 text-white" fill="white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-gradient">DateWise</span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold">
              Skip the chat, plan the date
            </p>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The dating app that gets you meeting in real life.
              Match based on activities, get AI insights, plan real dates.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                Log In
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Singapore & Indonesia 🇸🇬 🇮🇩
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why <span className="text-gradient">DateWise</span>?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We're different. We focus on getting you offline and onto real dates.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It <span className="text-gradient">Works</span>
          </h2>

          <div className="space-y-6">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Differentiator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-primary text-white">
            <h2 className="text-3xl font-bold mb-6">
              The DateWise Difference
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-lg">
                  <strong>Before matching:</strong> Select specific activities you want to do (coffee at your favorite café, hiking MacRitchie, trying new restaurants)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-lg">
                  <strong>When you match:</strong> You already know what to do together. No awkward "so what do you want to do?" conversations
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-lg">
                  <strong>AI helps you:</strong> Get personalized insights on why you're compatible and specific date ideas based on your shared interests
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <p className="text-lg">
                  <strong>Minimal messaging:</strong> Just coordinate logistics, then meet in real life
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start dating smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join DateWise today and meet people who actually want to go out.
          </p>
          <Link to="/register" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center">
            Create Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6" fill="white" />
            <span className="text-xl font-bold">DateWise</span>
          </div>
          <p className="text-gray-400">
            © 2025 DateWise. Activity-first dating for Singapore & Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
