import WhiteContainer from "../components/WhiteContainer";
import Sidebar from "../components/SideBar";
import Avatar from "../components/AvatarModal";

import FlashcardComponent from "../components/flashcard/FlashCardComponent";

import { ToastContainer } from "react-toastify";

const FlashCardPage = () => {
  return(
    <>  
         
        <WhiteContainer>
            <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-1 mt-7">Flashcards</h1>
            <FlashcardComponent/>
            <Avatar/>
            <ToastContainer />
        </WhiteContainer>
        <Sidebar/>

    </>
)
};

export default FlashCardPage;