'use client';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface CarouselMediaItem {
  src: string;
  alt: string;
  fileType: string;
}

interface ModalCarouselProps {
  mediaFiles: CarouselMediaItem[];
  carouselHeight?: string;
}

const ModalCarousel: React.FC<ModalCarouselProps> = ({
  mediaFiles,
  carouselHeight = 'h-72',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaFiles || mediaFiles.length === 0) {
    return (
      <p className="text-center text-RCColors-400 py-4">
        No hay multimedia disponible.
      </p>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const currentMedia = mediaFiles[currentIndex];
  const isImage = currentMedia.fileType.startsWith('image/');
  const isVideo = currentMedia.fileType.startsWith('video/');

  return (
    <div
      className={`relative w-full ${carouselHeight} bg-RCColors-900 rounded-md overflow-hidden shadow-inner flex flex-col justify-center items-center`}
    >
      <div className="w-full h-full flex justify-center items-center">
        {isImage && (
          <img
            src={currentMedia.src}
            alt={currentMedia.alt}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out`}
          />
        )}
        {isVideo && (
          <video
            src={currentMedia.src}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out`}
            controls
          />
        )}
        {!isImage && !isVideo && (
          <p className="text-RCColors-300">
            Formato de archivo no soportado para previsualización.
          </p>
        )}
      </div>

      {/* Navigation controls (if there is more than one element) */}
      {mediaFiles.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-RCColors-900/60 text-white p-2 rounded-full hover:bg-RCColors-900/80 focus:outline-none focus:ring-2 focus:ring-primary z-10 transition-colors"
            aria-label="Anterior"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-RCColors-900/60 text-white p-2 rounded-full hover:bg-RCColors-900/80 focus:outline-none focus:ring-2 focus:ring-primary z-10 transition-colors"
            aria-label="Siguiente"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Point indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {mediaFiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200
                  ${currentIndex === index ? 'bg-primary scale-110' : 'bg-RCColors-500/70 hover:bg-RCColors-500'}`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModalCarousel;
