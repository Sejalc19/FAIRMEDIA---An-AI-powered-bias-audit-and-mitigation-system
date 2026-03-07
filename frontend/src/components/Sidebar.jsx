function Sidebar({ currentPage, onNavigate, pendingReviews }) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      badge: null
    },
    { 
      id: 'analyzer', 
      label: 'Content Analyzer', 
      icon: '🔍',
      badge: null
    },
    { 
      id: 'bias-scores', 
      label: 'Bias Scores', 
      icon: '📈',
      badge: null
    },
    { 
      id: 'human-review', 
      label: 'Human Review', 
      icon: '👤',
      badge: pendingReviews
    },
    { 
      id: 'fair-ranking', 
      label: 'Fair Ranking', 
      icon: '⚖️',
      badge: null
    },
    { 
      id: 'audit-reports', 
      label: 'Audit Reports', 
      icon: '📄',
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️',
      badge: null
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">FAIRMEDIA</h1>
        <p className="text-xs text-gray-500 mt-1">AI Bias Audit System</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">System Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-medium">Healthy</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
