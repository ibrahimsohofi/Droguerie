import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Sun, Moon, Star, Sunrise, Sunset } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PrayerTimesWidget = ({
  showInNavbar = true,
  city = 'Casablanca',
  country = 'MA'
}) => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [isRamadan, setIsRamadan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { language, isRTL, t } = useLanguage();

  // Prayer names in different languages
  const prayerNames = {
    ar: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء'
    },
    fr: {
      fajr: 'Fajr',
      sunrise: 'Lever du soleil',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    },
    en: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    }
  };

  const prayerIcons = {
    fajr: Sun,
    sunrise: Sunrise,
    dhuhr: Sun,
    asr: Sun,
    maghrib: Sunset,
    isha: Moon
  };

  const messages = {
    ar: {
      prayerTimes: 'أوقات الصلاة',
      next: 'الصلاة القادمة',
      storeHours: 'ساعات المتجر',
      ramadanHours: 'ساعات رمضان',
      closedForPrayer: 'مغلق للصلاة',
      opensAfter: 'يفتح بعد',
      location: 'الموقع'
    },
    fr: {
      prayerTimes: 'Horaires de prière',
      next: 'Prochaine prière',
      storeHours: 'Heures du magasin',
      ramadanHours: 'Heures Ramadan',
      closedForPrayer: 'Fermé pour la prière',
      opensAfter: 'Ouvre après',
      location: 'Lieu'
    },
    en: {
      prayerTimes: 'Prayer Times',
      next: 'Next Prayer',
      storeHours: 'Store Hours',
      ramadanHours: 'Ramadan Hours',
      closedForPrayer: 'Closed for Prayer',
      opensAfter: 'Opens after',
      location: 'Location'
    }
  };

  const msg = messages[language] || messages.en;

  // Fetch prayer times from API
  useEffect(() => {
    fetchPrayerTimes();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [city, country]);

  // Calculate next prayer
  useEffect(() => {
    if (prayerTimes.timings) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using Aladhan API for prayer times
      const response = await fetch(
        `https:/${import.meta.env.VITE_API_URL}/api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=12`
      );

      if (!response.ok) throw new Error('Failed to fetch prayer times');

      const data = await response.json();
      setPrayerTimes(data.data);

      // Check if it's Ramadan (simplified check)
      const hijriMonth = data.data.date.hijri.month.number;
      setIsRamadan(hijriMonth === 9);

    } catch (err) {
      setError(err.message);
      console.error('Prayer times fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes.timings) return;

    const now = currentTime;
    const todayPrayers = [
      { name: 'fajr', time: prayerTimes.timings.Fajr },
      { name: 'dhuhr', time: prayerTimes.timings.Dhuhr },
      { name: 'asr', time: prayerTimes.timings.Asr },
      { name: 'maghrib', time: prayerTimes.timings.Maghrib },
      { name: 'isha', time: prayerTimes.timings.Isha }
    ];

    for (const prayer of todayPrayers) {
      const prayerTime = new Date();
      const [hours, minutes] = prayer.time.split(':');
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (prayerTime > now) {
        setNextPrayer({
          ...prayer,
          timeUntil: Math.round((prayerTime - now) / (1000 * 60))
        });
        return;
      }
    }

    // If no prayer left today, next is Fajr tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = todayPrayers[0].time.split(':');
    tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    setNextPrayer({
      ...todayPrayers[0],
      timeUntil: Math.round((tomorrow - now) / (1000 * 60))
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getStoreStatus = () => {
    if (!prayerTimes.timings) return { open: true, message: '' };

    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    // Check if store is closed for prayer (15 minutes during Dhuhr and Maghrib)
    const dhuhrTime = prayerTimes.timings.Dhuhr;
    const maghribTime = prayerTimes.timings.Maghrib;

    if (dhuhrTime) {
      const [dhuhrHour, dhuhrMin] = dhuhrTime.split(':').map(Number);
      const dhuhrTimeMinutes = dhuhrHour * 60 + dhuhrMin;

      if (currentTimeMinutes >= dhuhrTimeMinutes && currentTimeMinutes <= dhuhrTimeMinutes + 15) {
        return {
          open: false,
          message: msg.closedForPrayer,
          reopensAt: `${String(Math.floor((dhuhrTimeMinutes + 15) / 60)).padStart(2, '0')}:${String((dhuhrTimeMinutes + 15) % 60).padStart(2, '0')}`
        };
      }
    }

    if (maghribTime) {
      const [maghribHour, maghribMin] = maghribTime.split(':').map(Number);
      const maghribTimeMinutes = maghribHour * 60 + maghribMin;

      if (currentTimeMinutes >= maghribTimeMinutes && currentTimeMinutes <= maghribTimeMinutes + 15) {
        return {
          open: false,
          message: msg.closedForPrayer,
          reopensAt: `${String(Math.floor((maghribTimeMinutes + 15) / 60)).padStart(2, '0')}:${String((maghribTimeMinutes + 15) % 60).padStart(2, '0')}`
        };
      }
    }

    return { open: true, message: '' };
  };

  if (loading) {
    return (
      <div className={`prayer-widget ${showInNavbar ? 'navbar-widget' : 'standalone-widget'}`}>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`prayer-widget ${showInNavbar ? 'navbar-widget' : 'standalone-widget'} text-red-600`}>
        <Clock className="h-5 w-5" />
        <span className="text-sm">Prayer times unavailable</span>
      </div>
    );
  }

  const storeStatus = getStoreStatus();

  if (showInNavbar) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-800/50 text-orange-100 hover:text-orange-300 hover:bg-blue-700/70 transition-all duration-300 border border-orange-500/30 ${isRTL ? 'space-x-reverse' : ''}`}
        >
          <Clock className="h-4 w-4" />
          {nextPrayer && (
            <span className="text-xs font-medium hidden lg:inline">
              {prayerNames[language][nextPrayer.name]} in {Math.floor(nextPrayer.timeUntil / 60)}h {nextPrayer.timeUntil % 60}m
            </span>
          )}
          <span className="text-xs font-medium lg:hidden">Prayer</span>
        </button>

        {isExpanded && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsExpanded(false)} />
            <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20`}>
              <PrayerTimesContent
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                storeStatus={storeStatus}
                isRamadan={isRamadan}
                city={city}
                prayerNames={prayerNames}
                language={language}
                isRTL={isRTL}
                msg={msg}
                formatTime={formatTime}
                prayerIcons={prayerIcons}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="prayer-widget-standalone bg-white rounded-lg shadow-md p-6 max-w-md">
      <PrayerTimesContent
        prayerTimes={prayerTimes}
        nextPrayer={nextPrayer}
        storeStatus={storeStatus}
        isRamadan={isRamadan}
        city={city}
        prayerNames={prayerNames}
        language={language}
        isRTL={isRTL}
        msg={msg}
        formatTime={formatTime}
        prayerIcons={prayerIcons}
      />
    </div>
  );
};

const PrayerTimesContent = ({
  prayerTimes,
  nextPrayer,
  storeStatus,
  isRamadan,
  city,
  prayerNames,
  language,
  isRTL,
  msg,
  formatTime,
  prayerIcons
}) => {
  const prayers = [
    { name: 'fajr', time: prayerTimes.timings?.Fajr },
    { name: 'sunrise', time: prayerTimes.timings?.Sunrise },
    { name: 'dhuhr', time: prayerTimes.timings?.Dhuhr },
    { name: 'asr', time: prayerTimes.timings?.Asr },
    { name: 'maghrib', time: prayerTimes.timings?.Maghrib },
    { name: 'isha', time: prayerTimes.timings?.Isha }
  ];

  return (
    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star className="h-5 w-5 text-green-600 mr-2" />
          {msg.prayerTimes}
        </h3>
        {isRamadan && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            رمضان كريم
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{msg.location}: {city}</span>
      </div>

      {/* Next Prayer Alert */}
      {nextPrayer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-green-800">
            {msg.next}: {prayerNames[language][nextPrayer.name]}
          </div>
          <div className="text-xs text-green-600">
            {Math.floor(nextPrayer.timeUntil / 60)}h {nextPrayer.timeUntil % 60}m
          </div>
        </div>
      )}

      {/* Store Status */}
      {!storeStatus.open && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-orange-800">
            {storeStatus.message}
          </div>
          {storeStatus.reopensAt && (
            <div className="text-xs text-orange-600">
              {msg.opensAfter} {storeStatus.reopensAt}
            </div>
          )}
        </div>
      )}

      {/* Prayer Times List */}
      <div className="space-y-2">
        {prayers.map((prayer) => {
          if (!prayer.time || prayer.name === 'sunrise') return null;

          const IconComponent = prayerIcons[prayer.name];
          const isNext = nextPrayer?.name === prayer.name;

          return (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isNext ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <IconComponent className={`h-4 w-4 mr-3 ${isNext ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`text-sm ${isNext ? 'font-semibold text-blue-800' : 'text-gray-700'}`}>
                  {prayerNames[language][prayer.name]}
                </span>
              </div>
              <span className={`text-sm font-mono ${isNext ? 'font-bold text-blue-800' : 'text-gray-600'}`}>
                {formatTime(prayer.time)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Date */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>
            {prayerTimes.date?.readable} • {prayerTimes.date?.hijri?.date}
          </span>
          <Calendar className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesWidget;
