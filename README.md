# Clara – AI-Powered Professional Engagement Assistant

![Clara Banner](./images/clara.png)  
*Your intelligent professional networking companion*

## 🌟 Overview

Clara is an AI assistant that automates and personalizes professional introductions. She engages visitors through natural conversations about your skills/projects, classifies their interest level, and triggers context-aware follow-ups.

**Key Value Proposition**:  
✅ 24/7 professional presence  
✅ Automated lead qualification  
✅ Personalized engagement tracking  

---

## 🖼️ Visual Walkthrough

### 2. System Architecture
```mermaid
![Component Diagram](./images/component_diagram.jpg)  
graph LR
    A[React Frontend] --> B[Node.js Backend]
    B --> C[Gemini AI]
    C --> D[Sentiment Analysis]
    B --> E[MongoDB]
    B --> F[Make.com]
    F --> G[Gmail API]
    F --> H[Follow-up Logic]
🚀 Core Features
Feature	Description	Tech Used
Smart Q&A	Answers questions about skills/projects	Gemini AI
Engagement Tracking	Visual progress (Casual → Deep)	Custom Algorithm
Auto Follow-ups	Personalized emails based on interaction	Gmail API
Secure Auth	Google OAuth login	Firebase
⚙️ Technical Architecture
Component Diagram
https://./assets/architecture.png

Frontend
Diagram
Code





Backend Services
Diagram
Code





🛠️ Setup Guide
Prerequisites
Node.js v18+

MongoDB Atlas account

Google Cloud API keys

Installation
bash
# Clone repo
git clone https://github.com/your-repo/clara.git

# Install dependencies
cd clara/backend && npm install
cd ../frontend && npm install

# Configure environment
cp .env.example .env
# Add your API keys
Running Locally
bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev
📂 File Structure
text
clara/
├── backend/           # Node.js server
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── config.js      # Environment config
├── frontend/          # React app
│   ├── public/
│   └── src/
│       ├── components/
│       └── pages/
└── assets/            # Images/diagrams
📈 Engagement Workflow
Initial Contact

Visitor asks about background

Clara responds with tailored info

json
{"engagement": 15%, "status": "Casual"}
Deepening Interest

Follow-up questions trigger detailed responses

json
{"engagement": 65%, "status": "Active"}
Automated Follow-up

System sends personalized email

json
{"action": "email_sent", "template": "technical_skills"}
📜 License
MIT License - Free for personal and professional use

✉️ Contact
Dileepa Dilshan
📧 dileepa2001083@gmail.com
🔗 LinkedIn Profile
🐙 GitHub Repository

text

**To use this README**:
1. Create an `/assets` folder in your project root
2. Add these image files:
   - `clara-banner.png` (1200x400px header image)
   - `chat-demo.gif` (screen recording of chat flow)
   - `architecture.png` (component diagram)
3. Replace placeholder links (`#`) with actual URLs

The markdown includes:
- Visual hierarchy with clear sections
- Mermaid.js diagrams for architecture
- Responsive tables for feature comparison
- JSON snippets showing system states
- Complete setup instructions
- File structure tree
- License and contact info