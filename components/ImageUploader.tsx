
import React, { useState } from 'react';
import { Upload, Camera, ImageIcon } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  onCameraClick: () => void;
}

const ImageUploader: React.FC<Props> = ({ onFileSelect, onCameraClick }) => {
  const [isDragging, setIsDragging] = useState(false);

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
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-80 
          border-3 border-dashed rounded-3xl cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
          }
        `}
      >
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center">
          <div className="mb-6 p-4 bg-indigo-100 rounded-full text-indigo-600">
            <Upload className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-bold text-slate-700">
            将图片拖拽至此
          </p>
          <p className="text-slate-500 font-medium">
            或点击从您的电脑浏览
          </p>
          <div className="mt-8 flex items-center space-x-6">
            <div className="flex items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 mr-2" /> JPG, PNG, WEBP
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <Camera className="w-4 h-4 mr-2" /> 实时拍摄
            </div>
          </div>
        </div>
      </label>

      <div className="flex items-center justify-center">
        <button 
          onClick={onCameraClick}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow active:scale-[0.98]"
        >
          <Camera className="w-5 h-5 text-indigo-600" />
          <span>直接拍摄照片</span>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
