# 🚨 IMMEDIATE FIX - 400 Bad Request Error

## The Problem
Your frontend shows: **"Analysis failed. Please ensure backend is running at http://localhost:8000"**

Backend logs show: **`400 Bad Request`** on OPTIONS `/api/v1/analyze`

## The Cause
**CORS (Cross-Origin Resource Sharing) misconfiguration**

The backend was configured to only accept requests from `http://localhost:8501` (Streamlit), but your React frontend runs on `http://localhost:3000`.

## The Fix (3 Steps)

### ✅ Step 1: I Already Fixed the Code
I updated `backend/config.py` to allow React frontend connections.

### ✅ Step 2: Restart Your Backend (REQUIRED!)

**In the terminal running the backend:**

1. Press `Ctrl+C` to stop the backend
2. Run this command again:
   ```bash
   python backend/main.py
   ```

**You MUST restart for the changes to take effect!**

### ✅ Step 3: Test the Fix

**Option A: Use the test script**
```bash
python test_api.py
```

Expected output:
```
✅ PASS - Health Check
✅ PASS - CORS Preflight
✅ PASS - Analyze Endpoint
🎉 All tests passed!
```

**Option B: Test in browser**
1. Go to http://localhost:3000
2. Click "Content Analyzer"
3. Paste this text:
   ```
   The chairman announced that his company will hire more female engineers.
   ```
4. Click "Start Analysis"
5. Should work now! ✅

---

## What Changed

**Before (❌ Broken):**
```python
ALLOWED_ORIGINS: List[str] = ["http://localhost:8501"]
```

**After (✅ Fixed):**
```python
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8501",  # Streamlit (legacy)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8501"
]
```

---

## Quick Verification Checklist

- [ ] Backend stopped (Ctrl+C)
- [ ] Backend restarted (`python backend/main.py`)
- [ ] Backend shows: `INFO: Uvicorn running on http://0.0.0.0:8000`
- [ ] Test script passes: `python test_api.py`
- [ ] Frontend works: http://localhost:3000

---

## Still Getting 400 Error?

### Check 1: Did you restart the backend?
The config changes only apply after restart!

### Check 2: Is backend actually running?
```bash
python test_api.py
```

### Check 3: Check browser console
1. Open browser (F12)
2. Go to Console tab
3. Look for CORS errors
4. Should see successful requests now

### Check 4: Clear browser cache
Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Understanding the Error

**What you saw:**
- Frontend: "Analysis failed"
- Backend logs: `400 Bad Request` on `OPTIONS /api/v1/analyze`

**Why it happened:**
1. Browser sends OPTIONS request (CORS preflight)
2. Backend checks if origin is allowed
3. `http://localhost:3000` was NOT in allowed list
4. Backend rejects with 400 error
5. Frontend never gets to send actual POST request

**After fix:**
1. Browser sends OPTIONS request
2. Backend sees `http://localhost:3000` IS allowed
3. Backend responds with CORS headers
4. Browser sends POST request
5. Analysis works! ✅

---

## Next Steps After Fix

Once the backend is restarted and working:

1. ✅ Test Content Analyzer with sample text
2. ✅ Try all 7 pages in the frontend
3. ✅ Test with Hindi text
4. ✅ Check preprocessing step displays correctly
5. ✅ Verify bias detection highlights terms

---

**TL;DR: Restart the backend, then test again!** 🚀
