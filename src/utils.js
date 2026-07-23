export const getContinueWatching = () => {
    try {
        const data = localStorage.getItem("continue_watching");
        if (data) return JSON.parse(data);
        
        // Mock data to ensure the UI is visible immediately
        const mockData = [
            { showId: 1399, showName: "Game of Thrones", posterPath: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", seasonNum: 1, episodeNum: 1, episodeName: "Winter Is Coming" },
            { showId: 1396, showName: "Breaking Bad", posterPath: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg", seasonNum: 5, episodeNum: 14, episodeName: "Ozymandias" }
        ];
        localStorage.setItem("continue_watching", JSON.stringify(mockData));
        return mockData;
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
