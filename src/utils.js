export const getContinueWatching = () => {
    try {
        const data = localStorage.getItem("continue_watching");
        if (data) return JSON.parse(data);

        return [];
    } catch (e) {
        return [];
    }
};

export const saveContinueWatching = (item) => {
    let list = getContinueWatching();
    list = list.filter(i => i.showId !== item.showId); // Remove existing entry for the same show
    list.unshift(item); // Add to the top
    localStorage.setItem("continue_watching", JSON.stringify(list.slice(0, 10))); // Keep last 10
};

export const getWatchedEpisodes = (showId) => {
    try {
        const data = localStorage.getItem(`watched_${showId}`);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const markEpisodeWatched = (showId, seasonNum, episodeNum) => {
    let list = getWatchedEpisodes(showId);
    const epId = `${seasonNum}-${episodeNum}`;
    if (!list.includes(epId)) {
        list.push(epId);
        localStorage.setItem(`watched_${showId}`, JSON.stringify(list));
    }
};

export const getCustomStreamUrl = (id) => {
    try {
        const streams = JSON.parse(localStorage.getItem("nerio_custom_streams") || "{}");
        return streams[id] || null;
    } catch {
        return null;
    }
};

export const saveCustomStreamUrl = (id, url) => {
    try {
        const streams = JSON.parse(localStorage.getItem("nerio_custom_streams") || "{}");
        streams[id] = url;
        localStorage.setItem("nerio_custom_streams", JSON.stringify(streams));
    } catch (e) {
        console.error("Failed to save custom stream:", e);
    }
};

