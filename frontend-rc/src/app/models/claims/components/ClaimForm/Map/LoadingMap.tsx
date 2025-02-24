// components/Map/LoadingMap.tsx
import React from 'react';

const LoadingMap: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-RCColors-800 rounded-lg overflow-hidden">
      {/* Blurred Map Image */}
      <img
        src="/blurmap.png"
        alt="Loading Map"
        className="absolute inset-0 w-full h-full object-cover blur-sm"
      />

      {/* Spinner Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading map"
        ></div>
      </div>
    </div>
  );
};

export default LoadingMap;
