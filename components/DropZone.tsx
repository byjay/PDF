import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      // Fixed: Explicitly type 'file' as File to avoid unknown type error
      const files = Array.from(e.dataTransfer.files).filter((file: File) => 
        file.name.toLowerCase().endsWith('.docx')
      );
      
      if (files.length > 0) {
        onFilesAdded(files);
      } else {
        alert("docx 파일만 지원됩니다.");
      }
    },
    [onFilesAdded]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        // Fixed: Explicitly type 'file' as File to avoid unknown type error
        const files = Array.from(e.target.files).filter((file: File) =>
          file.name.toLowerCase().endsWith('.docx')
        );
        onFilesAdded(files);
      }
    },
    [onFilesAdded]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center text-center p-6
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept=".docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
      />
      
      <div className={`p-4 rounded-full bg-blue-100 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        파일을 여기에 드래그하거나 클릭하여 업로드
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        대량의 .docx 파일을 한번에 변환할 수 있습니다.
      </p>
      
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
          <p className="text-blue-600 font-bold text-xl">놓아서 파일 추가</p>
        </div>
      )}
    </div>
  );
};
