/* assets\js\app.js */
// Main application orchestrator.
import { getSongById } from './services/dataService.js';
import * as engine from './modules/visualizerEngine.js';
import { setupEventListeners } from './modules/eventManager.js';

async function main() {
    console.log("DEBUG: app.js - Application starting.");

    // Get song ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('songId');

    if (!songId) {
        console.error("DEBUG: app.js - No songId found in URL. Cannot proceed.");
        document.body.innerHTML = '<p class="text-red-500 text-center mt-10">Error: No se ha especificado una canción. <a href="index.html" class="text-blue-400">Volver a la selección</a></p>';
        return;
    }

    console.log(`DEBUG: app.js - Found songId: ${songId}.`);

    const songData = await getSongById(songId);

    if (!songData) {
        console.error(`DEBUG: app.js - Failed to load data for songId: ${songId}.`);
        document.body.innerHTML = `<p class="text-red-500 text-center mt-10">Error: No se pudo cargar la canción "${songId}". <a href="index.html" class="text-blue-400">Volver a la selección</a></p>`;
        return;
    }
    
    // Initialize the visualizer engine with the song data
    engine.init(songData);

    // Attach all user interaction event listeners
    setupEventListeners();

    console.log("DEBUG: app.js - Application initialized successfully.");
}

// Start the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);