import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPopularMovies } from "../Components/Apis";

const FALLBACK_SLIDES = [
  {
    id: 653346,
    title: "Kingdom of the Planet of the Apes",
    overview: "One generation after Caesar's reign, apes are the dominant species living harmoniously, while humans have been reduced to living in the shadows.",
    release_date: "2024",
    vote_average: 7.2,
    backdrop_path: "/fqv8VfvShKMWRgOSSp3GIwScSjT.jpg"
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!",
    release_date: "2024",
    vote_average: 7.6,
    backdrop_path: "/stKGOm9Uy92x2m1zGZ7P921R9w.jpg"
  },
  {
    id: 573435,
    title: "Bad Boys: Ride or Die",
    overview: "After their late former Captain is framed, Miami cops Mike Lowrey and Marcus Burnett go on the run to clear his name.",
    release_date: "2024",
    vote_average: 7.5,
    backdrop_path: "/gRAkg8hLMy6vQgCSGZLVywDh9vi.jpg"
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getPopularMovies()
      .then((movies) => {
        if (isMounted && movies && movies.length > 0) {
          const validMovies = movies.filter(m => m.backdrop_path).slice(0, 8);
          if (validMovies.length > 0) {
            setSlides(validMovies);
          }
        }
      })
      .catch((err) => console.error("Failed to load hero carousel movies:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isHovered || slides.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  const getBackdropUrl = (slide) => {
    if (!slide) return "";
    if (slide.backdrop_path) {
      if (slide.backdrop_path.startsWith("http")) return slide.backdrop_path;
      return `https://image.tmdb.org/t/p/w1280${slide.backdrop_path}`;
    }
    return slide.backdropUrl || "";
  };

  return (
    <div
      className="relative w-full h-[65vh] md:h-[75vh] lg:h-[82vh] min-h-[520px] overflow-hidden rounded-3xl mb-8 group shadow-2xl border border-slate-800/80 bg-slate-950"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const bgUrl = getBackdropUrl(slide);
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
              backgroundColor: "#0b0f19"
            }}
          >
            {/* Dark Gradients for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 md:p-16 pb-12 sm:pb-16 md:pb-20 max-w-3xl">
        {/* Rating & Year Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs sm:text-sm backdrop-blur-md shadow-sm">
            ★ {currentSlide?.vote_average ? currentSlide.vote_average.toFixed(1) : "8.5"}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-extrabold text-xs sm:text-sm backdrop-blur-md shadow-sm">
            {currentSlide?.release_date?.split("-")[0] || currentSlide?.year || "2026"}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-bold text-xs backdrop-blur-md shadow-sm">
            Nerio Original
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl leading-tight mb-3 tracking-tight break-words">
          {currentSlide?.title || currentSlide?.name}
        </h1>

        {/* Overview */}
        <p className="text-slate-200 text-sm sm:text-base md:text-lg line-clamp-3 sm:line-clamp-4 mb-8 max-w-2xl text-shadow leading-relaxed break-words font-normal">
          {currentSlide?.overview || "Experience high definition ad-free streaming on Nerio Stream."}
        </p>

        {/* Action Buttons: Watch Now & Details */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/movie/${currentSlide.id}`)}
            className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-xl">▶</span> Watch Now
          </button>

          <Link
            to={`/movie/${currentSlide.id}`}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-base backdrop-blur-md transition-all hover:scale-105"
          >
            <span className="text-lg">ℹ️</span> Details
          </Link>
        </div>

        {/* Pagination Progress Indicators */}
        <div className="flex items-center gap-2.5 mt-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentIndex ? "w-10 bg-indigo-500 shadow-md shadow-indigo-500/50" : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Manual Navigation Arrow Buttons */}
      <div className="absolute bottom-10 right-8 sm:right-12 z-30 hidden sm:flex items-center gap-3">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-950/70 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-950/70 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          ❯
        </button>
      </div>
    </div>
  );
}
