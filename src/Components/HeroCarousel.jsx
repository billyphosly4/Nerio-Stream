import { useState, useEffect } from 'react';

const exampleSlides = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: "2024",
    tags: ["Action", "Adventure", "Sci-Fi"],
    backdropUrl: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsozsPbHOZ.jpg"
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: "2023",
    tags: ["Biography", "Drama", "History"],
    backdropUrl: "https://image.tmdb.org/t/p/original/rMvPXy8PUjj1o8o1pzgQbdNC39M.jpg"
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: "2023",
    tags: ["Animation", "Action", "Adventure"],
    backdropUrl: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg"
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % exampleSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % exampleSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + exampleSlides.length) % exampleSlides.length);
  };

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl mb-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {exampleSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ backgroundImage: `url(${slide.backdropUrl})` }}
        >
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#06080e]/90 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-10 md:left-16 z-20 flex flex-col gap-3 sm:gap-4 max-w-2xl px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
          {exampleSlides[currentIndex].title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white font-semibold text-lg">{exampleSlides[currentIndex].year}</span>
          <div className="flex flex-wrap items-center gap-2">
            {exampleSlides[currentIndex].tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-medium text-white shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pagination Bars */}
        <div className="flex items-center gap-2 mt-4">
          {exampleSlides.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Circular Nav Buttons */}
      <div className="absolute bottom-12 right-10 md:right-16 z-20 hidden sm:flex items-center gap-4">
        <button 
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-white/20 transition-all text-xl"
        >
          &#10094;
        </button>
        <button 
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-white/20 transition-all text-xl"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
