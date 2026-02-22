import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Since we cannot install uuid, we'll write a simple util or assume it exists. Actually, simpler to write a helper.
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { ControlPanel } from './components/ControlPanel';
import { FileWithStatus } from './types';
import { convertDocxToPdf } from './utils/converter';

// Simple UUID generator since we might not have the package installed in this environment
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const filesWithStatus: FileWithStatus[] = newFiles.map(file => ({
      id: generateId(),
      file,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...filesWithStatus]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleConvertAll = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsProcessing(true);

    // Process files sequentially to avoid browser memory issues with heavy PDF generation
    for (const fileItem of pendingFiles) {
      // Update status to converting
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'converting' } : f
      ));

      try {
        await convertDocxToPdf(fileItem.file);

        // Update status to completed
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'completed' } : f
        ));
      } catch (error: any) {
        // Update status to error
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'error', errorMessage: '변환 실패' } : f
        ));
      }
    }

    setIsProcessing(false);
  }, [files]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            DOCX to PDF 변환기
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            여러 개의 Word 문서를 손쉽게 PDF로 일괄 변환하세요.
          </p>
        </div>

        {/* Notice Section */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <h4 className="text-amber-800 font-bold text-sm">중요 공지사항</h4>
          </div>
          <p className="text-amber-700 text-sm leading-relaxed">
            - DOCX 파일을 PDF로 고품질 변환합니다.<br />
            - <strong>관리자 지침:</strong> 현재 시스템은 파일 변환에 최적화되어 있습니다. (이벤트 정보는 포함되지 않습니다.)
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 p-8">

          <DropZone onFilesAdded={handleFilesAdded} />

          <div className="mt-8">
            <FileList
              files={files}
              onRemove={handleRemoveFile}
            />
          </div>

          <ControlPanel
            onConvert={handleConvertAll}
            isConverting={isProcessing}
            fileCount={files.filter(f => f.status === 'pending').length}
          />

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 flex flex-col gap-2">
          <p>서버에 업로드되지 않고 브라우저에서 안전하게 변환됩니다.</p>
          <div className="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Build: {new Date().toLocaleDateString('ko-KR').slice(2, -1)} {new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
