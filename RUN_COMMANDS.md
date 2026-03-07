# 🚀 FAIRMEDIA - Run Commands

**Quick reference for running the system**

---

## ✅ Start the System

### Terminal 1 - Backend
```bash
python backend/main.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

---

## 🧪 Test the System

### Run Backend Tests
```bash
python test_backend.py
```

### Check Backend Health
```bash
curl http://localhost:8000/health
```

### Test API Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "The chairman said his company needs more female engineers."}'
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 🛠️ Installation Commands

### First Time Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
cd frontend
npm install
cd ..
```

---

## 🐛 Troubleshooting Commands

### Kill Port 8000 (Backend)
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Kill Port 3000 (Frontend)
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Reinstall Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reinstall Backend
```bash
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

---

## 📊 Test Sample Texts

### English Gender Bias
```
The chairman announced that his company will hire more female engineers. 
He said that women are naturally more nurturing and emotional.
```

### Hindi Cultural Bias
```
लड़के रोते नहीं और मर्दानगी दिखाओ। औरतों का काम घर संभालना है।
```

### Mixed Language
```
The CEO said that मर्दानगी दिखाओ and women should focus on nurturing roles.
```

---

## 📝 Quick Checks

### Verify Python Version
```bash
python --version
# Should be 3.8 or higher
```

### Verify Node Version
```bash
node --version
# Should be 16 or higher
```

### Check Backend Running
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy",...}
```

### Check Frontend Running
```bash
curl http://localhost:3000
# Should return HTML
```

---

## 🎯 Development Commands

### Backend Development
```bash
# Run with auto-reload
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm start
# Auto-opens browser and hot-reloads on changes
```

### Run Tests
```bash
# Backend tests
python test_backend.py

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 📦 Build Commands

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Run Production Build
```bash
# Serve the build folder
npx serve -s build -l 3000
```

---

## 🔍 Debugging Commands

### Check Backend Logs
```bash
# Backend logs appear in Terminal 1
# Look for errors starting with ❌
```

### Check Frontend Logs
```bash
# Frontend logs appear in Terminal 2
# Also check browser console (F12)
```

### Test Individual Components
```bash
# Test EnhancedBiasDetector
python -c "from services.ai_engine.enhanced_bias_detector import EnhancedBiasDetector; d = EnhancedBiasDetector(); print('✅ Working')"

# Test MockAIService
python -c "from services.ai_engine.mock_ai_service import MockAIService; s = MockAIService(); print('✅ Working')"
```

---

## 💾 Data Commands

### View Audit Logs
```bash
# List all audit logs
ls -la data/audit_logs/

# View specific log
cat data/audit_logs/<analysis_id>.json
```

### Clear Audit Logs
```bash
rm -rf data/audit_logs/*.json
```

---

## 🚀 Quick Start (Copy-Paste)

```bash
# Terminal 1 - Backend
python backend/main.py

# Terminal 2 - Frontend (in new terminal)
cd frontend && npm start

# Browser will open to http://localhost:3000
```

---

**That's it! Your system should now be running.** ✅
