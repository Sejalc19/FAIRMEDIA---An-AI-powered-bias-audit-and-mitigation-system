import { useState, useEffect } from 'react'
import { getStats, getAnalyses } from '../utils/analysisStorage'

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    total: 0,
    biasDetected: 0,
    mitigated: 0,
    pendingReviews: 0
  })
  const [recentAnalyses, setRecentAnalyses] = useState([])

  useEffect(() => {
    loadDashboardData()
    // Refresh every 5 seconds
    const interval = setInterval(loadDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = () => {
    const statsData = getStats()
    setStats({
      total: statsData.total,
      biasDetected: statsData.biasDetected,
      mitigated: statsData.mitigated,
      pendingReviews: statsData.pendingReviews
    })

    const analyses = getAnalyses()
    setRecentAnalyses(analyses.slice(-5).reverse())
  }

  const getStatusIcon = (analysis) => {
    if (analysis.reviewed) return '✅'
    if (analysis.mitigated) return '⚡'
    if (analysis.bias_score > 0.7) return '🔴'
    if (analysis.bias_score > 0.4) return '🟡'
    return '🟢'
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time bias detection and fairness monitoring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Articles Analyzed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-blue-600 mt-2">Total analyses</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bias Detected</p>
                <p className="text-3xl font-bold text-orange-600">{stats.biasDetected}</p>
                <p className="text-xs text-orange-600 mt-2">Score &gt; 0.4</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">After Mitigation</p>
                <p className="text-3xl font-bold text-green-600">{stats.mitigated}</p>
                <p className="text-xs text-green-600 mt-2">Successfully mitigated</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pendingReviews}</p>
                <p className="text-xs text-purple-600 mt-2">Awaiting review</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
          {recentAnalyses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No analyses yet</p>
              <p className="text-sm mt-2">Start analyzing content to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getStatusIcon(analysis)}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {analysis.bias_type.replace('_', ' ')} detected
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {analysis.bias_score.toFixed(2)} • {analysis.language.toUpperCase()} • {analysis.risk_level} risk
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">🔍 Analyze Content</h3>
            <p className="text-blue-100 text-sm mb-4">Start analyzing new content for bias detection</p>
            <button
              onClick={() => onNavigate && onNavigate('analyzer')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
            >
              Go to Analyzer
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">📊 View Scores</h3>
            <p className="text-green-100 text-sm mb-4">Review all bias scores and export data</p>
            <button
              onClick={() => onNavigate && onNavigate('bias-scores')}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50"
            >
              View Scores
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">👤 Human Review</h3>
            <p className="text-purple-100 text-sm mb-4">Review and approve flagged content</p>
            <button
              onClick={() => onNavigate && onNavigate('human-review')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50"
            >
              Review Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
