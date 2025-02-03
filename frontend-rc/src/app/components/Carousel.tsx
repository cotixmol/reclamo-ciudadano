'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export interface MediaFile {
  url: string;
  fileType: string;
}

interface CarouselProps {
  mediaFiles: MediaFile[];
  containerClassName?: string;
  imageClassName?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  mediaFiles,
  containerClassName,
  imageClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaFiles || mediaFiles.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {mediaFiles.map((file, index) => {
        const isActive = index === currentIndex;
        const isImage = file.fileType.startsWith('image/');
        const isVideo = file.fileType.startsWith('video/');
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {isImage && (
              <Image
                src={file.url}
                alt="Media content"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
                className={imageClassName}
              />
            )}
            {isVideo && (
              <video
                src={file.url}
                className={`w-full h-full object-cover ${imageClassName}`}
                controls
              />
            )}
          </div>
        );
      })}
      {mediaFiles.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-20 text-2xl"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-20 text-2xl"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
