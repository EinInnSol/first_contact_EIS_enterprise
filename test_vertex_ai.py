from anthropic import Anthropic
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_claude_haiku():
    """Test Claude Haiku 4.5 via direct Anthropic API."""
    print("Testing Claude Haiku 4.5 via Anthropic API...\n")
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ ERROR: ANTHROPIC_API_KEY not found in .env file")
        return
    
    print(f"API Key found: {api_key[:20]}...")
    
    try:
        client = Anthropic(api_key=api_key)
        
        print("Sending test prompt...")
        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=100,
            messages=[
                {
                    "role": "user",
                    "content": "You are an expert caseworker. Suggest one urgent intervention for a homeless client who has missed 3 medical appointments. Keep it under 20 words."
                }
            ]
        )
        
        print("\n--- CLAUDE HAIKU RESPONSE ---")
        print(message.content[0].text)
        print("-----------------------------")
        print("\n✅ SUCCESS! Claude Haiku 4.5 is working!")
        print("This AI will power the First Contact E.I.S. recommendations.")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Change to backend directory to load .env
    import sys
    sys.path.insert(0, 'backend')
    test_claude_haiku()
