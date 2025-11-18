import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Calendar, MapPin, Phone } from 'lucide-react';
import api from '../services/api';
import type { Message, DatePlan } from '../types';
import { format } from 'date-fns';

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [datePlan, setDatePlan] = useState<DatePlan | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Date plan form
  const [showDateForm, setShowDateForm] = useState(false);
  const [dateFormData, setDateFormData] = useState({
    venueName: '',
    dateTime: '',
    contact: '',
  });

  useEffect(() => {
    if (matchId) {
      loadData();
    }
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      const [messagesData, datePlanData] = await Promise.all([
        api.getMessages(parseInt(matchId!)),
        api.getDatePlan(parseInt(matchId!)),
      ]);

      setMessages(messagesData);
      setDatePlan(datePlanData);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const message = await api.sendMessage(parseInt(matchId!), newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedDatePlan = await api.updateDatePlan(parseInt(matchId!), dateFormData);
      setDatePlan(updatedDatePlan);
      setShowDateForm(false);
      alert('Date details saved! 🎉');
    } catch (error) {
      console.error('Failed to save date plan:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleConfirmDate = async () => {
    if (!confirm('Confirm this date? Both of you will be notified.')) return;

    try {
      const updatedDatePlan = await api.updateDatePlan(parseInt(matchId!), {
        status: 'confirmed',
      });
      setDatePlan(updatedDatePlan);
      alert('Date confirmed! 🎉 Have a great time!');
    } catch (error) {
      console.error('Failed to confirm date:', error);
      alert('Failed to confirm. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading chat...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/mutual-matches')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Matches</span>
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Date</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-900">
              💬 <strong>Keep it brief!</strong> Coordinate your date here, then move to WhatsApp/phone.
              Messages limited to 500 characters.
            </p>
          </div>

          {/* Date Plan Section */}
          {datePlan && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">Date Status</h3>
                <span className="badge badge-success">
                  {datePlan.status === 'confirmed' ? 'Confirmed ✓' : 'Planning'}
                </span>
              </div>

              {datePlan.venueName && (
                <div className="flex items-center space-x-2 text-sm text-green-800 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{datePlan.venueName}</span>
                </div>
              )}

              {datePlan.dateTime && (
                <div className="flex items-center space-x-2 text-sm text-green-800 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(datePlan.dateTime), 'MMMM d, yyyy h:mm a')}</span>
                </div>
              )}

              {datePlan.userContact && (
                <div className="flex items-center space-x-2 text-sm text-green-800 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Your contact: {datePlan.userContact}</span>
                </div>
              )}

              {datePlan.otherUserContact && (
                <div className="flex items-center space-x-2 text-sm text-green-800">
                  <Phone className="w-4 h-4" />
                  <span>Their contact: {datePlan.otherUserContact}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {datePlan.status !== 'confirmed' && (
                  <>
                    <button
                      onClick={() => setShowDateForm(!showDateForm)}
                      className="btn btn-secondary flex-1"
                    >
                      {showDateForm ? 'Cancel' : 'Edit Details'}
                    </button>
                    {datePlan.venueName && datePlan.dateTime && (
                      <button
                        onClick={handleConfirmDate}
                        className="btn btn-primary flex-1"
                      >
                        Confirm Date
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Date Plan Form */}
          {showDateForm && (
            <form onSubmit={handleSaveDatePlan} className="mt-4 space-y-4">
              <div>
                <label className="label">Venue/Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Where will you meet?"
                  value={dateFormData.venueName}
                  onChange={(e) =>
                    setDateFormData({ ...dateFormData, venueName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={dateFormData.dateTime}
                  onChange={(e) =>
                    setDateFormData({ ...dateFormData, dateTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Your Phone/WhatsApp</label>
                <input
                  type="text"
                  className="input"
                  placeholder="+65 1234 5678"
                  value={dateFormData.contact}
                  onChange={(e) =>
                    setDateFormData({ ...dateFormData, contact: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Save Details
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from_user_id === messages[0]?.from_user_id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.from_user_id === messages[0]?.from_user_id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {message.sender_name && (
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      {message.sender_name}
                    </p>
                  )}
                  <p className="break-words">{message.message_text}</p>
                  <p className={`text-xs mt-1 ${message.from_user_id === messages[0]?.from_user_id ? 'text-white/75' : 'text-gray-500'}`}>
                    {format(new Date(message.created_at), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Quick messages:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setNewMessage("When works for you?")}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              When works for you?
            </button>
            <button
              onClick={() => setNewMessage("Let's do this!")}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Let's do this!
            </button>
            <button
              onClick={() => setNewMessage("Here's my number: ")}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Share contact
            </button>
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Type a message (max 500 chars)..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value.slice(0, 500))}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="btn btn-primary flex items-center justify-center px-6"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          {newMessage.length}/500 characters
        </p>
      </div>
    </div>
  );
}
