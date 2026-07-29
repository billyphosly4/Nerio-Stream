import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function TopNavbar({ toggleSidebar }) {
  // Navigation hook retained for future search implementation
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-[#0f172a] border-b border-slate-800/80 z-50 flex items-center px-4 md:px-6">
      
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center gap-3">
          <button 
            className="text-slate-400 hover:text-white p-1 text-2xl cursor-pointer hidden md:block transition-colors shrink-0"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <Link to="/" className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight shrink-0">
            NERIO STREAM
          </Link>
        </div>

        <div className="flex items-center">
          <button 
            type="button" 
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
            title="Search"
            onClick={() => {
              // Add search toggle or navigation logic here later
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
