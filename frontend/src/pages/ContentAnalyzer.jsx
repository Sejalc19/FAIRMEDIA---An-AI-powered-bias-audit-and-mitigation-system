import { useState } from 'react'
import { analyzeText } from '../api/api_client'
import { saveAnalysis } from '../utils/analysisStorage'

function ContentAnalyzer() {
  const [currentStep, setCurrentStep] = useState(1)
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('en')
  const [contentType, setContentType] = useState('article')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [preprocessing, setPreprocessing] = useState(null)
  const [alternativeText, setAlternativeText] = useState('')

  const steps = [
    { num: 1, name: 'Content Input', icon: '📝' },
    { num: 2, name: 'Preprocessing', icon: '⚙️' },
    { num: 3, name: 'Bias Detection', icon: '🔍' },
    { num: 4, name: 'XAI Score', icon: '📊' }
  ]

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert('Please enter content to analyze')
      return
    }

    setIsAnalyzing(true)
    setCurrentStep(2)

    try {
      // Show preprocessing step
      const words = content.trim().split(/\s+/)
      const wordCount = words.length
      const tokenCount = Math.floor(wordCount * 1.3)
      
      setPreprocessing({
        detectedLanguage: language,
        wordCount: wordCount,
        tokenCount: tokenCount,
        entitiesFound: extractEntities(content)
      })
      
      // Small delay to show preprocessing
      await new Promise(resolve => setTimeout(resolve, 800))
      setCurrentStep(3)

      // Call backend API
      const result = await analyzeText(content, { language })
      
      // Save analysis to localStorage
      saveAnalysis({ ...result, content })
      
      // Update preprocessing with actual detected language from backend
      if (result.bias_detection?.language_detected) {
        setPreprocessing(prev => ({
          ...prev,
          detectedLanguage: result.bias_detection.language_detected
        }))
      }
      
      // Generate alternative text
      const altText = generateAlternativeText(content, result.bias_detection?.highlighted_text || [])
      setAlternativeText(altText)
      
      setAnalysisResult(result)
      setCurrentStep(4)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please ensure backend is running at http://localhost:8000')
      setCurrentStep(1)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractEntities = (text) => {
    // Simple entity extraction for demo
    const entities = []
    const commonEntities = ['CEO', 'company', 'engineer', 'manager', 'director', 'president', 'team', 'organization']
    commonEntities.forEach(entity => {
      if (text.toLowerCase().includes(entity.toLowerCase())) {
        entities.push(entity)
      }
    })
    return entities.slice(0, 5) // Limit to 5 entities
  }

  const generateAlternativeText = (originalText, highlightedSpans) => {
    if (!highlightedSpans || highlightedSpans.length === 0) {
      return originalText
    }

    let altText = originalText
    // Sort spans by start position in reverse to replace from end to start
    const sortedSpans = [...highlightedSpans].sort((a, b) => b.span[0] - a.span[0])
    
    sortedSpans.forEach(span => {
      if (span.suggestion) {
        const before = altText.substring(0, span.span[0])
        const after = altText.substring(span.span[1])
        altText = before + span.suggestion + after
      }
    })
    
    return altText
  }

  const highlightText = (text, spans) => {
    if (!spans || spans.length === 0) return text

    const parts = []
    let lastIndex = 0

    // Sort spans by start position
    const sortedSpans = [...spans].sort((a, b) => a.span[0] - b.span[0])

    sortedSpans.forEach((span, idx) => {
      // Add text before this span
      if (span.span[0] > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, span.span[0]),
          isHighlighted: false
        })
      }

      // Add highlighted span
      parts.push({
        text: text.substring(span.span[0], span.span[1]),
        isHighlighted: true,
        biasType: span.bias_type,
        severity: span.severity,
        suggestion: span.suggestion
      })

      lastIndex = span.span[1]
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isHighlighted: false
      })
    }

    return parts
  }

  const getBiasColor = (type, severity) => {
    const colors = {
      gender_bias: {
        low: 'bg-red-100 border-red-300 text-red-800',
        medium: 'bg-red-200 border-red-400 text-red-900',
        high: 'bg-red-300 border-red-500 text-red-900'
      },
      stereotype: {
        low: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        medium: 'bg-yellow-200 border-yellow-400 text-yellow-900',
        high: 'bg-yellow-300 border-yellow-500 text-yellow-900'
      },
      language_dominance: {
        low: 'bg-purple-100 border-purple-300 text-purple-800',
        medium: 'bg-purple-200 border-purple-400 text-purple-900',
        high: 'bg-purple-300 border-purple-500 text-purple-900'
      }
    }
    return colors[type]?.[severity] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  const copyAlternativeText = () => {
    navigator.clipboard.writeText(alternativeText)
    alert('Alternative text copied to clipboard!')
  }

  const resetAnalysis = () => {
    setCurrentStep(1)
    setContent('')
    setAnalysisResult(null)
    setPreprocessing(null)
    setAlternativeText('')
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Analyzer</h1>
        <p className="text-gray-600 mb-8">7-Step AI-Powered Bias Detection Pipeline</p>

        {/* Pipeline Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    currentStep >= step.num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs mt-2 font-medium ${
                    currentStep >= step.num ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Step {step.num}
                  </p>
                  <p className="text-xs text-gray-600">{step.name}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.num ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Content Input */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Step 1: Content Input</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg text-sm font-medium">
                📝 Paste Text
              </button>
              <button className="p-4 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium">
                🔗 Paste URL
              </button>
              <button className="p-4 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium">
                📄 Upload File
              </button>
            </div>

            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter or paste content here for bias analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Language</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="article">News Article</option>
                  <option value="blog">Blog Post</option>
                  <option value="social">Social Media</option>
                  <option value="report">Report</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis →'}
            </button>
          </div>
        )}

        {/* Step 2: Preprocessing */}
        {currentStep >= 2 && preprocessing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Step 2: Preprocessing</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Detected Language</p>
                <p className="text-2xl font-bold text-blue-600">{preprocessing.detectedLanguage.toUpperCase()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Word Count</p>
                <p className="text-2xl font-bold text-green-600">{preprocessing.wordCount}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Tokens</p>
                <p className="text-2xl font-bold text-purple-600">{preprocessing.tokenCount}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Entities Found</p>
                <p className="text-2xl font-bold text-orange-600">{preprocessing.entitiesFound.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 & 4: Results */}
        {currentStep >= 3 && analysisResult && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Step 3: Bias Detection</h2>
              
              {/* Original Text with Highlighting */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Text (Biased terms highlighted):</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {highlightText(content, analysisResult.bias_detection?.highlighted_text).map((part, idx) => (
                      part.isHighlighted ? (
                        <span
                          key={idx}
                          className={`px-1 py-0.5 rounded border-2 cursor-help ${getBiasColor(part.biasType, part.severity)}`}
                          title={`${part.biasType} (${part.severity})${part.suggestion ? ` → Suggestion: ${part.suggestion}` : ''}`}
                        >
                          {part.text}
                        </span>
                      ) : (
                        <span key={idx}>{part.text}</span>
                      )
                    ))}
                  </p>
                </div>
              </div>

              {/* Alternative Text */}
              {alternativeText && alternativeText !== content && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">✨ Suggested Alternative (Bias-Free):</h3>
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 relative">
                    <p className="text-gray-800 leading-relaxed pr-20">{alternativeText}</p>
                    <button
                      onClick={copyAlternativeText}
                      className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Bias Terms Legend */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-600">Legend:</span>
                {analysisResult.bias_detection?.highlighted_text?.map((span, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-full text-xs border ${getBiasColor(span.bias_type, span.severity)}`}>
                    {span.text} → {span.suggestion || 'review needed'}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Step 4: Explainable Bias Score (XAI)</h2>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold text-orange-600">
                  {(analysisResult.bias_detection?.bias_scores?.overall || 0).toFixed(2)}
                </p>
                <p className="text-gray-600 mt-2">Overall Bias Score</p>
                <p className="text-sm text-gray-500 mt-1">
                  {analysisResult.bias_detection?.bias_scores?.overall > 0.7 ? '🔴 High Bias' :
                   analysisResult.bias_detection?.bias_scores?.overall > 0.4 ? '🟡 Medium Bias' :
                   '🟢 Low Bias'}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {Object.entries(analysisResult.bias_detection?.bias_scores || {}).map(([key, value]) => (
                  key !== 'overall' && (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold">{value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Explanations */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📖 AI Explanation:</h3>
                {Object.entries(analysisResult.bias_detection?.explanations || {}).map(([key, explanation]) => (
                  <p key={key} className="text-sm text-blue-800 mb-2">
                    <strong className="capitalize">{key.replace('_', ' ')}:</strong> {explanation}
                  </p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  🔄 Analyze New Text
                </button>
                <button
                  onClick={() => {
                    const data = JSON.stringify(analysisResult, null, 2)
                    const blob = new Blob([data], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `analysis-${analysisResult.analysis_id}.json`
                    a.click()
                  }}
                  className="px-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                >
                  💾 Export JSON
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ContentAnalyzer
