import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function TopNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setIsSearchOpen(false);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-[#0f172a] border-b border-slate-800/80 z-50 px-2 py-4 md:px-8 flex items-center justify-between pt-safe">
        <div className="flex items-center justify-between w-full h-full gap-2 min-w-0">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <button
              aria-label="Toggle sidebar"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/50 text-slate-300 hover:text-white cursor-pointer transition-all shrink-0 hover:bg-slate-800/80"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="block max-w-[calc(100vw-105px)] truncate text-[0.84rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight md:max-w-none md:text-2xl">
              NERIO STREAM
            </Link>
          </div>

          <div className="flex items-center justify-end pr-1 relative">
            <button 
              type="button" 
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/50 text-slate-300 hover:text-white transition-all shrink-0 hover:bg-slate-800/80"
              title="Search"
              onClick={() => setIsSearchOpen((open) => !open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-[340px] rounded-xl border border-slate-800 bg-[#12172a]/95 p-4 shadow-2xl backdrop-blur-md">
                <form onSubmit={handleSearchSubmit} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-2 py-2.5 flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSearchSubmit(event);
                        }
                      }}
                      placeholder="Search movies..."
                      className="w-full border-0 bg-transparent text-xs text-white outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-0"
                      autoFocus
                      style={{ boxShadow: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white"
                    aria-label="Submit search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white"
                    aria-label="Close search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNavbar;
