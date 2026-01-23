import MovieCard from '../Components/MovieCard'
import { useState } from 'react';
    function Home() {
        const [searchQuery, setSearchQuery] = useState("");

        const movies = [
        { id: 1, title: 'Inception', release_date: 2010},
        { id: 2, title: 'The Dark Knight', release_date: 2008 },
        { id: 3, title: 'Interstellar', release_date: 2014 },
        { id: 4, title: 'Parasite', release_date: 2019 },
        { id: 5, title: 'The Matrix', release_date: 1999 },
        { id: 6, title: 'Pulp Fiction', release_date: 1994 },
        { id: 7, title: 'The Shawshank Redemption', release_date: 1994 },
        { id: 8, title: 'Fight Club', release_date: 1999 },
        { id: 9, title: 'Forrest Gump', release_date: 1994 },
        { id: 10, title: 'The Godfather', release_date: 1972 }, 
    ];
    const handleSearch = (e) => {
        e.preventDefault()
         alert(searchQuery)
    }
  return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="Search for Movies..." 
            className="search-input" value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}/>
        <button type="Submit" className="search-button">Search</button>
        </form>
      <div className="movie-grid">
        {movies.map(
            (movie) => 
         (
         <MovieCard movie={movie} key={movie.id}  />
        )
        )}
      </div>
    </div>
  );
}
export default Home