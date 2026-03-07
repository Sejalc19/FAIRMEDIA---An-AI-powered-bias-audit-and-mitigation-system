import { getAnalyses, updateAnalysis } from '../utils/analysisStorage'

function HumanReview() {
  const analyses = getAnalyses()
  const pendingArticles = analyses.filter(
    (a) => !a.reviewed && a.bias_score > 0.4
  )

  const handleDecision = (articleId, decision) => {
    if (decision === 'approve') {
      updateAnalysis(articleId, { reviewed: true })
      alert(`Article ${articleId} approved and marked as reviewed.`)
    } else if (decision === 'edit') {
      updateAnalysis(articleId, { mitigated: true })
      alert(`Article ${articleId} marked as mitigated. Please ensure edits are applied.`)
    } else if (decision === 'override') {
      updateAnalysis(articleId, { reviewed: true, mitigated: false })
      alert(`AI recommendation overridden for article ${articleId}.`)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Human Review</h1>
          <p className="text-gray-600 mt-1">Human-in-the-Loop oversight and approval</p>
        </div>

        {/* Warning Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="text-red-800 font-semibold">
                {pendingArticles.length} articles need your attention
              </p>
              <p className="text-red-700 text-sm mt-1">
                These articles have been flagged by AI and require human review before deployment
              </p>
            </div>
          </div>
        </div>

        {/* Pending Articles */}
        <div className="space-y-6">
          {pendingArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Article ID: {article.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-600">{article.biasScore.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Bias Score</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* AI Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 AI Summary</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {article.summary}
                    </p>
                  </div>

                  {/* XAI Reasoning */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🧠 XAI Reasoning</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                      {article.aiReasoning}
                    </p>
                  </div>
                </div>

                {/* Suggested Re-ranking */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">⚖️ Suggested Re-ranking</h4>
                  <p className="text-sm text-gray-700 mb-3">{article.suggestedRanking}</p>
                  <p className="text-sm text-gray-700">
                    Risk level: <span className="font-semibold">{article.risk_level}</span> •
                    Bias score: <span className="font-semibold">{article.bias_score.toFixed(2)}</span>
                  </p>
                </div>

                {/* Decision Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(article.id, 'approve')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    ✅ Approve & Deploy
                  </button>
                  <button
                    onClick={() => handleDecision(article.id, 'edit')}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit Suggestion
                  </button>
                  <button
                    onClick={() => handleDecision(article.id, 'override')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    🚫 Override AI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats can be derived in future from audit logs; omitted here to avoid static dummy numbers */}
      </div>
    </div>
  )
}

export default HumanReview
