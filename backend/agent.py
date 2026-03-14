import os
import json
import random
import string
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

PORTAL_MAP = {
    "electricity": {
        "department": "State Electricity Board / DISCOM",
        "portal": "CPGRAMS (cpgrams.gov.in)",
        "escalation": "Electricity Ombudsman"
    },
    "water": {
        "department": "Municipal Water Department",
        "portal": "PGPortal (pgportal.gov.in)",
        "escalation": "State Water Authority"
    },
    "road": {
        "department": "PWD / Municipal Corporation",
        "portal": "PGPortal (pgportal.gov.in)",
        "escalation": "District Collector Office"
    },
    "police": {
        "department": "State Police Department",
        "portal": "State Police Portal",
        "escalation": "Superintendent of Police"
    },
    "consumer": {
        "department": "Consumer Disputes Redressal Forum",
        "portal": "CONFONET (confonet.nic.in)",
        "escalation": "State Consumer Commission"
    },
    "ration": {
        "department": "Food & Civil Supplies Department",
        "portal": "PGPortal (pgportal.gov.in)",
        "escalation": "District Supply Officer"
    },
    "healthcare": {
        "department": "Ministry of Health & Family Welfare",
        "portal": "CPGRAMS (cpgrams.gov.in)",
        "escalation": "State Health Commissioner"
    },
    "other": {
        "department": "General Grievance Cell",
        "portal": "CPGRAMS (cpgrams.gov.in)",
        "escalation": "District Magistrate Office"
    }
}

CLASSIFY_PROMPT = """
You are a grievance classification expert for Indian government complaints.

Analyze the following citizen complaint and respond ONLY with a valid JSON object.

Complaint: "{complaint}"

Return this exact JSON structure:
{{
  "category": "<one of: electricity, water, road, police, consumer, ration, healthcare, other>",
  "summary": "<one sentence summary of the complaint>",
  "urgency": "<low, medium, or high>",
  "key_facts": ["<fact 1>", "<fact 2>", "<fact 3>"]
}}

Rules:
- category must be one of the exact values listed
- key_facts should be 2-4 bullet facts extracted from the complaint
- urgency: high if safety/health risk, medium if financial impact, low otherwise
- Return ONLY the JSON, no markdown, no explanation
"""

DRAFT_PROMPT = """
You are a legal complaint writing expert. Write a formal grievance letter for an Indian citizen.

Complaint Category: {category}
Department: {department}
Portal: {portal}
Citizen's Complaint (in their words): "{complaint}"
Key Facts: {key_facts}

Write a formal, professional grievance letter with:
- Proper salutation (To, The Officer-in-Charge, {department})
- Clear subject line
- Polite but firm body paragraphs explaining the issue with facts
- Specific request for action and resolution timeline
- Professional closing

The letter should be 150-250 words, formal, and legally appropriate.
Do NOT include placeholder text like [Name] or [Date] — use "the undersigned citizen" and today's date ({today}).
"""


def generate_reference_number(category: str) -> str:
    suffix = ''.join(random.choices(string.digits, k=6))
    cat_code = category[:4].upper()
    year = datetime.now().year
    return f"GRV-{year}-{cat_code}-{suffix}"


def process_grievance(complaint: str) -> dict:
    # Step 1: Classify
    classify_response = model.generate_content(
        CLASSIFY_PROMPT.format(complaint=complaint)
    )
    
    raw = classify_response.text.strip()
    # Clean potential markdown code fences
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    
    classification = json.loads(raw)
    category = classification.get("category", "other")
    
    portal_info = PORTAL_MAP.get(category, PORTAL_MAP["other"])
    
    # Step 2: Draft formal complaint
    today = datetime.now().strftime("%d %B %Y")
    draft_response = model.generate_content(
        DRAFT_PROMPT.format(
            category=category.title(),
            department=portal_info["department"],
            portal=portal_info["portal"],
            complaint=complaint,
            key_facts=", ".join(classification.get("key_facts", [])),
            today=today
        )
    )
    
    formal_letter = draft_response.text.strip()
    ref_number = generate_reference_number(category)
    
    return {
        "category": category,
        "summary": classification.get("summary", ""),
        "urgency": classification.get("urgency", "medium"),
        "key_facts": classification.get("key_facts", []),
        "department": portal_info["department"],
        "portal": portal_info["portal"],
        "escalation": portal_info["escalation"],
        "formal_letter": formal_letter,
        "reference_number": ref_number,
        "submitted_at": datetime.now().isoformat()
    }
