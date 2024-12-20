import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ejImage from "../assets/teamPicture/ej.png";
import nelImage from "../assets/teamPicture/nel.png";
import dainzImage from "../assets/teamPicture/dainz.png";
import floydImage from "../assets/teamPicture/floyd.png";
import nikImage from "../assets/teamPicture/nik.png";
import paulImage from "../assets/teamPicture/paul.png";
import { useNavigate } from "react-router-dom";
import {ContactForm} from "../components/Contactform";
import notefeatureImage from "../assets/features/notefeature.png";
import flashcardImage from "../assets/features/flashcardfeature.png";
import petfeatureImage from "../assets/features/petfeature.png";
import todolistImage from "../assets/features/tofolistfeature.png";
import landingPage from '../assets/landingpageLogo.png';
import penguin from "../assets/landingpagePenguin.png";
import landingPageBG from "../assets/landingPagebg2.png";
import LogInOut from "../components/logInOutComponent";
import contactForm from "../assets/contactformbg.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<"landing" | "about" | "team" |"contact">(
    "landing"
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGetStarted = () => {
    setIsLoading(true); // Show loading screen
    setTimeout(() => {
      navigate("/login"); // Navigate after a delay (simulate loading time)
      setIsLoading(false); // Hide loading screen
    }, 2000); // Adjust delay as needed
  };
  // Scroll animation logic using Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState<boolean>(false);
  const [hasExited, setHasExited] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  const observeRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  const lastScrollY = useRef(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else {
      setScrollDirection('up');
    }
    lastScrollY.current = window.scrollY;
  };

  useEffect(() => {
    const currentObserveRef = observeRef.current;
    const currentFeaturesRef = featuresRef.current;
  
    if (currentObserveRef) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting); // Set visibility for landing section
          if (entry.isIntersecting && hasExited) {
            setHasExited(false); // Reset hasExited when section is back in view
          }
        },
        { threshold: 0.2 }
      );
      observer.current.observe(currentObserveRef); // Observe landing section
    }
  
    if (currentFeaturesRef) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsFeaturesVisible(entry.isIntersecting); // Set visibility for Features section
          if (!entry.isIntersecting && !hasExited) {
            setHasExited(true); // Set exit animation state when exiting
          }
        },
        { threshold: 0.1 }
      );
      observer.current.observe(currentFeaturesRef); // Observe Features section
    }
  
    window.addEventListener('scroll', handleScroll);
  
    // Reset isVisible when the "landing" page is shown
    if (currentPage === "landing") {
      setIsVisible(false); // Reset the visibility when navigating to home
    }
  
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasExited, currentPage]); // Added currentPage as dependency

  return (
    
    <div className="flex flex-col overflow-x-hidden scrollbar-hidden fixed w-full h-full overflow-y-scroll min-h-screen">
      {isLoading && <LogInOut />}
    {/* Persistent Navigation Bar with Dynamic Background Color */}
    <header
      className={`absolute flex w-full items-center justify-between md:mb-15 md:w-full lg:w-full xl:w-full xl:h-24 ${
        currentPage === "landing" ? "bg-transparent" : "bg-[#719191]"
      }`}
    >
    {/* Logo */}
    <div className="hidden xl:block">
      <img
        src={landingPage}
        alt="PETUON Logo"
        className="w-96 h-auto object-contain xl:h-28 xl:mt-10 xl:-m-7"
      />
    </div>


        {/* Navigation Links */}
        <nav className="p-6 flex space-x-12 md:space-x-36 lg:space-x-40 xl:space-x-16 ml-auto xl:mr-12">
        <a
          onClick={() => setCurrentPage("landing")}
          className="text-lg md:text-3xl lg:text-4xl xl:text-3xl text-white hover:underline cursor-pointer "
        >
          Home
        </a>
        <a
          onClick={() => setCurrentPage("about")}
          className="text-lg md:text-3xl lg:text-4xl xl:text-3xl text-white hover:underline cursor-pointer"
        >
          About
        </a>
        <a
          onClick={() => setCurrentPage("team")}
          className="text-lg md:text-3xl lg:text-4xl xl:text-3xl text-white hover:underline cursor-pointer"
        >
          Team
        </a>
        <a
          onClick={() => setCurrentPage("contact")}
          className="text-lg md:text-3xl lg:text-4xl xl:text-3xl text-white hover:underline cursor-pointer"
        >
          Contacts
        </a>
      </nav>
      </header>

      {currentPage === "landing" && (
      <section
        ref={observeRef} // Attach the observer to this section
        className="flex h-screen flex-col items-start justify-center bg-[url('/src/assets/landingpagebg.png')] bg-cover bg-center bg-no-repeat text-white"
      >
        
        {/* Text Content */}
        <motion.div
        key={currentPage} // Key based on currentPage to force re-render
        className="w-full p-2 mt-12 flex flex-col items-center justify-center md:mt-40 md:items-start "
        initial={{ opacity: 0, x: -100 }} // Start off-screen and invisible
        animate={{
          opacity: isVisible ? 1 : 0, // Fade in when in view
          x: isVisible ? 0 : -100, // Slide in when in view
          y: scrollDirection === 'down' ? 20 : 0, // Move down slightly when scrolling
        }}
        exit={{
          opacity: hasExited ? 0 : 1, // Fade out on exit
          x: hasExited ? 100 : 0, // Slide out when exiting
        }}
        transition={{ duration: 2 }} // Smooth transition for animations
      >
        <h2 className="mb-1 text-2xl text-center font-bold md:text-6xl md:ml-9 lg:text-6xl lg:mt-30 xl:text-6xl xl:mt-20">
          Your Student Study Buddy
        </h2>
        <p className="mb-6 text-center text-xl md:text-4xl md:mt-5 md:ml-9 md:text-start lg:text-4xl lg:mt-7">
          This web app helps students be more <br />
          productive by implementing study tools.
        </p>
        <button
          onClick={handleGetStarted}
          className="rounded-3xl border-2 border-white bg-[#6e8080] px-2 py-1 font-semibold text-white shadow-md hover:bg-[#0d6767] md:px-5 md:py-3 md:text-3xl md:mt-3 md:ml-9 lg:text-2xl "
        >
          Get Started
        </button>
      </motion.div>

      <motion.img
        key={currentPage} // Key based on currentPage to force re-render
        src={penguin}
        alt="Study Buddy Penguin"
        className="w-50 h-auto md:h-4/6 md:w-4/6 md:ml-48 md:mt-6 lg:h-3/6 lg:w-2/5 lg:ml-96 xl:h-3/4 xl:w-1/3 xl:ml-auto xl:mr-0 xl:-mt-[160px]"
        initial={{ opacity: 0, x: 100 }} // Start off-screen and invisible
        animate={{
          opacity: isVisible ? 1 : 0, // Fade in when in view
          x: isVisible ? 0 : 100, // Slide in when in view
          y: scrollDirection === 'down' ? 20 : 0, // Move down slightly when scrolling
        }}
        exit={{
          opacity: hasExited ? 0 : 1, // Fade out on exit
          x: hasExited ? -100 : 0, // Slide out when exiting
        }}
        transition={{ duration: 2 }} // Smooth transition for animations
      />
      
        </section>
      )}

      {/* Features Section at the bottom of the Home Page */}
      {currentPage === "landing" && (
      <section className="bg-gradient-to-b from-[#698386] to-white md:px-10 md:py-16 lg:px-20 lg:py-24 md:w-full">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-12 text-[#274d4d] text-center text-5xl font-bold md:text-6xl">Features</h3>
    
        {/* Pets Feature */}
        <div className="flex flex-col md:flex-row items-center mb-[10rem] animate-fadeIn">
        <div className="group">
          <div
            className="w-[19rem] md:w-[30rem] h-[145px] md:h-[230px] sm:w-[60rem] sm:h-[930px] rounded-lg bg-contain group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${petfeatureImage})` }}
          ></div>
        </div>
        <div className="ml-[4rem] mt-4 text-center md:ml-6 md:mt-0 md:text-left sm:ml-[8rem]">
          <h4
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="text-5xl font-bold text-[#274d4d] xl:ml-[12rem] sm:ml-0 sm:text-4xl sm:-mr-4"
          >
            Pets
          </h4>
        </div>
      </div>
    
        {/* Todo-list Feature */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-[10rem] animate-slideInRight">
          <div className="group">
            <div
              className="w-[18rem] md:w-[30rem] h-[145px] md:h-[230px] lg:w-[28rem] lg:h-[220px]  sm:w-[60rem] sm:h-[930px]  rounded-lg bg-contain group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${todolistImage})` }}
            ></div>
          </div>
          <div className="mr-[4rem] mt-4 text-center md:mr-6 md:mt-0 md:text-right">
            <h4
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-5xl font-bold text-[#274d4d] xl:ml-[12rem] sm:ml-0 sm:text-4xl sm:-mr-4"
            >
              Todo-list
            </h4>
          </div>
        </div>
    
        {/* Flashcard Feature */}
        <div className="flex flex-col md:flex-row items-center mb-[10rem] animate-fadeIn">
          <div className="group">
            <div
              className="w-[20rem] md:w-[30rem] h-[150px] md:h-[220px] sm:w-[60rem] sm:h-[930px] rounded-lg bg-contain group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${flashcardImage})` }}
            ></div>
          </div>
          <div className="ml-[4rem] mt-4 text-center md:ml-6 md:mt-0 md:text-left">
            <h4
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-5xl font-bold text-[#274d4d] xl:ml-[12rem] sm:ml-0 sm:text-4xl sm:-mr-4"
            >
              Flashcard
            </h4>
          </div>
        </div>
    
        {/* Notes Feature */}
        <div className="flex flex-col md:flex-row-reverse items-center animate-slideInRight">
          <div className="group">
            <div
              className="w-[19rem] md:w-[30rem] h-[145px] md:h-[226px] sm:w-[60rem] sm:h-[930px] rounded-lg bg-contain group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${notefeatureImage})` }}
            ></div>
          </div>
          <div className="mr-[4rem] mt-4 text-center md:mr-6 md:mt-0 md:text-right">
            <h4
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-5xl font-bold text-[#274d4d] xl:ml-[12rem] sm:ml-0 sm:text-4xl sm:-mr-4"
            >
              Notes
            </h4>
          </div>
        </div>
      </div>
    </section>
    )}

      {currentPage === "about" && (
        // About page content goes here
        <section className="min-h-screen bg-cover bg-center text-gray-800 sm:ml-12 md:ml-16 lg:ml-20 bg-[url('/src/assets/landingPagebg2.png')]">
          <h1  style={{ fontFamily: '"Signika Negative", sans-serif' }} className="mb-6 text-[#738888] text-5xl md:texl-5xl font-bold text-start mt-28 ml-4 xl:mt-52">About</h1>
          <p
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="text-xl text-[#345959] max-w-screen-md leading-relaxed text-start ml-4"
          >
            This website was created by Carmine's Team to help students plan
            their study schedules, track habits, and boost productivity with
            fun virtual pet features.
            <br />
            <br />
            The team’s goal was to keep students motivated and engaged while
            studying by combining useful tools like flashcards, notes, to-do
            lists, and a calendar with a rewarding pet system.
            <br />
            <br />
            Thank you for using PETUON! We hope it makes your study journey
            more productive and enjoyable.
          </p>
        </section>
      )}

      {/* Home page content */}
      


      {/* Team page content */}
      {currentPage === "team" && (
      <section className={` bg-cover bg-center px-8 py-16 text-gray-800`}  
      style={{ backgroundImage: `url(${landingPageBG})` }}>
      <h1
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="mb-8 mt-24 text-5xl text-[#274d4d] font-bold text-center xl:mt-40"
      >
        Our Team
      </h1>
      
      <div className="flex flex-col gap-12">
        {/* First Row */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              name: "Nelissa Tuden",
              role: "PO / Development Team",
              image: nelImage,
              description:
                "Nelissa focuses on back-end development, ensuring our app is fast and secure.",
            },
            {
              name: "Dainz Andrei Trasadas",
              role: "Scrum Master",
              image: dainzImage,
              description:
                "Dainz keeps the team organized and ensures we meet our sprint goals.",
            },
            {
              name: "Elmor John Cortez",
              role: "Development Team",
              image: ejImage,
              description:
                "Elmor is a front-end specialist with a passion for creating smooth user experiences.",
            },



          ].map((member) => (
            <div
              key={member.name}
              className="mr-5 group relative flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-4 w-64 overflow-hidden transform transition-transform duration-200 hover:scale-105  hover:text-white hover:bg-[#719191] hover:shadow-lg"
            >
              <div className="w-full h-64 overflow-hidden rounded-2xl mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-lg text-[#3e6969] font-semibold mt-4"
              >
                {member.name}
              </h3>
              <p
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="italic text-gray-600"
              >
                {member.role}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-white bg-opacity-100 opacity-0 group-hover:h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <p
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="text-[#3e6969] p-4 text-lg"
                >
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
    
        {/* Second Row */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              name: "Floyd Matthew Torrechilla",
              role: "Development Team",
              image: floydImage,
              description:
                "Floyd specializes in database management and optimizing app performance.",
            },
            {
              name: "Nicholae Sara",
              role: "Development Team",
              image: nikImage,
              description:
                "Nicholae is a versatile developer who contributes to both front-end and back-end tasks.",
            },
            {
              name: "Les Paul Capanas",
              role: "Development Team",
              image: paulImage,
              description:
                "This member specializes in UI/UX design, ensuring the app looks modern and is user-friendly.",
            },
          ].map((member) => (
            <div
              key={member.name}
              className="mr-8 group relative flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-4 w-64 overflow-hidden transform transition-transform duration-200 hover:scale-105  hover:text-white hover:bg-[#719191] hover:shadow-lg"
            >
              <div className="w-full h-64 overflow-hidden rounded-2xl mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-lg text-[#3e6969] font-semibold mt-4"
              >
                {member.name}
              </h3>
              <p
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="italic text-gray-600"
              >
                {member.role}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-white bg-opacity-100 opacity-0 group-hover:h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <p
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="text-[#3e6969] p-4 text-lg"
                >
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )}


      


      {currentPage === "contact" && (
        <section id="contact-form" className=" bg-cover bg-center px-8 py-16" 
        style={{ backgroundImage: `url(${contactForm})` }}>
          <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#274d4d] font-bold text-center mb-6 mt-20 -ml-[8rem] sm:-text-xl md:ml-2 lg:-ml-32 xl:mt-40 xl:mr-48">Contact Us</h2>
          <ContactForm />
        </section>
      )}

      {/* Footer */}
      <footer className=" bg-[#719191]  py-4 text-white sm:w-[320px] sm:h-[930px] md:w-full md:h-24">
      <div className="mx-auto text-center sm:px-4 sm:py-20 md:px-3 md:py-5 xl:py-3 ">
        <p className="text-base sm:text-sm md:text-3xl ">&copy; 2024 PETUON. All rights reserved.</p>
      </div>
      </footer>

    </div>
  );
};

export default LandingPage;
