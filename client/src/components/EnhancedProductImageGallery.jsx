import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Grid3X3,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Heart,
  X
} from 'lucide-react';
import ProductImageZoom from './ProductImageZoom';

const EnhancedProductImageGallery = ({
  images = [],
  videos = [],
  productName = '',
  onImageChange,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('main'); // 'main', 'grid', 'zoom', 'fullscreen'
  const [autoPlay, setAutoPlay] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);

  const videoRef = useRef(null);
  const autoPlayRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Combine images and videos into a single media array
  const allMedia = [
    ...images.map(img => ({ ...img, type: 'image' })),
    ...videos.map(video => ({ ...video, type: 'video' }))
  ];

  const currentMedia = allMedia[currentIndex];

  useEffect(() => {
    if (onImageChange) {
      onImageChange(currentIndex);
    }
  }, [currentIndex, onImageChange]);

  useEffect(() => {
    if (autoPlay && allMedia.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % allMedia.length);
      }, 3000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, allMedia.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % allMedia.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        setViewMode('main');
        break;
      case ' ':
        e.preventDefault();
        if (currentMedia?.type === 'video') {
          toggleVideoPlay();
        }
        break;
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted;
      setVideoMuted(!videoMuted);
    }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const threshold = 50;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const downloadImage = () => {
    if (currentMedia?.type === 'image') {
      const link = document.createElement('a');
      link.href = currentMedia.url || currentMedia.src;
      link.download = `${productName}-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (navigator.share && currentMedia) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this image of ${productName}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const MainView = () => (
    <div className="relative">
      <div
        className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
        onClick={() => setViewMode('zoom')}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {currentMedia?.type === 'image' ? (
          <img
            src={currentMedia.url || currentMedia.src || currentMedia}
            alt={currentMedia.alt || `${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : currentMedia?.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentMedia.url || currentMedia.src}
              className="w-full h-full object-cover"
              muted={videoMuted}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              poster={currentMedia.poster}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideoPlay();
                }}
                className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-70 transition-opacity"
              >
                {isVideoPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVideoMute();
              }}
              className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            >
              {videoMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center">
              <Grid3X3 className="w-12 h-12 mx-auto mb-2" />
              <p>No media available</p>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('fullscreen');
            }}
            className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('grid');
            }}
            className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            title="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          {currentMedia?.type === 'image' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadImage();
              }}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareImage();
            }}
            className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Media counter */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allMedia.length}
          </div>
        )}

        {/* Auto-play indicator */}
        {autoPlay && (
          <div className="absolute bottom-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
            Auto
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && allMedia.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                index === currentIndex
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {media.type === 'image' ? (
                <img
                  src={media.url || media.src || media}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Play className="w-4 h-4 text-gray-600" />
                </div>
              )}
              {media.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="rounded"
            />
            <span>Auto-play</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showThumbnails}
              onChange={(e) => setShowThumbnails(e.target.checked)}
              className="rounded"
            />
            <span>Show thumbnails</span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('zoom')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Grid</span>
          </button>
        </div>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">All Media ({allMedia.length})</h3>
        <button
          onClick={() => setViewMode('main')}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setViewMode('main');
            }}
            className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors relative group"
          >
            {media.type === 'image' ? (
              <img
                src={media.url || media.src || media}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-600" />
              </div>
            )}
            {media.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Play className="w-6 h-6 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const FullscreenView = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      <button
        onClick={() => setViewMode('main')}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {currentMedia?.type === 'image' ? (
          <img
            src={currentMedia.url || currentMedia.src || currentMedia}
            alt={currentMedia.alt || `${productName} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        ) : currentMedia?.type === 'video' ? (
          <video
            src={currentMedia.url || currentMedia.src}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        ) : null}

        {/* Navigation in fullscreen */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (!allMedia || allMedia.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg aspect-square flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <Grid3X3 className="w-12 h-12 mx-auto mb-2" />
          <p>No media available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {viewMode === 'main' && <MainView />}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'zoom' && (
        <ProductImageZoom
          images={images}
          selectedImageIndex={currentIndex}
          onImageChange={setCurrentIndex}
        />
      )}
      {viewMode === 'fullscreen' && <FullscreenView />}
    </div>
  );
};

export default EnhancedProductImageGallery;
