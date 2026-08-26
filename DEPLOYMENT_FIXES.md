# Deployment Fixes - CORS and Firebase Configuration

## Issues Fixed

### 1. ✅ Backend CORS Configuration (FIXED)
**Problem**: Backend CORS was only accepting `http://localhost:5173` but frontend is deployed at `https://foody-kxvt.onrender.com`

**Solution Applied**:
- Updated `backend/index.js` to use a callback function for CORS origin validation
- Now accepts multiple origins:
  - `process.env.FRONTEND_URL` (from .env)
  - `https://foody-kxvt.onrender.com` (production frontend)
  - `http://localhost:5173` (development)
  - `http://localhost:3000` (fallback)

### 2. ✅ Frontend API URL Configuration (FIXED)
**Problem**: Frontend was hardcoded to wrong backend URL

**Solution Applied**:
- Updated `frontend/src/App.jsx` serverUrl to use environment variable:
  ```javascript
  export const serverUrl = import.meta.env.VITE_API_URL || "https://foody-backend-3l58.onrender.com"
  ```
- Now uses `VITE_API_URL` environment variable if provided, falls back to correct backend URL

### 3. 🔧 Firebase Authorized Domain (MANUAL STEP REQUIRED)
**Problem**: Firebase auth is rejecting domain `foody-kxvt.onrender.com`

**Solution - DO THIS IN FIREBASE CONSOLE**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `foody-ac13e`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `foody-kxvt.onrender.com`
6. Also add any other frontend domains you use

## Environment Variables to Set

### Backend (.env on Render)
```
FRONTEND_URL=https://foody-kxvt.onrender.com
VITE_API_URL=https://foody-backend-3l58.onrender.com
PORT=3000
# ... other variables
```

### Frontend (.env.local or build variables on Render)
```
VITE_API_URL=https://foody-backend-3l58.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

## Testing After Fixes

1. **Test CORS** - Open browser console and check:
   - No CORS errors for API calls to `/api/user/current`
   - No CORS errors for `/api/shop/get-by-city/`
   - No CORS errors for `/api/item/get-by-city/`

2. **Test Firebase** - Try to sign in with Google:
   - Error should change from `auth/unauthorized-domain` to normal Firebase flow
   - May show OAuth login popup

3. **Deployment Steps**:
   - Push these changes to your repository
   - Render will auto-rebuild both frontend and backend
   - Update Render environment variables if needed
   - Verify Firebase console has the domain added

## Files Modified
- `/backend/index.js` - Updated CORS configuration
- `/frontend/src/App.jsx` - Updated serverUrl to use environment variable
