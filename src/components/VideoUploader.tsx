import React, { useState, useRef } from 'react';
import { Upload, X, FileVideo, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect, onClear, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
              ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-zinc-300 hover:border-zinc-400 bg-white'}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <div className="bg-brand-100 p-4 rounded-full mb-4">
              <Upload className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">Upload Video</h3>
            <p className="text-zinc-500 text-center max-w-xs">
              Drag and drop your video file here, or click to browse from your computer.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
              <AlertCircle className="w-3 h-3" />
              <span>Supports MP4, WebM, MOV (Max 20MB recommended)</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm"
          >
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-brand-100 p-2 rounded-lg">
                  <FileVideo className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={onClear}
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={URL.createObjectURL(selectedFile)}
                controls
                className="max-h-full w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
