export interface FileWithStatus {
  id: string;
  file: File;
  status: 'pending' | 'converting' | 'completed' | 'error';
  errorMessage?: string;
  progress?: number;
}

export enum TargetFormat {
  PDF = 'pdf',
  TXT = 'txt', // Added for dropdown variety, though implementation focuses on PDF
  HTML = 'html'
}

// Internal type definitions for Mammoth
interface MammothConvertOptions {
  arrayBuffer: ArrayBuffer;
}

interface MammothResult {
  value: string; // The generated HTML
  messages: any[];
}

// Declarations for libraries loaded via CDN
// We export them as constants retrieved from the window object so they can be imported in other files.

export const mammoth = (typeof window !== 'undefined' ? (window as any).mammoth : undefined) as {
  convertToHtml(options: MammothConvertOptions): Promise<MammothResult>;
};

export const html2pdf = (typeof window !== 'undefined' ? (window as any).html2pdf : undefined) as () => {
  from(element: HTMLElement | string): {
    set(opt: any): {
      save(filename?: string): Promise<void>;
    };
  };
};
