import NotepadComponent from "../components/NotepadComponent";
import WhiteContainer from "../components/WhiteContainer";
import SideBar from "../components/SideBar";
import Avatar from "../components/AvatarModal";
import "react-quill/dist/quill.snow.css";


const NotepadPage = () => {
  return (
    <div>
      <WhiteContainer>
        <NotepadComponent/>
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </div>
  );
};

export default NotepadPage;
