import { useState } from 'react'

function Settings() {
  const [biasThreshold, setBiasThreshold] = useState(0.5)
  const [autoApprove, setAutoApprove] = useState(false)
  const [humanReviewRequired, setHumanReviewRequired] = useState(true)
  const [selectedModel, setSelectedModel] = useState('indicbert')

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure AI models, thresholds, and governance controls</p>
        </div>

        {/* Model Configuration */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">🤖 Model Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary NLP Model
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="indicbert">IndicBERT (Multilingual)</option>
                <option value="bert">BERT Base</option>
                <option value="distilbert">DistilBERT</option>
                <option value="roberta">RoBERTa</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                IndicBERT recommended for regional language support
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SHAP Explainability</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-xs text-gray-600">Provides word-level bias explanations</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AIF360 Metrics</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-xs text-gray-600">Fairness metric calculations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Configuration */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">⚙️ Detection Thresholds</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Bias Detection Threshold
                </label>
                <span className="text-lg font-bold text-blue-600">{biasThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={biasThreshold}
                onChange={(e) => setBiasThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0 (Strict)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Lenient)</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Articles with bias scores above this threshold will be flagged
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Gender Bias
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.6"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Stereotype
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.5"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Language Dominance
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.4"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Human Review Governance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">👤 Human Review Governance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Require Human Review</p>
                <p className="text-sm text-gray-600">All flagged articles must be reviewed by humans</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanReviewRequired}
                  onChange={(e) => setHumanReviewRequired(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-Approve Low Bias</p>
                <p className="text-sm text-gray-600">Automatically approve articles with bias score &lt; 0.2</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Governance Policy</p>
              <p className="text-xs text-yellow-700">
                Changes to governance settings require admin approval and will be logged in audit trail
              </p>
            </div>
          </div>
        </div>

        {/* Language Support */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">🌐 Language Support</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali', 'Telugu', 'Gujarati', 'Kannada'].map((lang) => (
              <div key={lang} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  defaultChecked={['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali'].includes(lang)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">{lang}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            💾 Save Settings
          </button>
          <button className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
