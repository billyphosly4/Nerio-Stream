import { useState } from "react";

function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-50 pointer-events-none">
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2.5 flex items-center justify-between shadow-2xl pointer-events-auto w-72">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden shrink-0">
            {/* Placeholder for now */}
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">Interstellar</h4>
            <p className="text-xs text-slate-400 line-clamp-1">Currently playing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-200 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "⏸" : "▶️"}
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayer;
