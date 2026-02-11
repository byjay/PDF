import React from 'react';
import { FORMAT_OPTIONS } from '../constants';
import { Download, Play } from 'lucide-react';

interface ControlPanelProps {
  onConvert: () => void;
  isConverting: boolean;
  fileCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onConvert, isConverting, fileCount }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* Dropdown Section mimicking "Save as type" */}
        <div className="flex-grow w-full">
          <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-2">
            파일 형식 (대상 포맷)
          </label>
          <div className="relative">
            <select
              id="format-select"
              disabled
              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border shadow-sm cursor-not-allowed appearance-none"
              defaultValue="pdf"
            >
              {FORMAT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Custom Arrow for styling consistency */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            * 현재 PDF 변환만 지원합니다.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={onConvert}
            disabled={isConverting || fileCount === 0}
            className={`
              w-full md:w-48 flex items-center justify-center px-6 py-2.5 border border-transparent 
              text-base font-medium rounded-lg shadow-sm text-white 
              transition-all duration-200
              ${isConverting || fileCount === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                처리 중...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                변환 및 저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
