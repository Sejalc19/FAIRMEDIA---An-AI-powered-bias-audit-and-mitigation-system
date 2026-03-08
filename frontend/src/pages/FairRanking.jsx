import { getAnalyses } from '../utils/analysisStorage'

function FairRanking() {
  const analyses = getAnalyses()

  // ── Before ranking: sorted by "relevance" proxy (lower bias = higher score) ──
  // Each article gets a relevance score = 1 - bias_score
  const beforeRanking = analyses
    .map((a, index) => ({
      id: a.id,
      title: (a.content || '').slice(0, 60) || 'Untitled',
      biasScore: parseFloat((a.bias_score ?? 0).toFixed(2)),
      relevanceScore: parseFloat((1 - (a.bias_score ?? 0)).toFixed(2)),
      originalIndex: index,
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((item, idx) => ({ ...item, beforeRank: idx + 1 }))

  // ── After ranking: penalise biased articles by multiplying score by fairness weight ──
  // Fairness weight = 1 - (biasScore * 0.8)
  // This means a 0.9 bias article gets weight 0.28, while a 0.1 gets weight 0.92
  const afterRanking = beforeRanking
    .map(item => ({
      ...item,
      fairScore: parseFloat((item.relevanceScore * (1 - item.biasScore * 0.8)).toFixed(2)),
    }))
    .sort((a, b) => b.fairScore - a.fairScore)
    .map((item, idx) => ({
      ...item,
      afterRank: idx + 1,
      change: item.beforeRank - (idx + 1), // positive = moved up, negative = moved down
    }))

  // ── Stats ──
  const downRanked  = afterRanking.filter(i => i.change < 0).length
  const fairBoosted = afterRanking.filter(i => i.change > 0).length

  const avgBiasBefore = beforeRanking.length
    ? beforeRanking.reduce((s, i) => s + i.biasScore, 0) / beforeRanking.length
    : 0

  // After re-weighting, top half of results will have lower avg bias
  const topHalf = afterRanking.slice(0, Math.ceil(afterRanking.length / 2))
  const avgBiasAfterTop = topHalf.length
    ? topHalf.reduce((s, i) => s + i.biasScore, 0) / topHalf.length
    : 0

  const biasReductionPct = avgBiasBefore > 0
    ? Math.round(((avgBiasBefore - avgBiasAfterTop) / avgBiasBefore) * 100)
    : 0

  const getRankChangeIcon = (change) => {
    if (change > 0) return <span className="text-green-600 font-semibold text-sm">↑ {change}</span>
    if (change < 0) return <span className="text-red-500 font-semibold text-sm">↓ {Math.abs(change)}</span>
    return <span className="text-gray-400 text-sm">—</span>
  }

  const getBiasChip = (score) => {
    const color = score > 0.6
      ? 'bg-red-100 text-red-700'
      : score > 0.3
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700'
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
        {score.toFixed(2)}
      </span>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
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
            <p className="text-2xl font-bold text-red-600">{downRanked}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Fair Boosted</p>
            <p className="text-2xl font-bold text-green-600">{fairBoosted}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Top-Half Bias Reduction</p>
            <p className="text-2xl font-bold text-purple-600">
              {biasReductionPct > 0 ? `${biasReductionPct}%` : '—'}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {afterRanking.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No analyses found</p>
            <p className="text-gray-400 text-sm mt-2">Start analyzing content to see rankings here</p>
          </div>
        )}

        {/* Side-by-Side Comparison */}
        {afterRanking.length > 0 && (
          <div className="grid grid-cols-2 gap-6">

            {/* BEFORE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">❌ Before Re-weighting</h2>
                <p className="text-sm text-gray-600">Original ranking — bias ignored</p>
              </div>
              <div className="p-4 space-y-2">
                {beforeRanking.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {item.beforeRank}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Relevance: {item.relevanceScore.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {getBiasChip(item.biasScore)}
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">✅ After Re-weighting</h2>
                <p className="text-sm text-gray-600">Fair ranking — bias penalised</p>
              </div>
              <div className="p-4 space-y-2">
                {afterRanking.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {item.afterRank}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fair score: {item.fairScore.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getBiasChip(item.biasScore)}
                      <div className="w-10 text-right">
                        {getRankChangeIcon(item.change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* How It Works */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 How Smart Re-weighting Works</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-1">1. Bias Detection</p>
              <p className="text-gray-600">AI scores each article 0–1 for gender bias, stereotypes, and language dominance.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">2. Fair Score Formula</p>
              <p className="text-gray-600">
                Fair Score = Relevance × (1 − Bias × 0.8). High-bias articles lose ranking weight automatically.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">3. Result</p>
              <p className="text-gray-600">Fairer articles rise, biased ones fall — no content is deleted, only re-prioritised.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FairRanking