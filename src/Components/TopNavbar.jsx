import { Link } from "react-router-dom";

function TopNavbar({ toggleSidebar }) {
  return (
    <header 
      className="fixed top-0 left-0 w-full h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between"
      style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      <div className="flex items-center gap-4">
        <button 
          className="text-slate-300 hover:text-white p-2 text-2xl cursor-pointer hidden md:block"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
          NERIO STREAM
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-300 hover:text-white relative">
          <span className="text-lg">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <span className="text-xs font-medium text-slate-200 hidden sm:block">
            Hi, User
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:block">▼</span>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
