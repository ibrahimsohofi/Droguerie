import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, User, Bot, Phone, Mail, Clock, Check, CheckCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Droguerie Jamal. How can we help you today?",
      sender: 'agent',
      timestamp: new Date(),
      agentName: 'Sarah from Support',
      status: 'delivered'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    hasProvided: false
  });
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [attachments, setAttachments] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { t } = useLanguage();

  const quickActions = [
    { id: 1, text: "Track my order", action: "track_order" },
    { id: 2, text: "Product information", action: "product_info" },
    { id: 3, text: "Return & exchange", action: "return_exchange" },
    { id: 4, text: "Prescription inquiry", action: "prescription" },
    { id: 5, text: "Store hours", action: "store_hours" },
    { id: 6, text: "Talk to pharmacist", action: "pharmacist" }
  ];

  const predefinedResponses = {
    track_order: "I'd be happy to help you track your order. Please provide your order number and I'll look it up for you.",
    product_info: "What product would you like to know more about? I can help with availability, dosage, side effects, and more.",
    return_exchange: "Our return policy allows returns within 30 days of purchase. Do you have your receipt or order number?",
    prescription: "For prescription inquiries, I can connect you with our licensed pharmacist. What specific questions do you have?",
    store_hours: "Our store is open Monday-Saturday 8AM-10PM, Sunday 9AM-8PM. We also offer 24/7 online customer support.",
    pharmacist: "I'm connecting you with our licensed pharmacist. Please hold for a moment."
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate agent typing for predefined responses
    if (agentTyping) {
      const timer = setTimeout(() => {
        setAgentTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [agentTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim() && attachments.length === 0) return;

    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setAttachments([]);
    setShowQuickActions(false);

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);

    // Simulate agent response
    setTimeout(() => {
      setAgentTyping(true);
      setTimeout(() => {
        const responses = [
          "Thank you for contacting us. Let me help you with that.",
          "I understand your concern. Let me check that for you.",
          "That's a great question! Here's what I can tell you...",
          "I'm looking into this right now. One moment please.",
          "Let me get you the most up-to-date information on that."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setMessages(prev => [...prev, {
          id: Date.now(),
          text: randomResponse,
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sarah from Support',
          status: 'delivered'
        }]);
        setAgentTyping(false);
      }, 2000);
    }, 500);
  };

  const handleQuickAction = (action) => {
    const response = predefinedResponses[action];
    if (response) {
      setAgentTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response,
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sarah from Support',
          status: 'delivered'
        }]);
        setAgentTyping(false);
      }, 1500);
    }
    setShowQuickActions(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const CustomerInfoForm = () => (
    <div className="p-4 bg-gray-50 border-b">
      <h4 className="font-semibold mb-3">Let's get started</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Your email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setCustomerInfo(prev => ({ ...prev, hasProvided: true }))}
          disabled={!customerInfo.name.trim() || !customerInfo.email.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Chat
        </button>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-40"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          1
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-96 md:h-[500px]'
    } w-80 md:w-96`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold">Live Support</h3>
            <div className="flex items-center space-x-1 text-sm text-blue-100">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-blue-100 hover:text-white"
          >
            {isMinimized ? '↑' : '↓'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contact Options (when minimized) */}
      {isMinimized && (
        <div className="p-3 flex items-center justify-around border-t border-gray-200">
          <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
          <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
          <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
        </div>
      )}

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {!customerInfo.hasProvided ? (
            <CustomerInfoForm />
          ) : (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {showQuickActions && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">How can we help you today?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map(action => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action.action)}
                          className="text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-left transition-colors"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.sender === 'agent' && message.agentName && (
                        <div className="text-xs text-gray-500 mb-1">{message.agentName}</div>
                      )}

                      <div className="text-sm">{message.text}</div>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map(att => (
                            <div key={att.id} className="text-xs bg-white bg-opacity-20 p-1 rounded">
                              📎 {att.name} ({formatFileSize(att.size)})
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && (
                          <div className="flex items-center space-x-1">
                            {message.status === 'sent' && <Check className="w-3 h-3" />}
                            {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {agentTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-3 py-2 rounded-lg bg-gray-100">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Sarah is typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t">
                  <div className="space-y-1">
                    {attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{att.name}</span>
                          <span className="text-gray-500">({formatFileSize(att.size)})</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(att.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() && attachments.length === 0}
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveChat;
