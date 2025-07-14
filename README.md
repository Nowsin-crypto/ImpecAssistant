**im.pek.assistant**

im.pek.assistant is an AI-powered chatbot web app built with React (frontend), Flask (backend), and Google Gemini for natural language responses. Conversations are saved to Firebase, enabling seamless human support reachout to clients through persistent chat history, which enhances customer service satisfaction. The app is designed for rapid prototyping, clean UI, and easy extension to voice features (which is currently being implemented).

**Story behind me creating this AI agent :** 

So basically, I am a night owl, I usually do all my work mostly at night, which includes exploring websites for career opporunities, or getting services and products. I was exploring the impekable's website the other day and realized that the webiste didn't have a chatbot for clients, in case they have questions and can't reach human support outside of office hours. My intention behind creating it was basically having the AI be the front line support for clients if they have questions. I have used gemini 1.5 flash for rapid responses. However, since the responses would be very general instead of product specific, there's a high chance the customers questions might be left unanswered. I have created a feature where it shows a button underneath, saying, "Submit the chat for human support". Once the customer clicks it in case they still have questions about certain products, the whole conversation will get stored on Firebase Database, where an employee from the internal team can review those asap during office hours and reach out to the clients with product or service specific answers, which I believe enhances customer satisfaction, as I feel it is more interactive then  submitting a ticket.

**Features**

Conversational AI:
Chat with an assistant powered by Google Gemini 1.5 Flash for fast, natural responses.

Persistent Chat History:
All messages are stored in a conversation array and can be submitted to Firebase for support or analytics.

Modern UI:
Responsive chat bubbles, dark mode, and user-friendly layout for a professional look.

Error Handling:
Graceful feedback for API/network errors and missing input.

Features Currently being implemented (Working on it)

Voice Integration:
Backend is structured for easy addition of ElevenLabs or browser-based speech features (Currently being implemented).

Dynamic Responses:
The responses to be completely specific for certain products or services instead of generic answers.

**Tech Stack**

Layer            -        Technology
Frontend         -        React, CSS (custom, Tailwind optional), Firebase JS SDK
Backend	         -        Flask, Python, Flask-CORS, python-dotenv, Requests
AI Model	       -        Google Gemini 1.5 Flash (via API)
Database	       -        Firebase Firestore

**Setup Instructions**

1. Clone the Repo

bash
git clone https://github.com/yourusername/impek-assistant.git
cd impek-assistant

2. Install Dependencies

Frontend
bash
cd frontend
npm install

3. Backend

bash
cd ../backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

4. Start the Servers

Backend
bash
python app.py
Runs on http://localhost:5001

Frontend
bash
npm start
Runs on http://localhost:3000


**Usage**

Open the frontend in your browser.

Type a message and click Ask.

The assistant responds using Google Gemini.

All messages appear in the chat history.

Click Submit Conversation to Support to save the chat to Firebase for follow-up.


Demo video: (https://www.loom.com/share/a87a704fd8b94f35b336fb6bd65bc63e?sid=7d592b81-ef7a-49ee-b0ac-3ba651b303ac)

