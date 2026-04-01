# ISL Connect

A real-time Indian Sign Language recognition system using AI.

## Features

- Real-time hand gesture detection
- ISL alphabet and number recognition
- Confidence scoring
- Smoothed live predictions
- ISL reference chart

## Tech Stack

- Frontend: React + TypeScript
- Backend: Flask
- ML Model: Ensemble classifier trained on MediaPipe hand landmarks
- Hand Tracking: MediaPipe

## Demo

<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/27765e12-9623-4477-ae10-319565437973" />
<img width="1919" height="1079" alt="Screenshot 2026-03-24 174218" src="https://github.com/user-attachments/assets/a1c96ea8-e67c-4ace-aecd-dfe419800f94" />
<img width="1913" height="938" alt="image" src="https://github.com/user-attachments/assets/fdde3d67-4fb8-41ca-b847-795fc8209464" />

## How to Run

### Backend Setup

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks activation, run this once in the current terminal and try again:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

### Train the Model

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python train_model.py
```

This writes:

- `backend/isl_model.pkl`
- `backend/label_encoder.pkl`

### Start the Backend API

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python isl_api.py
```

The API will be available at `http://127.0.0.1:5000`.

### Frontend

```powershell
npm install
npm run dev
```

If `npm` is blocked by PowerShell script policy, use:

```powershell
npm.cmd run dev
```

Before starting the frontend, create a `.env` file from `.env.example` and paste your Firebase Web App config into it. The app validates these values at startup so missing or placeholder keys are caught before Firebase Auth initializes.

## Future Improvements

- Better model accuracy
- Full sentence recognition
- Mobile support
