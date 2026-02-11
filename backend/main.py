import os
import shutil
import tempfile
import pythoncom
import win32com.client
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def docx_to_pdf_win32(input_path, output_path):
    """
    Converts a DOCX file to PDF using Microsoft Word via COM automation.
    This works only on Windows with MS Word installed.
    """
    # Initialize COM library for the current thread
    pythoncom.CoInitialize()
    
    word = None
    doc = None
    try:
        # Create Word Application instance
        word = win32com.client.DispatchEx("Word.Application")
        
        # CRITICAL: Disable alerts and Normal.dotm save prompts to prevent UI hang and file lock
        word.DisplayAlerts = 0 # wdAlertsNone
        word.Options.SaveNormalPrompt = False
        word.Visible = False
        
        # Absolute paths are required for COM automation
        input_path = os.path.abspath(input_path)
        output_path = os.path.abspath(output_path)
        
        # Open the document
        # ReadOnly=True to avoid potential locks if file is open in Word
        doc = word.Documents.Open(input_path, ReadOnly=True)
        
        # wdFormatPDF = 17
        doc.ExportAsFixedFormat(output_path, 17)
        
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        raise e
    finally:
        # Cleanup
        try:
            if doc:
                doc.Close(0) # 0 = wdDoNotSaveChanges
            if word:
                word.Quit()
        except:
            pass
        # Uninitialize COM
        pythoncom.CoUninitialize()

@app.post("/convert")
async def convert_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only .docx and .doc files are supported.")

    # Create a temporary directory to handle files
    with tempfile.TemporaryDirectory() as temp_dir:
        input_file_path = os.path.join(temp_dir, file.filename)
        output_file_name = os.path.splitext(file.filename)[0] + ".pdf"
        output_file_path = os.path.join(temp_dir, output_file_name)

        # Save uploaded file
        with open(input_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # Perform conversion
            docx_to_pdf_win32(input_file_path, output_file_path)
            
            # Since we are using a temporary directory that will be deleted after the block,
            # we need to copy the result to a persistent location if we want to return FileResponse safely,
            # OR we can read the file into memory and return a response.
            # However, for simplicity and to avoid memory issues with large PDFs, 
            # we'll copy it to a "results" folder or just send it directly if possible.
            
            # Actually, FileResponse might fail if the file is deleted immediately.
            # Let's read into memory for the response as a simpler alternative for a local tool.
            
            with open(output_file_path, "rb") as f:
                content = f.read()
            
            # Create a more persistent temp file for the response or use a custom StreamingResponse
            # To keep it simple and robust:
            final_output_path = os.path.join(os.getcwd(), "converted_output.pdf")
            shutil.copy2(output_file_path, final_output_path)
            
            return FileResponse(
                path=final_output_path,
                filename=output_file_name,
                media_type='application/pdf'
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Word PDF Converter is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
