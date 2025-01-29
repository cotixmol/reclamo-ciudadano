import React, { useRef } from 'react';
import { FiPaperclip, FiTrash2 } from 'react-icons/fi';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      alert('You can upload up to 5 files.');
      return;
    }

    setFiles([...files, ...selectedFiles]);
    setFileNames([...fileNames, ...selectedFiles.map((file) => file.name)]);
  };

  const handleDelete = (index: number) => {
    const newFiles = [...files];
    const newFileNames = [...fileNames];
    newFiles.splice(index, 1);
    newFileNames.splice(index, 1);
    setFiles(newFiles);
    setFileNames(newFileNames);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block mb-1">{t('multimediaUpload')}</label>
      <div
        className="flex items-center bg-gray-700 rounded p-2 focus-within:ring-2 focus-within:ring-primary cursor-pointer"
        onClick={handleClick}
      >
        <FiPaperclip className="text-gray-400 mr-2" />
        <span className="text-gray-400">{t('selectFiles')}</span>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Display Selected Files */}
      {fileNames.length > 0 && (
        <ul className="mt-2">
          {fileNames.map((name, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-800 p-2 rounded mb-1"
            >
              <span>{name}</span>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-primary hover:text-primary-hover"
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
