/* assets\js\services\dataService.js */
// Handles all data fetching operations.

/**
 * Fetches the list of all available songs.
 * @returns {Promise<Array|null>} A promise that resolves to an array of song objects or null on error.
 */
export async function getAllSongs() {
    console.log("DEBUG: dataService.getAllSongs() - Fetching song list from /data/songs.json");
    try {
        const response = await fetch('/data/songs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("DEBUG: dataService.getAllSongs() - Successfully fetched and parsed song list.", data);
        return data;
    } catch (error) {
        console.error("DEBUG: dataService.getAllSongs() - Failed to fetch song list:", error);
        return null;
    }
}

/**
 * Fetches the detailed data for a specific song by its ID.
 * @param {string} songId - The unique identifier for the song.
 * @returns {Promise<Object|null>} A promise that resolves to the song data object or null on error.
 */
export async function getSongById(songId) {
    console.log(`DEBUG: dataService.getSongById() - Fetching song data for ID: ${songId}`);
    try {
        const response = await fetch(`/data/${songId}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`DEBUG: dataService.getSongById() - Successfully fetched and parsed song data for ${songId}.`, data);
        return data;
    } catch (error) {
        console.error(`DEBUG: dataService.getSongById() - Failed to fetch song data for ${songId}:`, error);
        return null;
    }
}