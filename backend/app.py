from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Loading the API keys from environment variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")

# Creating route for CHAT
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    # Organizing Gemini prompt - question from user, getting input, fetching response from gemini api and sending it as response
    gemini_payload = {
        "contents": [{"parts": [{"text": user_input}]}]
    }

    gemini_headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }

    gemini_response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        headers=gemini_headers,
        json=gemini_payload
    )

    gemini_text = gemini_response.json()['candidates'][0]['content']['parts'][0]['text']

    return jsonify({"response": gemini_text})

# Route to convert text to speech using ElevenLabs 
@app.route('/speak', methods=['POST'])
def speak():
    text = request.json.get('text')

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
    }

    voice_id = "Rachel" 

    response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers=headers,
        json=payload
    )

    # Return audio as a binary stream
    return response.content, 200, {'Content-Type': 'audio/mpeg'}

if __name__ == '__main__':
    app.run(debug=True)
