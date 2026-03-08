import { useState } from 'react'
import { getAnalyses, updateAnalysis } from '../utils/analysisStorage'

// ── Same bias replacement dictionary as ContentAnalyzer ───────────────────
const BIAS_REPLACEMENTS = {
  "women belong in the kitchen": "people can work in any field",
  "women belong in supportive positions": "people can work in any role",
  "men are the natural leaders": "people of all genders can lead",
  "men are natural leaders": "people of all genders can lead",
  "natural leaders": "capable leaders",
  "natural leader": "capable leader",
  "boys will be boys": "children should be held to equal standards",
  "boys don't cry": "it's okay to express emotions",
  "man of the house": "head of household",
  "man up": "be courageous",
  "be a man": "be strong",
  "man's job": "anyone's job",
  "woman's place": "anyone's place",
  "like a girl": "with effort",
  "weaker sex": "all people",
  "lady doctor": "doctor",
  "lady engineer": "engineer",
  "lady scientist": "scientist",
  "lady lawyer": "lawyer",
  "male nurse": "nurse",
  "working mother": "working parent",
  "career woman": "professional",
  "old maid": "unmarried person",
  "men are better at": "individuals vary in their abilities with",
  "women are too emotional": "all people experience emotions",
  "men are naturally": "individuals can be naturally",
  "women are naturally": "individuals can be naturally",
  "girls should": "all people should",
  "real men": "people",
  "crumble under stress": "struggle under pressure",
  "built for high-pressure": "suited for demanding",
  "supportive positions": "various roles",
  "breadwinners": "providers",
  "breadwinner": "provider",
  "male-dominated": "historically skewed",
  "naturally suited to": "well-matched for",
  "chairman": "chairperson",
  "fireman": "firefighter",
  "policeman": "police officer",
  "businessman": "businessperson",
  "spokesman": "spokesperson",
  "spokeswoman": "spokesperson",
  "mailman": "mail carrier",
  "cameraman": "camera operator",
  "salesman": "salesperson",
  "foreman": "supervisor",
  "mankind": "humankind",
  "manpower": "workforce",
  "housewife": "homemaker",
  "tomboy": "active child",
  "emotional": "expressive",
  "hysterical": "upset",
  "nurturing": "caring",
  "ditzy": "thoughtful",
  "nagging": "persistent",
  "catfight": "disagreement",
  "aggressive": "assertive",
  "dominant": "leading",
  "stubborn": "persistent",
  "bossy": "decisive",
  "औरतों का काम": "घर का काम",
  "मर्दानगी": "साहस",
  "पराया धन": "बेटी",
  "पति परमेश्वर": "जीवन साथी",
  "कमजोर लिंग": "व्यक्ति",
  "अबला नारी": "महिला",
  "लड़के रोते नहीं": "भावनाएं स्वाभाविक हैं",
  "मर्द को दर्द नहीं होता": "सभी को दर्द होता है",
}

const generateAlternative = (text) => {
  if (!text) return text
  let result = text
  const sorted = Object.keys(BIAS_REPLACEMENTS).sort((a, b) => b.length - a.length)
  sorted.forEach(phrase => {
    const rep = BIAS_REPLACEMENTS[phrase]
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    result = result.replace(regex, (match) => {
      if (match === match.toUpperCase()) return rep.toUpperCase()
      if (match[0] === match[0].toUpperCase()) return rep[0].toUpperCase() + rep.slice(1)
      return rep
    })
  })
  return result
}

function HumanReview() {
  const [analyses, setAnalyses] = useState(() => getAnalyses())
  const [editModal, setEditModal] = useState(null)
  // editModal shape: { articleId, originalText, editedText }

  const pendingArticles = analyses.filter(
    (a) => !a.reviewed && (a.bias_score ?? 0) > 0.4
  )

  const handleDecision = (articleId, decision) => {
    if (decision === 'approve') {
      updateAnalysis(articleId, { reviewed: true })
      alert('Article approved and marked as reviewed.')
      setAnalyses(getAnalyses())
    } else if (decision === 'edit') {
      const article = analyses.find(a => a.id === articleId)
      const original = article?.content || ''
      const suggested = generateAlternative(original)
      setEditModal({ articleId, originalText: original, editedText: suggested })
    } else if (decision === 'override') {
      updateAnalysis(articleId, { reviewed: true, mitigated: false })
      alert('AI recommendation overridden.')
      setAnalyses(getAnalyses())
    }
  }

  const handleSaveEdit = () => {
    if (!editModal) return
    updateAnalysis(editModal.articleId, {
      mitigated: true,
      reviewed: true,
      mitigated_content: editModal.editedText
    })
    setEditModal(null)
    setAnalyses(getAnalyses())
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getAISummary = (article) => {
    const explanations = article.bias_detection?.explanations
    if (!explanations) return 'No AI summary available for this article.'
    const parts = []
    if (explanations.gender_bias)        parts.push(explanations.gender_bias)
    if (explanations.stereotype)         parts.push(explanations.stereotype)
    if (explanations.language_dominance) parts.push(explanations.language_dominance)
    return parts.join(' ') || 'No AI summary available.'
  }

  const getXAIReasoning = (article) => {
    const spans = article.bias_detection?.highlighted_text
    if (!spans || spans.length === 0) return 'No biased terms were detected in this article.'
    const termList = spans
      .map(s => `"${s.text}" (${(s.bias_type || 'bias').replace(/_/g, ' ')})${s.suggestion ? ` → "${s.suggestion}"` : ''}`)
      .join(', ')
    return `Detected ${spans.length} biased term(s): ${termList}.`
  }

  const getSuggestedRanking = (article) => {
    const score = article.bias_score ?? 0
    if (score > 0.7) return `Score ${score.toFixed(2)} — high bias. Recommended: down-rank significantly or hold for editorial review before publishing.`
    if (score > 0.4) return `Score ${score.toFixed(2)} — moderate bias. Recommended: apply suggested rewrites and re-rank below lower-bias content on the same topic.`
    return `Score ${score.toFixed(2)} — within acceptable range. Minor edits recommended before publishing.`
  }

  const getContentPreview = (article) => {
    const text = article.content || ''
    return text.length > 120 ? text.slice(0, 120) + '…' : text
  }

  const getBiasColor = (score) => {
    if (score > 0.7) return 'text-red-600'
    if (score > 0.4) return 'text-orange-500'
    return 'text-green-600'
  }

  const getRiskBadge = (level) => {
    const map = {
      high:     'bg-red-100 text-red-800',
      medium:   'bg-yellow-100 text-yellow-800',
      low:      'bg-green-100 text-green-800',
      critical: 'bg-red-200 text-red-900',
    }
    return map[(level || '').toLowerCase()] || 'bg-gray-100 text-gray-700'
  }

  const getChangeSummary = (original, edited) => {
    if (!original || !edited) return []
    const origWords = original.split(/\s+/)
    const editWords = edited.split(/\s+/)
    const changes = []
    const maxLen = Math.max(origWords.length, editWords.length)
    for (let i = 0; i < maxLen; i++) {
      if (origWords[i] !== editWords[i] && origWords[i] && editWords[i]) {
        changes.push({ from: origWords[i], to: editWords[i] })
      }
    }
    return changes.slice(0, 8)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Human Review</h1>
          <p className="text-gray-600 mt-1">Human-in-the-Loop oversight and approval</p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="text-red-800 font-semibold">
                {pendingArticles.length} article{pendingArticles.length !== 1 ? 's' : ''} need your attention
              </p>
              <p className="text-red-700 text-sm mt-1">
                Flagged by AI — require human review before deployment
              </p>
            </div>
          </div>
        </div>

        {pendingArticles.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-gray-700 text-lg font-medium">All caught up!</p>
            <p className="text-gray-500 text-sm mt-2">No articles are currently pending review.</p>
          </div>
        )}

        <div className="space-y-6">
          {pendingArticles.map((article) => {
            const biasScore = article.bias_score ?? 0
            const spans     = article.bias_detection?.highlighted_text ?? []

            return (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {getContentPreview(article)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>ID: {article.id}</span>
                        <span>•</span>
                        <span>{new Date(article.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span className={`font-semibold px-2 py-0.5 rounded text-xs ${getRiskBadge(article.risk_level)}`}>
                          {article.risk_level || 'unknown'} risk
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-3xl font-bold ${getBiasColor(biasScore)}`}>
                        {biasScore.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Bias Score</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 AI Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed">
                        {getAISummary(article)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">🧠 XAI Reasoning</h4>
                      <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg leading-relaxed">
                        {getXAIReasoning(article)}
                      </p>
                    </div>
                  </div>

                  {article.bias_detection?.bias_scores && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 Bias Breakdown</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(article.bias_detection.bias_scores)
                          .filter(([k]) => k !== 'overall')
                          .map(([key, val]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                              <p className={`text-xl font-bold ${getBiasColor(val)}`}>{(val ?? 0).toFixed(2)}</p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                  className={`h-1.5 rounded-full ${val > 0.7 ? 'bg-red-500' : val > 0.4 ? 'bg-orange-400' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min((val ?? 0) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {spans.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">🔍 Detected Biased Terms</h4>
                      <div className="flex flex-wrap gap-2">
                        {spans.map((span, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">
                            {span.text}
                            {span.suggestion && <span className="text-green-700"> → {span.suggestion}</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">⚖️ Suggested Re-ranking</h4>
                    <p className="text-sm text-gray-700">{getSuggestedRanking(article)}</p>
                  </div>

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
            )
          })}
        </div>
      </div>

      {/* ── Edit Suggestion Modal ──────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">✏️ Edit Suggested Alternative</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  AI has auto-applied bias-free replacements. Edit further before saving.
                </p>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none pb-1"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Original */}
                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-2">🔴 Original (Biased)</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg h-52 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {editModal.originalText}
                    </p>
                  </div>
                </div>

                {/* Editable */}
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-2">🟢 Bias-Free Alternative (Editable)</h3>
                  <textarea
                    className="w-full p-4 bg-green-50 border-2 border-green-300 rounded-lg h-52 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:border-green-500"
                    value={editModal.editedText}
                    onChange={(e) => setEditModal(prev => ({ ...prev, editedText: e.target.value }))}
                  />
                </div>
              </div>

              {/* Change Summary */}
              {(() => {
                const changes = getChangeSummary(editModal.originalText, editModal.editedText)
                return changes.length > 0 ? (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Changes Made</h4>
                    <div className="flex flex-wrap gap-2">
                      {changes.map((c, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs">
                          <span className="text-red-500 line-through">{c.from}</span>
                          <span className="mx-1 text-gray-400">→</span>
                          <span className="text-green-600 font-medium">{c.to}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              })()}

              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  💾 Save & Mark as Mitigated
                </button>
                <button
                  onClick={() => setEditModal(prev => ({
                    ...prev,
                    editedText: generateAlternative(prev.originalText)
                  }))}
                  className="px-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  🔄 Reset to AI Suggestion
                </button>
                <button
                  onClick={() => setEditModal(null)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HumanReview