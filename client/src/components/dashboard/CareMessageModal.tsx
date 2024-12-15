import { useState } from "react";

const CareMessageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // To track the current slide index
  const slides = [
    {
      title: "Pet Evolution",
      content: "Your pet is at its 1st evolution rank. It can evolve further if you feed it and fill its growth bar.",
    },
    {
      title: "Earn Coins with Flashcards",
      content: "Earn coins daily by using the flashcards from the daily rewards. Complete tasks to help your pet!",
    },
    {
      title: "Take Care of Your Pet",
      content: "Treat your pet as your own child. Keep them happy and healthy by feeding them regularly and completing tasks.",
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{slides[currentSlide].title}</h2>
          <p className="mb-4">{slides[currentSlide].content}</p>

          <div className="flex justify-center mb-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 mx-1 rounded-full ${
                  currentSlide === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              className="bg-gray-300 text-white rounded-lg py-2 px-4"
              onClick={handlePreviousSlide}
              disabled={currentSlide === 0}
            >
              Previous
            </button>

            <button
              className="bg-blue-500 text-white rounded-lg py-2 px-4"
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </button>
          </div>

          {currentSlide === slides.length - 1 && (
            <div className="mt-4 text-center">
              <button
                className="bg-green-500 text-white rounded-lg py-2 px-4"
                onClick={onClose}
              >
                Start Taking Care of Your Pet!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareMessageModal;
