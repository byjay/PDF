export const convertDocxToPdf = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `서버 오류: ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.docx?$/i, '.pdf');
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error: any) {
    console.error("Conversion error details:", error);
    if (error.message === 'Failed to fetch') {
      throw new Error("백엔드 서버가 실행 중이지 않습니다. Python 서버를 먼저 실행해 주세요.");
    }
    throw error;
  }
};
