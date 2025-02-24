import React from 'react';
import Image from 'next/image';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-RCColors-900">
      <div className="animate-bounceSmooth w-auto h-auto max-w-[200px] max-h-[200px]">
        <Image
          src="/logo_RD_new_blanco.png"
          alt="Reputation Digital Logo"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
      </div>

      {/* Spinner below the logo */}
      <div className="mt-8 h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;
