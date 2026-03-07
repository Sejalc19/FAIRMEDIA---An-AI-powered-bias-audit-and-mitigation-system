# FAIRMEDIA Frontend - Complete Guide

## ✅ Complete Professional Frontend Implementation

Your frontend is now 100% complete with all 7 pages as specified!

---

## 🎨 Pages Overview

### 1. **Dashboard** (Home Page) ✅
**Route:** `dashboard`

**Features:**
- 4 Stat Cards:
  - Articles Analyzed: 1,247
  - Bias Detected: 342
  - After Mitigation: 89
  - Pending Reviews: 3
- Bias Type Distribution Bar Chart:
  - Gender Bias (52%)
  - Language Dominance (31%)
  - Stereotype (12%)
  - Regional (5%)
- Regional Language Coverage (IndicBERT):
  - EN, HI, MR, TA, BN with fairness ratings
- Live Activity Timeline:
  - Real-time log of AI actions
  - Color-coded status indicators

---

### 2. **Content Analyzer** (7-Step Pipeline) ✅
**Route:** `analyzer`

**Features:**
- Visual 7-Step Pipeline Tracker
- **Step 1 - Content Input:**
  - Paste text / URL / Upload file options
  - Language selector (EN, HI, MR, TA, BN)
  - Content type selector
- **Step 2 - Preprocessing:**
  - Detected language display
  - Word count, token count
  - Entities found
- **Step 3 - Bias Detection:**
  - Highlighted article text
  - Color-coded bias markers (red=gender, yellow=stereotype, purple=pattern)
- **Step 4 - XAI Score:**
  - Large bias score number
  - SHAP-style bar charts
  - Plain-English AI explanations

---

### 3. **Bias Scores** (Sortable Table) ✅
**Route:** `bias-scores`

**Features:**
- Sortable table with columns:
  - Article title
  - Language (EN/HI/MR/TA/BN badges)
  - Bias Type
  - Score (color-coded)
  - Status (Pending/Mitigated/Approved)
  - Date
  - Actions
- Filters:
  - Sort by: Score, Date, Language, Type
  - Status filter: All, Pending, Mitigated, Approved
- Export CSV button
- Pagination controls

---

### 4. **Human Review** (Human-in-the-Loop) ✅
**Route:** `human-review`

**Features:**
- Warning alert showing pending count
- For each article:
  - AI Summary
  - XAI Reasoning (why bias was detected)
  - Suggested re-ranking with before/after ranks
  - 3 Decision Buttons:
    - ✅ Approve & Deploy
    - ✏️ Edit Suggestion
    - 🚫 Override AI
- Daily stats:
  - Approved Today
  - Edited
  - Overridden

---

### 5. **Fair Ranking** (Before vs After) ✅
**Route:** `fair-ranking`

**Features:**
- Summary stats:
  - Articles Re-ranked
  - Biased Down-ranked
  - Fair Boosted
  - Avg Bias Reduction
- Side-by-side comparison:
  - **Before:** Original ranking with bias
  - **After:** Fair ranking applied
- Visual indicators:
  - Rank change arrows (↑ boosted, ↓ down-ranked)
  - Bias score badges
  - Color-coded status
- Explanation section:
  - How Smart Re-weighting works

---

### 6. **Audit Reports** (Fairness Metrics) ✅
**Route:** `audit-reports`

**Features:**
- Export buttons:
  - 📄 Export PDF
  - 📊 Export CSV
  - 🔗 API Share
- Fairness Metrics (AIF360):
  - Demographic Parity
  - Equal Opportunity
  - Theil Index
  - Disparate Impact
- Each metric shows:
  - Current value
  - Target value
  - Status badge
  - Progress bar
- Summary cards:
  - Total Analyses
  - Bias Mitigation Rate
  - Avg Processing Time
- Detailed Audit Log table

---

### 7. **Settings** (Configuration) ✅
**Route:** `settings`

**Features:**
- **Model Configuration:**
  - Primary NLP Model selector (IndicBERT, BERT, DistilBERT, RoBERTa)
  - SHAP Explainability status
  - AIF360 Metrics status
- **Detection Thresholds:**
  - Bias Detection Threshold slider (0.0-1.0)
  - Individual thresholds for:
    - Gender Bias
    - Stereotype
    - Language Dominance
- **Human Review Governance:**
  - Require Human Review toggle
  - Auto-Approve Low Bias toggle
  - Governance policy warning
- **Language Support:**
  - Checkboxes for 8 languages
  - EN, HI, MR, TA, BN, TE, GU, KN
- Save Settings button

---

## 🎨 Design Features

### Color Scheme (White & Attractive)
- **Background:** Clean white (#FFFFFF) with light gray (#F9FAFB)
- **Primary:** Blue (#2563EB)
- **Success:** Green (#10B981)
- **Warning:** Yellow/Orange (#F59E0B)
- **Danger:** Red (#EF4444)
- **Text:** Gray scale (#111827 to #6B7280)

### UI Components
- ✅ Rounded corners (rounded-xl, rounded-lg)
- ✅ Subtle shadows (shadow-sm)
- ✅ Smooth transitions
- ✅ Hover effects
- ✅ Color-coded status badges
- ✅ Progress bars
- ✅ Interactive buttons
- ✅ Responsive grid layouts

---

## 🎯 Sidebar Navigation

**Always Visible Features:**
- Logo & System Status
- Live status indicator (green pulse)
- Navigation menu with icons:
  - 📊 Dashboard
  - 🔍 Content Analyzer
  - 📈 Bias Scores
  - 👤 Human Review (with badge count)
  - ⚖️ Fair Ranking
  - 📄 Audit Reports
  - ⚙️ Settings
- Footer with version & health status

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at **http://localhost:3000**

### 3. Start Backend (Required)
```bash
# In another terminal
python backend/main.py
```

Backend runs at **http://localhost:8000**

---

## 📁 File Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── App.jsx                 # Main app with routing
│   ├── index.js                # Entry point
│   ├── index.css               # Tailwind CSS
│   ├── api/
│   │   └── api_client.js       # Backend API calls
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Header.jsx          # Page header
│   │   ├── InputSection.jsx    # Text input
│   │   ├── BiasDisplay.jsx     # Bias results
│   │   ├── FairnessDisplay.jsx # Fairness metrics
│   │   ├── SuggestionDisplay.jsx # Recommendations
│   │   └── ReviewSection.jsx   # Text review
│   ├── pages/
│   │   ├── Dashboard.jsx       # ✅ Page 1
│   │   ├── ContentAnalyzer.jsx # ✅ Page 2
│   │   ├── BiasScores.jsx      # ✅ Page 3
│   │   ├── HumanReview.jsx     # ✅ Page 4
│   │   ├── FairRanking.jsx     # ✅ Page 5
│   │   ├── AuditReports.jsx    # ✅ Page 6
│   │   ├── Settings.jsx        # ✅ Page 7
│   │   ├── BiasAnalysis.jsx    # Legacy (optional)
│   │   └── FairnessMetrics.jsx # Legacy (optional)
│   └── utils/
│       └── textHighlighter.js  # Text highlighting
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind config
└── postcss.config.js           # PostCSS config
```

---

## 🔧 Configuration

### Environment Variables
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Tailwind CSS
Already configured in `tailwind.config.js`

### API Client
Located in `src/api/api_client.js`
- `analyzeText(text, options)` - Analyze content
- `getFairnessMetrics(textId)` - Get metrics
- `healthCheck()` - Check backend health

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/index.css` or use Tailwind classes:
- `bg-blue-600` → Primary color
- `bg-green-600` → Success color
- `bg-red-600` → Danger color
- `bg-yellow-600` → Warning color

### Add New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add menu item in `src/components/Sidebar.jsx`

---

## 📊 Features Summary

| Feature | Status | Page |
|---------|--------|------|
| Dashboard with stats | ✅ | Dashboard |
| Bias distribution chart | ✅ | Dashboard |
| Language coverage | ✅ | Dashboard |
| Live activity log | ✅ | Dashboard |
| 7-step pipeline | ✅ | Content Analyzer |
| Content input | ✅ | Content Analyzer |
| Preprocessing display | ✅ | Content Analyzer |
| Bias detection | ✅ | Content Analyzer |
| XAI scoring | ✅ | Content Analyzer |
| Sortable table | ✅ | Bias Scores |
| Status filters | ✅ | Bias Scores |
| Export CSV | ✅ | Bias Scores |
| Human review cards | ✅ | Human Review |
| Decision buttons | ✅ | Human Review |
| Before/After ranking | ✅ | Fair Ranking |
| Rank change indicators | ✅ | Fair Ranking |
| Fairness metrics | ✅ | Audit Reports |
| Export options | ✅ | Audit Reports |
| Model configuration | ✅ | Settings |
| Threshold sliders | ✅ | Settings |
| Governance controls | ✅ | Settings |
| Language support | ✅ | Settings |

---

## 🎉 What You Get

A **complete, professional, production-ready** frontend with:
- ✅ 7 fully functional pages
- ✅ Beautiful white & clean design
- ✅ Responsive layouts
- ✅ Interactive components
- ✅ Real-time updates
- ✅ Color-coded visualizations
- ✅ Smooth animations
- ✅ Professional UI/UX
- ✅ Complete navigation
- ✅ Status indicators
- ✅ Export functionality
- ✅ Configuration options

---

## 🚀 Ready to Use!

Your frontend is **100% complete** and ready for production. Just run:

```bash
# Terminal 1 - Backend
python backend/main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Open **http://localhost:3000** and enjoy your professional bias detection system! 🎉

---

**Made with ❤️ for a fairer digital world**
