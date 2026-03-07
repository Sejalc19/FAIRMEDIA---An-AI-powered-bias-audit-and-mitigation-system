# 🚀 FAIRMEDIA - Quick Start Guide

## Get Up and Running in 5 Minutes!

---

## Step 1: Install Backend Dependencies (1 min)

```bash
pip install -r requirements.txt
```

---

## Step 2: Install Frontend Dependencies (2 min)

```bash
cd frontend
npm install
cd ..
```

---

## Step 3: Start Backend (30 sec)

Open **Terminal 1**:
```bash
python backend/main.py
```

You should see:
```
🚀 FAIRMEDIA Backend starting up...
🌐 API running at: http://0.0.0.0:8000
```

✅ Backend is running at **http://localhost:8000**

---

## Step 4: Start Frontend (30 sec)

Open **Terminal 2**:
```bash
cd frontend
npm start
```

Browser will automatically open to **http://localhost:3000**

---

## Step 5: Test the System (1 min)

1. **Dashboard** opens automatically
   - See stats, charts, and live activity

2. Click **🔍 Content Analyzer**
   - Paste this text:
     ```
     The CEO announced that his company will hire more female engineers to improve diversity.
     ```
   - Click "Start Analysis"
   - Watch the 7-step pipeline in action!

3. View results:
   - Bias scores
   - Highlighted text
   - XAI explanations

---

## 🎯 What You'll See

### Dashboard
- 📊 4 stat cards with metrics
- 📈 Bias distribution chart
- 🌐 Language coverage (EN, HI, MR, TA, BN)
- ⏱️ Live activity timeline

### Content Analyzer
- Step 1: Input text
- Step 2: Preprocessing stats
- Step 3: Bias detection with highlights
- Step 4: XAI score with explanations

### Other Pages
- **Bias Scores**: Sortable table of all analyses
- **Human Review**: Approve/reject flagged content
- **Fair Ranking**: Before/after comparison
- **Audit Reports**: Fairness metrics & exports
- **Settings**: Configure models & thresholds

---

## 🔗 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check Python version (need 3.9+)
python --version

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start?
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port already in use?
```bash
# Backend: Edit .env and change API_PORT
# Frontend: Press 'Y' when asked to use different port
```

---

## ✅ You're Ready!

Your complete AI bias detection system is now running with:
- ✅ Professional dashboard
- ✅ 7-step analysis pipeline
- ✅ Human review workflow
- ✅ Fair ranking system
- ✅ Audit reports
- ✅ Full configuration

**Enjoy your FAIRMEDIA system!** 🎉

---

## 📚 Next Steps

- Read `FRONTEND_COMPLETE_GUIDE.md` for detailed features
- Check `README.md` for full documentation
- See `COMPLETION_CHECKLIST.md` for implementation details
- Review `infra/deployment_steps.md` for production deployment

---

**Need help?** Check the error messages in terminals or review the documentation files.
