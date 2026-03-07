# 🔧 CORS Issue Fix

## Problem
Frontend shows: "Analysis failed. Please ensure backend is running at http://localhost:8000"
Backend logs show: `400 Bad Request` on `/api/v1/analyze`

## Root Cause
The backend's CORS configuration only allowed `http://localhost:8501` (Streamlit) but not `http://localhost:3000` (React).

## Solution Applied ✅
Updated `backend/config.py` to allow React frontend:

```python
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8501",  # Streamlit (legacy)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8501"
]
```

## How to Fix

### Step 1: Stop the Backend
In the terminal running the backend, press `Ctrl+C`

### Step 2: Restart the Backend
```bash
python backend/main.py
```

### Step 3: Verify CORS is Fixed
You should see in the startup logs:
```
🚀 FAIRMEDIA Backend starting up...
🌐 API running at: http://0.0.0.0:8000
```

### Step 4: Test in Frontend
1. Go to http://localhost:3000
2. Navigate to Content Analyzer
3. Paste test text:
   ```
   The chairman announced that his company will hire more female engineers.
   ```
4. Click "Start Analysis"
5. Should work now! ✅

## Verification

### Check Backend Health
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "fairmedia-backend",
  "version": "1.0.0"
}
```

### Test API Directly
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"content": "The chairman said his company needs more engineers."}'
```

Should return analysis results (not 400 error).

## Why This Happened

The original configuration was set up for Streamlit (port 8501), but you're using React (port 3000). CORS (Cross-Origin Resource Sharing) blocks requests from origins not in the allowed list for security.

## Alternative: Use .env File

You can also create a `.env` file in the project root:

```env
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:8501","http://127.0.0.1:3000"]
```

Then restart the backend.

## Still Not Working?

### Check 1: Backend is actually running
```bash
curl http://localhost:8000/health
```

### Check 2: Frontend is using correct URL
Check browser console (F12) → Network tab → Look for the request URL

### Check 3: No firewall blocking
Temporarily disable firewall and test

### Check 4: Clear browser cache
Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## Expected Behavior After Fix

✅ Frontend can connect to backend
✅ Content Analyzer works
✅ No CORS errors in browser console
✅ Analysis completes successfully
✅ Results display properly

---

**Status:** ✅ FIXED - Just restart the backend!
