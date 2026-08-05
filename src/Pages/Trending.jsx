import { useState, useEffect } from "react";
import { getTrending } from "../Components/Apis";
import MovieCard from "../Components/MovieCard";
import "../css/Home.css";

function Trending() {
    const [movies, setMovies] = useState([]);
    const [timeWindow, setTimeWindow] = useState("week");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getTrending(timeWindow);
            setMovies(data);
            setLoading(false);
        };
        load();
    }, [timeWindow]);

    return (
        <div className="home px-6 md:px-8 py-6">
            <div className="hero-section" style={{ paddingBottom: "2rem" }}>
                <h1 className="hero-title">🔥 Trending Now</h1>
                <p className="hero-subtitle">The most popular movies everyone's watching right now.</p>
                <div className="time-toggle">
                    <button
                        className={`genre-pill ${timeWindow === "day" ? "active" : ""}`}
                        onClick={() => setTimeWindow("day")}
                    >
                        Today
                    </button>
                    <button
                        className={`genre-pill ${timeWindow === "week" ? "active" : ""}`}
                        onClick={() => setTimeWindow("week")}
                    >
                        This Week
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading trending movies...</p>
                </div>
            ) : (
                <div className="px-6 md:px-8 py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {movies.map(movie => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Trending;
