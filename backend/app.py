from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")

print("GEMINI_API_KEY:", GEMINI_API_KEY)

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 200

    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key not set'}), 500

    data = request.get_json()
    user_input = data.get('message') if data else None
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400

    gemini_payload = {
        "contents": [{"parts": [{"text": user_input}]}]
    }

    try:
        gemini_response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json=gemini_payload
        )
        gemini_response.raise_for_status()
        gemini_json = gemini_response.json()
        gemini_text = gemini_json['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"response": gemini_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/speak', methods=['POST', 'OPTIONS'])
def speak():
    if request.method == 'OPTIONS':
        return '', 200

    if not ELEVENLABS_API_KEY:
        return jsonify({'error': 'ElevenLabs API key not set'}), 500

    data = request.get_json()
    text = data.get('text') if data else None
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
    }
    voice_id = "Rachel"

    try:
        response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.content, 200, {'Content-Type': 'audio/mpeg'}
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
