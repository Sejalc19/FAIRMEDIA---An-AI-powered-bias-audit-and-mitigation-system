import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ContentAnalyzer from './pages/ContentAnalyzer'
import BiasScores from './pages/BiasScores'
import HumanReview from './pages/HumanReview'
import FairRanking from './pages/FairRanking'
import AuditReports from './pages/AuditReports'
import Settings from './pages/Settings'

function App() {
  // Centralized SPA navigation state
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'analyzer':
        return <ContentAnalyzer />
      case 'bias-scores':
        return <BiasScores />
      case 'human-review':
        return <HumanReview />
      case 'fair-ranking':
        return <FairRanking />
      case 'audit-reports':
        return <AuditReports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        pendingReviews={0}
      />
      <main className="flex-1 ml-64">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
