import React from 'react';
import Image from 'next/image';

const LoadingMap: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Blurred Map Image */}
      <Image src="/blurmap.png" alt="Loading Map" width={400} height={300} />

      {/* Spinner */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingMap;
