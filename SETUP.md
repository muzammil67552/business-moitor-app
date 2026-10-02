# Business Note Reminder App Setup Guide

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   start-dev.bat
   ```

2. **Or manually start both servers:**

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd gradient-flow-planner
npm install
npm run dev
```

## 🔧 Configuration

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing: `note-take-app-89a10`
3. Enable Authentication and Firestore
4. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Replace the content in `backend/serviceAccountKey.json`

### 2. Email Configuration

Update `backend/.env` with your Gmail credentials:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

**To get Gmail App Password:**
1. Enable 2-factor authentication on your Gmail
2. Go to Google Account Settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this password in the .env file

### 3. Database Setup

The app automatically creates the following Firestore collections:
- `users` - User profiles
- `verificationCodes` - Email verification codes (temporary)

## 🔐 Authentication Flow

1. **Sign Up:**
   - User enters email and password
   - Backend creates Firebase user
   - Verification code sent to email
   - User enters code to verify

2. **Sign In:**
   - User enters credentials
   - Backend verifies user exists and is verified
   - JWT token generated and stored

3. **Email Verification:**
   - 6-digit code sent to email
   - Code expires in 10 minutes
   - Max 5 attempts before requiring new code

## 🌐 API Endpoints

- `POST /signup` - Create new user account
- `POST /verify` - Verify email with code
- `POST /signin` - Sign in existing user
- `POST /resend-verification` - Resend verification code

## 🛠️ Troubleshooting

### Server Error 500
- Check if `.env` file exists in backend folder
- Verify Firebase service account key is valid
- Check email credentials are correct

### Network Error
- Ensure backend server is running on port 5000
- Check if frontend is trying to connect to correct URL

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2-factor authentication is enabled
- Ensure "Less secure app access" is disabled (use app password instead)

## 📱 Features

- ✅ User Registration with Email Verification
- ✅ Secure Sign In/Sign Out
- ✅ JWT Token Authentication
- ✅ Email Verification Codes
- ✅ Resend Verification Option
- ✅ Firebase Integration
- ✅ Modern UI with Gradient Design

## 🔄 Development

- Backend: Node.js + Express + Firebase Admin
- Frontend: React + TypeScript + Vite
- Database: Firebase Firestore
- Email: Nodemailer with Gmail
- Authentication: Firebase Auth + JWT