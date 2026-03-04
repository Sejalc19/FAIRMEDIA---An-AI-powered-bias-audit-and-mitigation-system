function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Bias Analysis</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Settings
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            U
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
