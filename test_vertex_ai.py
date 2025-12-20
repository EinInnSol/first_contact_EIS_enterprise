import vertexai
from vertexai.generative_models import GenerativeModel, Part
import os

PROJECT_ID = "einharjer-valhalla"
REGION = "us-central1" # Try central if east fails

def test_gemini():
    print(f"Initializing Vertex AI in {REGION}...")
    try:
        vertexai.init(project=PROJECT_ID, location=REGION)
        
        model = GenerativeModel("gemini-1.5-pro-001")
        
        print("Sending prompt to Gemini...")
        response = model.generate_content(
            "You are an expert caseworker. Suggest one urgent intervention for a homeless client who has missed 3 medical appointments. Keep it under 20 words."
        )
        
        print("\n--- RESPONSE ---")
        print(response.text)
        print("----------------")
        print("SUCCESS: Connected to Vertex AI Gemini!")
        
    except Exception as e:
        print(f"\nERROR: {e}")
        # Check if it's a "location not found" or auth error
        if "404" in str(e):
             print("TIP: Check if region supports Gemini 1.5 Pro.")

if __name__ == "__main__":
    test_gemini()
