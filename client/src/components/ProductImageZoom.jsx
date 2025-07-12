import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize } from 'lucide-react';

const ProductImageZoom = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetImage = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative max-w-full max-h-full">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transformOrigin: `${position.x}% ${position.y}%`,
              transition: 'transform 0.3s ease-out'
            }}
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={zoomIn}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={zoomOut}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={rotate}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{
            transform: isZoomed
              ? `scale(2) translate(${(50 - position.x) * 0.5}%, ${(50 - position.y) * 0.5}%)`
              : 'scale(1)',
            transformOrigin: 'center'
          }}
        />

        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            Zoom: 2x
          </div>
        )}
      </div>

      {/* Control buttons - visible on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
        <button
          onClick={toggleFullscreen}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
          title="Fullscreen view"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      {/* Zoom instructions */}
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          Hover to zoom
        </div>
      </div>
    </div>
  );
};

export default ProductImageZoom;
