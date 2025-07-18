import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, Search,
  AlertCircle, CheckCircle, Loader2, Waves
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const VoiceSearch = ({ onResults, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [lang, setLang] = useState('en-US');

  const recognitionRef = useRef(null);
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    checkSupport();
    setSearchLanguage();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    setSearchLanguage();
  }, [language]);

  const checkSupport = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      setupRecognition();
    }
  };

  const setSearchLanguage = () => {
    const langMap = {
      'ar': 'ar-MA', // Arabic (Morocco)
      'fr': 'fr-FR', // French (France)
      'en': 'en-US'  // English (US)
    };
    setLang(langMap[language] || 'en-US');
  };

  const setupRecognition = () => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      let currentConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        currentTranscript += result[0].transcript;
        currentConfidence = result[0].confidence;
      }

      setTranscript(currentTranscript);
      setConfidence(currentConfidence);

      if (event.results[event.results.length - 1].isFinal) {
        handleFinalResult(currentTranscript, currentConfidence);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleFinalResult = async (finalTranscript, finalConfidence) => {
    if (!finalTranscript.trim()) return;

    setIsProcessing(true);

    try {
      // Process voice command and search for products
      const searchResults = await performVoiceSearch(finalTranscript);
      setResults(searchResults);

      if (onResults) {
        onResults(searchResults, finalTranscript);
      }
    } catch (error) {
      setError('Search failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const performVoiceSearch = async (query) => {
    // Simulate API call for voice search
    const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

    try {
      const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}&voice=true`);
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      }
    } catch (error) {
      console.error('Voice search API error:', error);
    }

    // Fallback: mock search results based on common voice search terms
    const mockResults = generateMockResults(query);
    return mockResults;
  };

  const generateMockResults = (query) => {
    const lowerQuery = query.toLowerCase();
    const mockProducts = [
      {
        id: 1,
        name: 'Ariel Detergent Powder',
        name_ar: 'مسحوق أريال للغسيل',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200',
        relevance: 0.9
      },
      {
        id: 2,
        name: 'Dove Beauty Bar',
        name_ar: 'صابون دوف',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200',
        relevance: 0.8
      },
      {
        id: 3,
        name: 'Kitchen Cleaning Spray',
        name_ar: 'بخاخ تنظيف المطبخ',
        price: 12.75,
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200',
        relevance: 0.7
      }
    ];

    // Filter based on voice query
    return mockProducts
      .filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        (product.name_ar && product.name_ar.includes(query)) ||
        lowerQuery.includes('clean') ||
        lowerQuery.includes('soap') ||
        lowerQuery.includes('detergent')
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);
  };

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    recognitionRef.current.lang = lang;
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
    if (onClose) onClose();
  };

  const content = {
    ar: {
      title: 'البحث الصوتي',
      tapToSpeak: 'اضغط للتحدث',
      listening: 'أستمع...',
      processing: 'جاري المعالجة...',
      speakNow: 'تحدث الآن',
      noResults: 'لم يتم العثور على نتائج',
      searchAgain: 'ابحث مرة أخرى',
      notSupported: 'البحث الصوتي غير مدعوم في هذا المتصفح',
      micPermission: 'يرجى السماح بالوصول إلى الميكروفون',
      examples: 'أمثلة: "أريد منظف", "ابحث عن صابون", "منتجات التنظيف"',
      searchResults: 'نتائج البحث'
    },
    fr: {
      title: 'Recherche Vocale',
      tapToSpeak: 'Appuyez pour parler',
      listening: 'Écoute...',
      processing: 'Traitement...',
      speakNow: 'Parlez maintenant',
      noResults: 'Aucun résultat trouvé',
      searchAgain: 'Rechercher à nouveau',
      notSupported: 'Recherche vocale non supportée dans ce navigateur',
      micPermission: 'Veuillez autoriser l\'accès au microphone',
      examples: 'Exemples: "Je veux du détergent", "Chercher du savon", "Produits de nettoyage"',
      searchResults: 'Résultats de recherche'
    },
    en: {
      title: 'Voice Search',
      tapToSpeak: 'Tap to speak',
      listening: 'Listening...',
      processing: 'Processing...',
      speakNow: 'Speak now',
      noResults: 'No results found',
      searchAgain: 'Search again',
      notSupported: 'Voice search not supported in this browser',
      micPermission: 'Please allow microphone access',
      examples: 'Examples: "I want detergent", "Search for soap", "Cleaning products"',
      searchResults: 'Search Results'
    }
  };

  const t = content[language] || content.en;

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h3>
          <p className="text-gray-600">{t.notSupported}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.title}</h3>

        {/* Voice Input Interface */}
        <div className="mb-6">
          <div className="relative inline-block">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : isListening ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </button>

            {/* Sound waves animation */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-red-300 rounded-full animate-ping"></div>
                <div className="absolute w-28 h-28 border-2 border-red-200 rounded-full animate-ping animation-delay-75"></div>
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-600">
            {isProcessing ? t.processing : isListening ? t.listening : t.tapToSpeak}
          </p>

          {/* Confidence indicator */}
          {confidence > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Confidence: {Math.round(confidence * 100)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-medium">"{transcript}"</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">
                {error === 'not-allowed' ? t.micPermission : `Error: ${error}`}
              </span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.searchResults}</h4>
            <div className="space-y-3">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-left">
                    <h5 className="font-medium text-gray-900">
                      {language === 'ar' ? product.name_ar : product.name}
                    </h5>
                    <p className="text-blue-600 font-semibold">{product.price} DH</p>
                  </div>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="text-sm text-gray-500">
          <p>{t.examples}</p>
        </div>

        {/* Language Selection */}
        <div className="mt-4 flex justify-center gap-2">
          {[
            { code: 'ar', label: 'العربية', flag: '🇲🇦' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
            { code: 'en', label: 'English', flag: '🇺🇸' }
          ].map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => setLang(code === 'ar' ? 'ar-MA' : code === 'fr' ? 'fr-FR' : 'en-US')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                lang.startsWith(code)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {flag} {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceSearch;
