const API_KEY = "c9bff9d37b7004fbd0de5008cbd01501";
const BASE_URL = "https://api.themoviedb.org/3";

// ─── Embed URLs (vidsrc.to) ────────────────────────────────────────────────
export const getMovieEmbedUrl = (tmdbId) =>
    `https://vidsrc.to/embed/movie/${tmdbId}`;

export const getTVEpisodeEmbedUrl = (tmdbId, season, episode) =>
    `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;

// ─── Helpers ──────────────────────────────────────────────────────────────
async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Request failed (${res.status}): ${txt}`);
    }
    return res.json();
}

// ─── Movies ───────────────────────────────────────────────────────────────
export const getPopularMovies = async (page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const searchMovies = async (query, page = 1) => {
    if (!query) return [];
    try {
        const data = await fetchJSON(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const getGenres = async () => {
    try {
        const data = await fetchJSON(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        return data.genres || [];
    } catch (err) { console.error(err); return []; }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const getMovieDetails = async (movieId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
        return data;
    } catch (err) { console.error(err); return null; }
};

export const getSimilarMovies = async (movieId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const getTrending = async (timeWindow = 'week') => {
    try {
        const data = await fetchJSON(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

// ─── TV Shows ─────────────────────────────────────────────────────────────
export const getTVShows = async (page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const searchTV = async (query, page = 1) => {
    if (!query) return [];
    try {
        const data = await fetchJSON(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const getTVDetails = async (tvId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos`);
        return data;
    } catch (err) { console.error(err); return null; }
};

export const getTVSeasonDetails = async (tvId, seasonNumber) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
        return data;
    } catch (err) { console.error(err); return null; }
};

export const getSimilarTV = async (tvId) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

export const getTVGenres = async () => {
    try {
        const data = await fetchJSON(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
        return data.genres || [];
    } catch (err) { console.error(err); return []; }
};

export const getTVByGenre = async (genreId, page = 1) => {
    try {
        const data = await fetchJSON(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        return data.results || [];
    } catch (err) { console.error(err); return []; }
};

// ─── Live Sports (Sportmonks API) ─────────────────────────────────────────
const SPORTMONKS_TOKEN = "Nz1xMD7EinA5zpMSqmzHyMwRyuYkxGPeZUECgCIrrsoBGQjkNs13ts8zyFjE";
const SPORTMONKS_BASE = "https://api.sportmonks.com/v3";

export const getLiveMatchDetails = async (fixtureId = 19427191) => {
    try {
        const url = `${SPORTMONKS_BASE}/football/fixtures/${fixtureId}?api_token=${SPORTMONKS_TOKEN}&include=participants;league;venue;state;scores;events.type;events.period;events.player;statistics.type;sidelined.sideline.player;sidelined.sideline.type;weatherReport`;
        const data = await fetchJSON(url);
        return data.data; // Sportmonks wraps response in 'data'
    } catch (err) {
        console.error("Sportmonks fixture error:", err);
        return null;
    }
};

export const getTeamSquad = async (teamId = 85) => {
    try {
        const url = `${SPORTMONKS_BASE}/football/squads/teams/${teamId}?api_token=${SPORTMONKS_TOKEN}&include=position;detailedPosition;player`;
        const data = await fetchJSON(url);
        return data.data || [];
    } catch (err) {
        console.error("Sportmonks squad error:", err);
        return [];
    }
};

// ─── IPTV (Live TV) ───────────────────────────────────────────────────────
export const getIPTVChannels = async () => {
    try {
        const data = await fetchJSON("https://iptv-org.github.io/api/channels.json");
        return data || [];
    } catch (err) {
        console.error("IPTV Channels error:", err);
        return [];
    }
};

export const getIPTVStreams = async () => {
    try {
        const data = await fetchJSON("https://iptv-org.github.io/api/streams.json");
        return data || [];
    } catch (err) {
        console.error("IPTV Streams error:", err);
        return [];
    }
};