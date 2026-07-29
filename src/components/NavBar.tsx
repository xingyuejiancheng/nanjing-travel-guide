import { NavLink, useNavigate } from "react-router-dom";
import {
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  SaveAll,
  Menu,
  X,
  Hotel,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "首页", icon: <Hotel className="w-4 h-4" /> },
    { to: "/resources", label: "资源速查", icon: <MapPin className="w-4 h-4" /> },
    { to: "/library", label: "文化百科", icon: <BookOpen className="w-4 h-4" /> },
    { to: "/planner", label: "攻略生成", icon: <Sparkles className="w-4 h-4" /> },
    { to: "/saved", label: "我的攻略", icon: <SaveAll className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-xuanzhi-100/95 backdrop-blur-md border-b-2 border-jinling-500/40 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => nav("/")}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-10 h-10 rounded-full bg-cinnabar-600 flex items-center justify-center shadow-seal group-hover:rotate-6 transition-transform">
            <Compass className="w-6 h-6 text-jinling-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-moyu-900 tracking-wider">
              金陵胜迹
            </span>
            <span className="font-kai text-xs text-celadon-600 mt-0.5">
              南京·定制旅游攻略
            </span>
          </div>
          {/* 印章 */}
          <div className="hidden sm:flex ml-2 px-1.5 py-0.5 border-2 border-cinnabar-600 text-cinnabar-700 font-serif text-xs rotate-[-6deg] bg-xuanzhi-50/50">
            六朝古都
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg font-kai text-sm transition-all relative",
                  isActive
                    ? "text-cinnabar-700 bg-jinling-100 shadow-seal"
                    : "text-moyu-800 hover:text-cinnabar-700 hover:bg-jinling-50"
                )
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-moyu-800 hover:bg-jinling-100"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-jinling-300 bg-xuanzhi-100">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg font-kai",
                    isActive
                      ? "text-cinnabar-700 bg-jinling-100"
                      : "text-moyu-800 hover:bg-jinling-50"
                  )
                }
              >
                {l.icon}
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
