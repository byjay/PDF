import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

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
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        w-full h-64 rounded-xl border-2 border-dashed transition-all duration-200 ease-out
        flex flex-col items-center justify-center text-center p-6
        ${isDragging
          ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-200 scale-[1.02] ring-4 ring-blue-200 ring-opacity-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white hover:shadow-md'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept=".docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />

      <div className={`p-4 rounded-full mb-4 transition-all duration-200 ${isDragging
          ? 'bg-blue-600 scale-125 shadow-xl'
          : 'bg-blue-100 group-hover:bg-blue-200 group-hover:scale-110'
        }`}>
        <Upload className={`w-8 h-8 transition-colors duration-200 ${isDragging ? 'text-white' : 'text-blue-600'
          }`} />
      </div>

      <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${isDragging ? 'text-blue-700' : 'text-gray-700'
        }`}>
        {isDragging ? '파일을 여기에 놓으세요' : '파일을 여기에 드래그하거나 클릭하여 업로드'}
      </h3>
      <p className={`text-sm max-w-sm transition-colors duration-200 ${isDragging ? 'text-blue-600 font-medium' : 'text-gray-500'
        }`}>
        {isDragging ? 'DOCX 파일을 추가합니다...' : '대량의 .docx 파일을 한번에 변환할 수 있습니다.'}
      </p>

      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm pointer-events-none animate-pulse">
          <div className="bg-white/90 px-6 py-3 rounded-lg shadow-2xl">
            <p className="text-blue-700 font-bold text-xl flex items-center gap-2">
              <FileText className="w-6 h-6 animate-bounce" />
              파일 추가 준비 완료
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
