import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../Components/MovieCard";
import "./css/Favourites.css";

function Favourites() {
    const { favorites } = useMovieContext();

    if (favorites.length > 0) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movie-grid">
                    {favorites.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="favourites-empty">
            <h2>No favorites yet</h2>
            <p>Start adding movies to your favorites and they will appear here!</p>
        </div>
    );
}
export default Favourites;