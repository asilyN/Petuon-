import { useState } from "react";
import Avatar from "../components/AvatarModal";
import SideBar from "../components/SideBar";
import WhiteContainer from "../components/WhiteContainer";
import Pets from "../components/dashboard/Pets";
import ToDoListComponent from "../components/ToDoListComponent";
import DeckProgress from "../components/dashboard/DeckProgress";

const DashboardPage = () => {
  const [setPetData] = useState<any>(null);

  const handlePetAdded = (pet: any) => {
    setPetData(pet); // Update pet data state
  };

  const handlePetUpdated = (updatedPet: any) => {
    setPetData(updatedPet); // Update pet data with the updated pet information
  };

  return (
    <>
      <WhiteContainer >
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="text-[3rem] text-[#354F52] tracking-normal mt-7"
        >
          Dashboard
        </h1>
        <div className="flex flex-col h-[87%] sm:block">
        <div className="scrollbar-hidden overflow-y-scroll overflow-x-hidden mt-[-1rem] flex flex-col gap-y-5   md:grid md:grid-cols-1 lg:grid lg:grid-cols-[2fr_2.5fr] lg:gap-6 p-4 mb-6">
          {/* Column for My Task and Progress */}
          <div className="flex flex-col lg:grid lg:grid-rows-[auto_auto] lg:gap-6">
            <div className="w-full h-[21.5rem] bg-white rounded-[1.5rem] shadow-lg">
              <ToDoListComponent variant="compact" />
            </div>
            <div
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="font-bold text-[#354F52] p-3 bg-white w-full h-[14rem] rounded-[1.5rem] text-xl shadow-lg mt-8 lg:mt-0"
            >
              <DeckProgress/>
            </div>
          </div>
          {/* Column for Pets */}
          <div
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="font-bold text-[#354F52] bg-white w-full h-[37rem] rounded-[1.5rem] text-xl shadow-lg"
          >
            <Pets
              onPetAdded={handlePetAdded}
              onPetUpdated={handlePetUpdated}
            />
          </div>
        </div>
        </div>
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default DashboardPage; 