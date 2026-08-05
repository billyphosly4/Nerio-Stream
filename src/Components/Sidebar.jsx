import { NavLink } from "react-router-dom";

function Sidebar({ isOpen }) {
  const navItems = [
    { to: "/", icon: "🎬", label: "Movies", end: true },
    { to: "/trending", icon: "🔥", label: "Trending" },
    { to: "/tv", icon: "📺", label: "TV Shows" },
    { to: "/live", icon: "📡", label: "Live & Sports" },
    { to: "/favourites", icon: "❤️", label: "Favorites" },
    { to: "/downloads", icon: "📥", label: "Downloads" },
    { to: "/subscriptions", icon: "💎", label: "Premium" },
    { to: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 h-full z-40 transition-all duration-300 overflow-hidden pl-3 ${isOpen ? 'w-16 min-w-[4rem] opacity-100' : 'w-0 min-w-0 opacity-0 border-r-0'}`}>
      <nav className="flex-1 overflow-y-auto py-4 pl-1 scrollbar-hide">
        <ul className="space-y-3 px-2 flex flex-col items-center ml-1">
          {navItems.map((item) => (
            <li key={item.to} className="w-full flex justify-center" title={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                <span className="text-base flex justify-center">{item.icon}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
