import { getAnalyses, exportToCSV, exportToJSON } from '../utils/analysisStorage'

function AuditReports() {
  const analyses = getAnalyses()

  const total = analyses.length
  const highBias = analyses.filter((a) => a.bias_score > 0.7).length
  const mitigated = analyses.filter((a) => a.mitigated).length
  const avgBias =
    total > 0
      ? analyses.reduce((sum, a) => sum + a.bias_score, 0) / total
      : 0

  const fairnessMetrics = [
    {
      name: 'High Bias Rate',
      value: total ? highBias / total : 0,
      target: 0.2,
      status: total ? (highBias / total <= 0.2 ? 'good' : 'warning') : 'excellent',
    },
    {
      name: 'Mitigation Rate',
      value: total ? mitigated / total : 0,
      target: 0.7,
      status: total ? (mitigated / total >= 0.7 ? 'excellent' : 'warning') : 'warning',
    },
    {
      name: 'Average Bias Score',
      value: avgBias,
      target: 0.4,
      status: avgBias <= 0.4 ? 'good' : 'warning',
    },
  ]

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Reports</h1>
            <p className="text-gray-600 mt-1">Fairness metrics and compliance reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportToCSV(analyses)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2"
            >
              📄 Export PDF
            </button>
            <button
              onClick={() => exportToJSON(analyses)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => {
                if (analyses.length === 0) {
                  alert('No analyses to share.')
                  return
                }
                const payload = {
                  analyses,
                  summary: {
                    total,
                    highBias,
                    mitigated,
                    avgBias: Number(avgBias.toFixed(2)),
                  },
                }
                navigator.clipboard
                  .writeText(JSON.stringify(payload, null, 2))
                  .then(() => alert('Audit summary copied to clipboard.'))
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              🔗 API Share
            </button>
          </div>
        </div>

        {/* Fairness Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Fairness Metrics (AIF360)</h2>
          <div className="grid grid-cols-2 gap-6">
            {fairnessMetrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{metric.value.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-600">{metric.target.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Target</p>
                  </div>
                </div>
                <div className="mt-3">
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className={`h-2 rounded-full ${
        metric.status === 'excellent'
          ? 'bg-green-500'
          : metric.status === 'good'
          ? 'bg-blue-500'
          : metric.status === 'warning'
          ? 'bg-yellow-500'
          : 'bg-red-500'
      }`}
      style={{
        width: `${Math.min(
          100,
          Math.max(0, (metric.value / metric.target) * 100)
        )}%`,
      }}
    />
  </div>
</div>

              </div>
            ))}
          </div>
        </div>

        {/* Report Summary (live from current analyses) */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Total Analyses</h3>
            <p className="text-4xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">High Bias Articles</h3>
            <p className="text-4xl font-bold text-red-600">{highBias}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Mitigated Articles</h3>
            <p className="text-4xl font-bold text-green-600">{mitigated}</p>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Detailed Audit Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Language</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Bias Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm uppercase">{a.language}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {a.bias_score.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">{a.risk_level}</td>
                    <td className="px-4 py-3 text-sm">
                      {a.reviewed
                        ? 'Reviewed'
                        : a.mitigated
                        ? 'Mitigated'
                        : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditReports
