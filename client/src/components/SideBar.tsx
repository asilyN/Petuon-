import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react";
import logo from "../assets/petuon_logo.png";
import background from '../assets/BG.png';

const Sidebar: React.FC = () => {
    // Ginakuha ang location (kung diin ka na nga page) gamit ang useLocation para sa highlight sa sidebar
    const location = useLocation(); 

    // Muni nga function nagacheck kung pareho bala ang current nga path sa ginaklik nga link
    const isActive = (path: string) => {
        return location.pathname === path;  // Kung ang path pareho sa current nga page, nagabalik siya sang true
    };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div 
        className="hidden lg:flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat bottom-0 fixed"
        style={{ backgroundImage: `url(${background})` }}>
        <img src={logo} className="fixed left-[0.1rem] top-[1rem] size-[8rem]" alt="Logo" />
        <div className="flex flex-col items-start space-y-5 fixed top-40 left-4">
          <Link
            to="/"
            className={`group pl-9 pr-16 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/") ? "bg-[#F6F6F6]" : ""}`}>
            <LayoutDashboard size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
          </Link>
          <Link
            to="/Flashcard"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Flashcard") ? "bg-[#F6F6F6]" : ""}`}>
            <WalletCards size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Flashcard") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
          </Link>
          <Link
            to="/Calendar"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Calendar") ? "bg-[#F6F6F6]" : ""}`}>
            <CalendarRange size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Calendar") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
          </Link>
          <Link
            to="/Notepad"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/Notepad") ? "bg-[#F6F6F6]" : ""}`}>
            <NotebookPen size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/Notepad") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
          </Link>
          <Link
            to="/ToDoList"
            className={`group pl-9 pr-11 pt-[1.2rem] pb-[1.2rem] rounded-tl-3xl rounded-bl-3xl hover:bg-[#F6F6F6] transition-colors duration-300 ${isActive("/ToDoList") ? "bg-[#F6F6F6]" : ""}`}>
            <ListTodo size={32} className={`group-hover:text-[#719191] duration-300 ${isActive("/ToDoList") ? "text-[#719191] scale-150" : "text-white transform transition-transform duration-200 hover:scale-125 active:scale-50"}`} />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="lg:hidden fixed bottom-0 left-0 w-full bg-[#354F52] flex justify-around items-center py-2 shadow-md rounded-t-3xl h-20 z-10 md:px-8"
        style={{ backgroundImage: `url(${background})` }}>
        <Link
          to="/"
          className={`flex flex-col items-center text-sm ${isActive("/") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/") ? "bg-white" : ""
            }`}>
            <LayoutDashboard className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/Flashcard"
          className={`flex flex-col items-center text-sm ${isActive("/Flashcard") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/Flashcard") ? "bg-white" : ""
            }`}>
            <WalletCards className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/Calendar"
          className={`flex flex-col items-center text-sm ${isActive("/Calendar") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/Calendar") ? "bg-white" : ""
            }`}>
            <CalendarRange className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/Notepad"
          className={`flex flex-col items-center text-sm ${isActive("/Notepad") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/Notepad") ? "bg-white" : ""
            }`}>
            <NotebookPen className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/ToDoList"
          className={`flex flex-col items-center text-sm ${isActive("/ToDoList") ? "text-primary-700" : "text-white"}`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive("/ToDoList") ? "bg-white" : ""
            }`}>
            <ListTodo className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;