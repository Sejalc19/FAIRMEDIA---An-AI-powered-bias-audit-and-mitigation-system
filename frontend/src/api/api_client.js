const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

export const analyzeText = async (text, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error analyzing text:', error)
    throw error
  }
}

export const getFairnessMetrics = async (textId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fairness/${textId}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching fairness metrics:', error)
    throw error
  }
}
