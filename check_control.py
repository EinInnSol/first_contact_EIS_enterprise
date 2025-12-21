
from google.cloud import aiplatform
import vertexai
from vertexai.preview.language_models import TextGenerationModel

PROJECT_ID = "einharjer-valhalla"
REGION = "us-central1"

def list_foundation_models():
    print(f"Listing models in {REGION}...")
    aiplatform.init(project=PROJECT_ID, location=REGION)
    
    try:
        # Try to list models (this might return a lot, or require specific filters)
        # Using a simple probe for Gemini to verify basic access first
        from vertexai.generative_models import GenerativeModel
        
        print("Probing Gemini 1.5 Pro (Control Test)...")
        try:
            model = GenerativeModel("gemini-1.5-pro")
            response = model.generate_content("Hi", stream=False)
            print("✅ Gemini 1.5 Pro is AVAILABLE.")
        except Exception as e:
            print(f"❌ Gemini 1.5 Pro check failed: {e}")

        # Now try to verify Claude location again with a known-good us-east5 endpoint if possible
        # but since 'us-east5' failed in the previous script, let's trust that result for now.
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_foundation_models()
