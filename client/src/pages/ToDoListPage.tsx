import WhiteContainer from "../components/WhiteContainer";
import Sidebar from "../components/SideBar";
import Avatar from "../components/Avatar";
import Clock from "../components/Clock";

import ToDoListComponent from "../components/ToDoListComponent"

const ToDoListPage = () => {

    return(
        <>  
            <WhiteContainer>
                <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-1 mt-7">To Do List</h1>
                <Clock/>
                <ToDoListComponent/>
                <Avatar/>
            </WhiteContainer>
            <Sidebar/> 
        </>
    )
}

export default ToDoListPage











