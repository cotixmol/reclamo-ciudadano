import React, { useRef, useState, useEffect } from 'react';
import { FiPaperclip, FiTrash2, FiCamera } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface MultimediaUploadProps {
  fileNames: string[];
  setFileNames: React.Dispatch<React.SetStateAction<string[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const MultimediaUpload: React.FC<MultimediaUploadProps> = ({
  fileNames,
  setFileNames,
  files,
  setFiles,
}) => {
  const { t } = useTranslation('claimcreationform');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      setErrorMessage(t('filesLimitError'));
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_SIZE) {
        setErrorMessage(`${file.name} ${t('sizeLimitError')}`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setFileNames((prev) => [...prev, ...validFiles.map((f) => f.name)]);
  };

  const handleDelete = (index: number) => {
    const newFiles = [...files];
    const newFileNames = [...fileNames];
    newFiles.splice(index, 1);
    newFileNames.splice(index, 1);
    setFiles(newFiles);
    setFileNames(newFileNames);
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    // Only trigger camera if isMobile is true
    if (!isMobile) return;
    cameraInputRef.current?.click();
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-2 text-red-500 text-sm">{errorMessage}</div>
      )}
      <label className="block mb-1">{t('multimediaUpload')}</label>

      <div className="flex space-x-2">
        {/* Button to Select Files */}
        <div
          className="flex flex-1 items-center bg-RCColors-700 rounded p-2 
                     focus-within:ring-2 focus-within:ring-primary 
                     cursor-pointer"
          onClick={openFileBrowser}
        >
          <FiPaperclip className="text-RCColors-400 mr-2" />
          <span className="text-RCColors-400">{t('selectFiles')}</span>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Button to Open Camera */}
        <div
          className={`flex items-center justify-center bg-primary rounded p-2 focus-within:ring-2 focus-within:ring-primary ${
            isMobile ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={openCamera}
        >
          <FiCamera className="mr-2" />
          <span>{t('openCamera')}</span>
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            disabled={!isMobile}
          />
        </div>
      </div>

      {/* Display Selected Files */}
      {fileNames.length > 0 && (
        <ul className="mt-2">
          {fileNames.map((name, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-RCColors-800 p-2 rounded mb-1"
            >
              <span>{name}</span>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-primary hover:text-RCPink-hover"
                aria-label={`Delete ${name}`}
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultimediaUpload;
