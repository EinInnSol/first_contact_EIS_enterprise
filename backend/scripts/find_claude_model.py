from anthropic import AnthropicVertex
import os

PROJECT_ID = "einharjer-valhalla"
REGION = "us-east5"

def test_claude_models():
    """Test various Claude model names to find which one is enabled."""
    print(f"Testing Claude models in {REGION}...\n")
    
    # Possible model names for Claude Haiku 4.5
    models_to_test = [
        "claude-3-5-haiku@20241022",  # Standard format
        "claude-3-5-haiku-20241022",   # Without @
        "claude-3-5-haiku",             # Version-less
        "claude-haiku-4-5",             # Alternative naming
        "claude-3-haiku@20240307",      # Older Haiku
    ]
    
    client = AnthropicVertex(region=REGION, project_id=PROJECT_ID)
    
    for model_name in models_to_test:
        print(f"Testing: {model_name}...", end=" ")
        try:
            message = client.messages.create(
                model=model_name,
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}]
            )
            print("✅ WORKS!")
            print(f"   Response: {message.content[0].text}")
            print(f"\n🎉 SUCCESS! Use this model: {model_name}\n")
            return model_name
        except Exception as e:
            if "404" in str(e):
                print("❌ Not found")
            elif "403" in str(e):
                print("⛔ Unauthorized")
            else:
                print(f"⚠️ Error: {str(e)[:50]}")
    
    print("\n❌ None of the tested models are available.")
    print("Please check the exact model name in Vertex AI Model Garden.")

if __name__ == "__main__":
    test_claude_models()
