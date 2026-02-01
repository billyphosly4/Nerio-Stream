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