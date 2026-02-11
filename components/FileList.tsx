import React from 'react';
import { FileWithStatus } from '../types';
import { FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

interface FileListProps {
  files: FileWithStatus[];
  onRemove: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-700">작업 대기열 ({files.length})</h3>
        <span className="text-xs text-gray-500">
          {files.filter(f => f.status === 'completed').length} / {files.length} 완료
        </span>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
        {files.map((fileItem) => (
          <div
            key={fileItem.id}
            className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-50 transition-colors group relative"
          >
            {/* Icon Status */}
            <div className="mr-4 flex-shrink-0">
              {fileItem.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {fileItem.status === 'error' && <AlertCircle className="w-6 h-6 text-red-500" />}
              {fileItem.status === 'converting' && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
              {fileItem.status === 'pending' && <FileText className="w-6 h-6 text-gray-400" />}
            </div>

            {/* File Info */}
            <div className="flex-grow min-w-0 mr-4">
              <p className="text-sm font-medium text-gray-800 truncate">{fileItem.file.name}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                {(fileItem.file.size / 1024).toFixed(1)} KB
                <span className="mx-2">•</span>
                <span className={`
                  ${fileItem.status === 'completed' ? 'text-green-600' : ''}
                  ${fileItem.status === 'error' ? 'text-red-600' : ''}
                  ${fileItem.status === 'converting' ? 'text-blue-600' : ''}
                  ${fileItem.status === 'pending' ? 'text-gray-400' : ''}
                `}>
                  {fileItem.status === 'pending' && '대기 중'}
                  {fileItem.status === 'converting' && '변환 중...'}
                  {fileItem.status === 'completed' && '완료됨'}
                  {fileItem.status === 'error' && (fileItem.errorMessage || '오류 발생')}
                </span>
              </p>
            </div>

            {/* Remove Button (only if not converting) */}
            {fileItem.status !== 'converting' && (
              <button
                onClick={() => onRemove(fileItem.id)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                title="목록에서 제거"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
