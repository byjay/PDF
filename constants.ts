export const ACCEPTED_FILE_TYPES = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const FORMAT_OPTIONS = [
  { value: 'docx', label: 'Word 문서 (*.docx)', disabled: true },
  { value: 'docm', label: 'Word 매크로 사용 문서 (*.docm)', disabled: true },
  { value: 'doc', label: 'Word 97-2003 문서 (*.doc)', disabled: true },
  { value: 'pdf', label: 'PDF (*.pdf)', disabled: false },
  { value: 'txt', label: '일반 텍스트 (*.txt)', disabled: true }, // Placeholder for UI realism
  { value: 'html', label: '웹 페이지 (*.htm;*.html)', disabled: true }, // Placeholder for UI realism
];
