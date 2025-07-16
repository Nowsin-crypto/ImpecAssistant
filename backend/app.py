import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google-cloud-key.json"
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from google.cloud import texttospeech



load_dotenv()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

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

    data = request.get_json()
    text = data.get('text') if data else None
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        client = texttospeech.TextToSpeechClient()
        input_text = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        response = client.synthesize_speech(
            input=input_text,
            voice=voice,
            audio_config=audio_config
        )
        return response.audio_content, 200, {'Content-Type': 'audio/mp3'}

    except Exception as e:
        import traceback
        print(" Google TTS Exception:", str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
