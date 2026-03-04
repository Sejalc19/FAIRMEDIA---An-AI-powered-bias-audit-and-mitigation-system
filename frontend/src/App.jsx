import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import BiasAnalysis from './pages/BiasAnalysis'
import Dashboard from './pages/Dashboard'
import FairnessMetrics from './pages/FairnessMetrics'

function App() {
  const [currentPage, setCurrentPage] = useState('bias-analysis')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'bias-analysis':
        return <BiasAnalysis />
      case 'fairness-metrics':
        return <FairnessMetrics />
      default:
        return <BiasAnalysis />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 ml-72 min-h-screen">
        <Header />
        {renderPage()}
      </main>
    </div>
  )
}

export default App
