const API_KEY = "c9bff9d37b7004fbd0de5008cbd01501";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        const msg = `Request failed (${res.status}): ${txt}`;
        throw new Error(msg);
    }
    return res.json();
}

export const getPopularMovies = async (page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        return data.results || [];
    } catch (err) {
        console.error('getPopularMovies error:', err);
        return [];
    }
};

export const searchMovies = async (query, page = 1) => {
    if (!query) return [];
    try {
        const data = await fetchJSON(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        );
        return data.results || [];
    } catch (err) {
        console.error('searchMovies error:', err);
        return [];
    }
};

export const getGenres = async () => {
    try {
        const data = await fetchJSON(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        return data.genres || [];
    } catch (err) {
        console.error('getGenres error:', err);
        return [];
    }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        return data.results || [];
    } catch (err) {
        console.error('getMoviesByGenre error:', err);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
        return data;
    } catch (err) {
        console.error('getMovieDetails error:', err);
        return null;
    }
};

export const getSimilarMovies = async (movieId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
        return data.results || [];
    } catch (err) {
        console.error('getSimilarMovies error:', err);
        return [];
    }
};

export const getTrending = async (timeWindow = 'week') => {
    try {
        const data = await fetchJSON(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`);
        return data.results || [];
    } catch (err) {
        console.error('getTrending error:', err);
        return [];
    }
};

export const getTVShows = async (page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
        return data.results || [];
    } catch (err) {
        console.error('getTVShows error:', err);
        return [];
    }
};