# MedSynk

**MedSynk** is an emergency medical system designed to connect users in urgent situations with nearby medical assistance using modern web technologies and mapping integration.

---

## 🚀 Features
- **Real-Time Location Tracking**: Request emergency aid with responders located via Google Maps integration.  
- **Full Stack Architecture**: Decoupled frontend (Next.js) and backend (Express.js, Node.js).  
- **Optimized Database**: MongoDB for fast and scalable data storage.  
- **User-Friendly Design**: Clean interfaces for both help seekers and responders.  

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (React framework)  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Maps & Geolocation**: Google Maps API  
- **Languages**: TypeScript, JavaScript  

---

## 📂 Project Structure
MedSynk/
├── backend/ # Server logic (Express.js + API endpoints)
├── frontend/ # User interfaces (Next.js)
└── README.md # Project overview and setup guide


---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/koushikrai/MedSynk.git
cd MedSynk
```
### 2. Install dependencies
```bash
Frontend
cd frontend
npm install

Backend
cd ../backend
npm install
```
3. Configure Environment Variables
```bash
Create a .env file inside the backend folder and add:

MONGODB_URI=<Your MongoDB connection URI>
GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>
```
4. Run the application
```bash
Backend
cd backend
npm run dev

Frontend
cd ../frontend
npm run dev
```

👉 Open the app at medsynk.netlify.app
