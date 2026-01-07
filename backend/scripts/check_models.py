
import vertexai
import os
import traceback

PROJECT_ID = "einharjer-valhalla"
REGIONS = ["us-east5", "us-central1", "europe-west1"]

def list_models():
    known_models = [
        "claude-3-5-sonnet-v2@20241022",
        "claude-3-5-sonnet@20240620",
        "claude-3-5-sonnet-v2", # Try alias
        "claude-3-opus@20240229",
        "claude-3-haiku@20240307",
    ]

    try:
        from anthropic import AnthropicVertex
    except ImportError:
        print("❌ 'anthropic' library not found. Installing...")
        os.system("pip install anthropic[vertex]")
        from anthropic import AnthropicVertex

    for region in REGIONS:
        print(f"\nScanning Region: {region}...")
        try:
            # Initialize Vertex AI for the current region
            vertexai.init(project=PROJECT_ID, location=region)
            
            client = AnthropicVertex(region=region, project_id=PROJECT_ID)
            
            print("  --- Probing Known Models ---")
            for model in known_models:
                print(f"  Checking {model}...", end=" ")
                try:
                    # Minimal token generation to test access
                    message = client.messages.create(
                        model=model,
                        max_tokens=5,
                        messages=[{"role": "user", "content": "Hi"}]
                    )
                    print("[AVAILABLE]")
                except Exception as e:
                    err_str = str(e).lower()
                    if "404" in err_str or "not found" in err_str:
                        print("[NOT FOUND]")
                    elif "403" in err_str or "permission denied" in err_str:
                        print("[UNAUTHORIZED]")
                    else:
                        print(f"[ERROR: {str(e)[:50]}...]")
        
        except Exception as e:
            print(f"Region {region} init failed or client error: {e}")
            # traceback.print_exc() # Uncomment for more detailed error if needed

if __name__ == "__main__":
    list_models()
