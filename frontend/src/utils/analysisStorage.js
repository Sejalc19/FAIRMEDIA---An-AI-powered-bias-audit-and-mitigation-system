/**
 * Analysis Storage Utility
 * Manages analysis data in localStorage
 */

const STORAGE_KEY = 'fairmedia_analyses'

export const saveAnalysis = (analysis) => {
  const analyses = getAnalyses()
  const newAnalysis = {
    id: analysis.analysis_id,
    timestamp: analysis.timestamp || new Date().toISOString(),
    content: analysis.content || '',
    bias_score: analysis.bias_detection?.bias_scores?.overall || 0,
    language: analysis.bias_detection?.language_detected || 'en',
    bias_type: getBiasType(analysis.bias_detection?.bias_scores),
    mitigated: false,
    reviewed: false,
    risk_level: analysis.fairness_metrics?.risk_level || 'low',
    highlighted_text: analysis.bias_detection?.highlighted_text || [],
    recommendations: analysis.fairness_metrics?.recommendations || []
  }
  
  analyses.push(newAnalysis)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
  return newAnalysis
}

export const getAnalyses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading analyses:', error)
    return []
  }
}

export const getAnalysisById = (id) => {
  const analyses = getAnalyses()
  return analyses.find(a => a.id === id)
}

export const updateAnalysis = (id, updates) => {
  const analyses = getAnalyses()
  const index = analyses.findIndex(a => a.id === id)
  if (index !== -1) {
    analyses[index] = { ...analyses[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
    return analyses[index]
  }
  return null
}

export const deleteAnalysis = (id) => {
  const analyses = getAnalyses()
  const filtered = analyses.filter(a => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export const clearAllAnalyses = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getStats = () => {
  const analyses = getAnalyses()
  return {
    total: analyses.length,
    biasDetected: analyses.filter(a => a.bias_score > 0.4).length,
    mitigated: analyses.filter(a => a.mitigated).length,
    pendingReviews: analyses.filter(a => !a.reviewed && a.bias_score > 0.4).length,
    byLanguage: analyses.reduce((acc, a) => {
      acc[a.language] = (acc[a.language] || 0) + 1
      return acc
    }, {}),
    byBiasType: analyses.reduce((acc, a) => {
      acc[a.bias_type] = (acc[a.bias_type] || 0) + 1
      return acc
    }, {})
  }
}

export const exportToCSV = (analyses = null) => {
  const data = analyses || getAnalyses()
  
  const headers = ['ID', 'Timestamp', 'Language', 'Bias Score', 'Bias Type', 'Risk Level', 'Mitigated', 'Reviewed']
  const rows = data.map(a => [
    a.id,
    new Date(a.timestamp).toLocaleString(),
    a.language.toUpperCase(),
    a.bias_score.toFixed(2),
    a.bias_type,
    a.risk_level,
    a.mitigated ? 'Yes' : 'No',
    a.reviewed ? 'Yes' : 'No'
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fairmedia-analyses-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (analyses = null) => {
  const data = analyses || getAnalyses()
  const json = JSON.stringify(data, null, 2)
  
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fairmedia-analyses-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const getBiasType = (biasScores) => {
  if (!biasScores) return 'unknown'
  
  const scores = {
    gender_bias: biasScores.gender_bias || 0,
    stereotype: biasScores.stereotype || 0,
    language_dominance: biasScores.language_dominance || 0
  }
  
  const maxType = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  return maxType
}
