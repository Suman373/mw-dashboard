const Navbar = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bar-chart3 w-8 h-8 text-purple-500"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
      </div>
    </header>
  )
}

export default Navbar;