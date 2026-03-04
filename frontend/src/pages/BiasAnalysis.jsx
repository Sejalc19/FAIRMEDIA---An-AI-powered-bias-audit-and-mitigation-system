import { useState } from 'react'
import InputSection from '../components/InputSection'
import BiasDisplay from '../components/BiasDisplay'
import FairnessDisplay from '../components/FairnessDisplay'
import SuggestionDisplay from '../components/SuggestionDisplay'
import ReviewSection from '../components/ReviewSection'
import { analyzeText } from '../api/api_client'
import { highlightBiasedText } from '../utils/textHighlighter'

function BiasAnalysis() {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleAnalyze = async (text) => {
    setIsLoading(true)
    try {
      const result = await analyzeText(text)
      const highlighted = highlightBiasedText(text, result.biases)
      setAnalysisResult({ ...result, highlightedText: highlighted })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {analysisResult && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BiasDisplay biases={analysisResult.biases} />
              <FairnessDisplay metrics={analysisResult.fairnessMetrics} />
            </div>
            <SuggestionDisplay suggestions={analysisResult.suggestions} />
            <ReviewSection 
              originalText={analysisResult.originalText}
              highlightedText={analysisResult.highlightedText}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default BiasAnalysis
