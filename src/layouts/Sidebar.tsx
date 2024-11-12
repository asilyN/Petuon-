// Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom"; 
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo } from "lucide-react"; 
import logo from "../assets/logo.png";  
import { Button } from "../components/Button";  

const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-[45px] flex-shrink-0 rounded-3xl">
            <Link to="/">
                <img src={logo} className="h-[130px]" alt="Logo" />
            </Link>
            
            <Link to="/">
                <Button variant="ghost" className="h-20 pl-2">
                    <LayoutDashboard size={32} color="white" style={{ marginLeft: "-1px" }} />
                </Button>
            </Link>
            
            <Link to="/flashcard">
                <Button variant="ghost" className="h-20 pl-2">
                    <WalletCards size={32} color="white" style={{ marginLeft: "-1px" }} />
                </Button>
            </Link>
            
            <Link to="/calendar">
                <Button variant="ghost" className="h-20 pl-2">
                    <CalendarRange size={32} color="white" style={{ marginLeft: "-1px" }} />
                </Button>
            </Link>
            
            <Link to="/notes">console.log('Sidebar component rendered');
                <Button variant="ghost" className="h-20 pl-2">
                    <NotebookPen size={32} color="white" style={{ marginLeft: "-1px" }} />
                </Button>
            </Link>
            
            <Link to="/todo">
                <Button variant="ghost" className="h-20 pl-2">
                    <ListTodo size={32} color="white" style={{ marginLeft: "-1px" }} />
                </Button>
            </Link>
        </div>
    );
}

export default Sidebar;
