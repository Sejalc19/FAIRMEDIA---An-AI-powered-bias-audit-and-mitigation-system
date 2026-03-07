import { getAnalyses } from '../utils/analysisStorage'

function FairRanking() {
  const analyses = getAnalyses()

  // Original ranking: highest overall score first (bias-agnostic relevance proxy)
  const beforeRanking = analyses
    .map((a, index) => ({
      rank: index + 1,
      title: a.content.slice(0, 60) || 'Content',
      score: 1 - a.bias_score, // treat lower bias as slightly better content score
      biasScore: a.bias_score,
      id: a.id,
    }))
    .sort((a, b) => b.score - a.score)

  // After re-weighting: prioritize lower bias_score while still respecting original order
  const afterRanking = beforeRanking
    .map((item, index) => ({ ...item, originalIndex: index }))
    .sort((a, b) => {
      if (a.biasScore === b.biasScore) {
        return a.originalIndex - b.originalIndex
      }
      return a.biasScore - b.biasScore
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      change: item.originalIndex - index,
    }))

  const getRankChangeIcon = (change) => {
    if (change > 0) return <span className="text-green-600">↑ {change}</span>
    if (change < 0) return <span className="text-red-600">↓ {Math.abs(change)}</span>
    return <span className="text-gray-400">—</span>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fair Ranking Output</h1>
          <p className="text-gray-600 mt-1">Before vs After Smart Re-weighting Comparison</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Articles Re-ranked</p>
            <p className="text-2xl font-bold text-blue-600">{afterRanking.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Biased Down-ranked</p>
            <p className="text-2xl font-bold text-red-600">
              {afterRanking.filter((item) => item.change < 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Fair Boosted</p>
            <p className="text-2xl font-bold text-green-600">
              {afterRanking.filter((item) => item.change > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Avg Bias Reduction</p>
            <p className="text-2xl font-bold text-purple-600">
              {beforeRanking.length
                ? `${Math.round(
                    ((beforeRanking.reduce((sum, i) => sum + i.biasScore, 0) -
                      afterRanking.reduce((sum, i) => sum + i.biasScore, 0)) /
                      beforeRanking.length) *
                      100
                  )}%`
                : '0%'}
            </p>
          </div>
        </div>

        {/* Side by Side Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">❌ Before Re-weighting</h2>
              <p className="text-sm text-gray-600">Original ranking with bias</p>
            </div>
            <div className="p-4">
              {beforeRanking.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {item.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">Score: {item.score}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.biasScore > 0.6 ? 'bg-red-100 text-red-700' :
                    item.biasScore > 0.3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.biasScore.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">✅ After Re-weighting</h2>
              <p className="text-sm text-gray-600">Fair ranking applied</p>
            </div>
            <div className="p-4">
              {afterRanking.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {item.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">Score: {item.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.biasScore > 0.6 ? 'bg-red-100 text-red-700' :
                      item.biasScore > 0.3 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.biasScore.toFixed(2)}
                    </div>
                    <div className="text-sm font-semibold">
                      {getRankChangeIcon(item.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 How Smart Re-weighting Works</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-2">1. Bias Detection</p>
              <p className="text-gray-600">AI identifies biased content using NLP and pattern matching</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">2. Weight Adjustment</p>
              <p className="text-gray-600">Biased articles get reduced weights, fair content boosted</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">3. Fair Ranking</p>
              <p className="text-gray-600">New ranking promotes fairness without deleting content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FairRanking
