import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  WalletCards,
  CalendarRange,
  NotebookPen,
  ListTodo,
} from "lucide-react";
import logo from "../assets/petuon_logo.png";
import background from "../assets/BG.png";

const Sidebar: React.FC = () => {
  // Ginakuha ang location (kung diin ka na nga page) gamit ang useLocation para sa highlight sa sidebar
  const location = useLocation();

  // Muni nga function nagacheck kung pareho bala ang current nga path sa ginaklik nga link
  const isActive = (path: string) => {
    return location.pathname === path; // Kung ang path pareho sa current nga page, nagabalik siya sang true
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className="fixed bottom-0 hidden h-screen w-screen flex-col bg-cover bg-center bg-no-repeat lg:flex"
        style={{ backgroundImage: `url(${background})` }}
      >
        <img
          src={logo}
          className="fixed left-[0.1rem] top-[1rem] size-[8rem]"
          alt="Logo"
        />
        <div className="fixed left-4 top-[11rem] flex flex-col items-start space-y-5">
          <Link
            to="/dashboard"
            className={`group pl-9 pr-16 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/dashboard") ? "bg-[#F6F6F6]" : ""}`}>
            <LayoutDashboard size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/dashboard") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-150 "}`} />
          </Link>
          <Link
            to="/flashcard"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/flashcard") ? "bg-[#F6F6F6]" : ""}`}>
            <WalletCards size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/flashcard") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-150 "}`} />
          </Link>
          <Link
            to="/notepad"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/notepad") ? "bg-[#F6F6F6]" : ""}`}>
            <NotebookPen size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/notepad") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-150 "}`} />
          </Link>
          <Link
            to="/calendar"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/calendar") ? "bg-[#F6F6F6] " : ""}`}>
            <CalendarRange size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/calendar") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-150 "}`} />
          </Link>
          <Link
            to="/todolist"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/todolist") ? "bg-[#F6F6F6]" : ""}`}>
            <ListTodo size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/todolist") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-150 "}`} />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 z-10 flex h-20 w-full items-center justify-around rounded-t-3xl bg-[#354F52] py-2 shadow-md md:px-8 lg:hidden"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Link
          to="/dashboard"
          className={`flex flex-col items-center text-sm ${isActive("/dashboard") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/dashboard") ? "bg-white" : ""
            }`}>
            <LayoutDashboard className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/flashcard"
          className={`flex flex-col items-center text-sm ${isActive("/flashcard") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/flashcard") ? "bg-white" : ""
            }`}>
            <WalletCards className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/notepad"
          className={`flex flex-col items-center text-sm ${isActive("/notepad") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/notepad") ? "bg-white" : ""
            }`}>
            <NotebookPen className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/calendar"
          className={`flex flex-col items-center text-sm ${isActive("/calendar") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/calendar") ? "bg-white" : ""
            }`}>
            <CalendarRange className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/todolist"
          className={`flex flex-col items-center text-sm ${isActive("/todolist") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/todolist") ? "bg-white" : ""
            }`}>
            <ListTodo className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
