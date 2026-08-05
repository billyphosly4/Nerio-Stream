// ...existing code...
import React from "react";
import { useMovieContext } from "../Contexts/MovieContexts";
import MovieCard from "../Components/MovieCard";
import "../css/Favourites.css";

function Favourites() {
    const { favorites } = useMovieContext();

    // added guard to avoid runtime error if favorites is undefined or not an array
    if (!Array.isArray(favorites) || favorites.length === 0) {
        return (
            <div className="favourites-empty">
                <h2>No favorites yet</h2>
                <p>Start adding movies to your favorites and they will appear here!</p>
            </div>
        );
    }

    if (favorites.length > 0) {
        return (
            <div className="favorites px-6 md:px-8 py-6">
                <h2>Your Favorites</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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