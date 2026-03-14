from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import process_grievance
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GrievanceGPT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GrievanceRequest(BaseModel):
    complaint: str


class SubmitRequest(BaseModel):
    reference_number: str
    category: str
    department: str
    portal: str


@app.get("/")
def root():
    return {"status": "GrievanceGPT API is running", "version": "1.0.0"}


@app.post("/api/grievance")
async def analyze_grievance(request: GrievanceRequest):
    if not request.complaint or len(request.complaint.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please describe your complaint in at least 10 characters.")
    
    if len(request.complaint) > 2000:
        raise HTTPException(status_code=400, detail="Complaint too long. Please keep it under 2000 characters.")
    
    try:
        logger.info(f"Processing grievance: {request.complaint[:80]}...")
        result = process_grievance(request.complaint.strip())
        logger.info(f"Generated ref: {result['reference_number']}")
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent processing failed: {str(e)}")


@app.post("/api/submit")
async def submit_grievance(request: SubmitRequest):
    # Simulated submission (for hackathon prototype)
    return {
        "success": True,
        "message": "Complaint submitted successfully!",
        "reference_number": request.reference_number,
        "portal": request.portal,
        "department": request.department,
        "expected_resolution": "7–14 working days",
        "next_steps": [
            f"Your complaint has been registered with {request.department}",
            f"Reference number {request.reference_number} will be used for tracking",
            "You will receive a response within 7–14 working days",
            "If unresolved, the case will be automatically escalated"
        ]
    }
