import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Package,
  CreditCard,
  User,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { language } = useLanguage();

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'orders', name: 'Orders & Shipping', icon: Package },
    { id: 'payment', name: 'Payment & Billing', icon: CreditCard },
    { id: 'account', name: 'Account & Profile', icon: User },
    { id: 'products', name: 'Products & Returns', icon: ShoppingBag },
    { id: 'technical', name: 'Technical Support', icon: Settings }
  ];

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by visiting the "Order History" section in your account dashboard or by using our order tracking tool with your order number and email address.'
    },
    {
      id: 2,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.'
    },
    {
      id: 3,
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days. International shipping may take 7-14 business days depending on your location.'
    },
    {
      id: 4,
      category: 'products',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Digital products and personalized items are non-returnable.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a reset link. Follow the instructions in the email to create a new password.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'The website is not loading properly',
      answer: 'Try clearing your browser cache and cookies, or try using a different browser. If the problem persists, please contact our technical support team.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">Send us an email and we'll get back to you</p>
          <a
            href="mailto:support@droguerie.com"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Send Email
          </a>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">Call us during business hours</p>
          <a
            href="tel:+1234567890"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            Call Now
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <category.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 mb-2">No FAQs found</h4>
              <p className="text-gray-600">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Hours */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Support Hours</h3>
        </div>
        <div className="text-center text-gray-600 space-y-1">
          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p>Saturday: 10:00 AM - 6:00 PM</p>
          <p>Sunday: 12:00 PM - 5:00 PM</p>
          <p className="text-sm mt-2">(All times in EST)</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
