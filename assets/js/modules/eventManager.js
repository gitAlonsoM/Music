/* assets\js\modules\eventManager.js */
// Centralizes all event listener attachments.
import * as engine from './visualizerEngine.js';
import * as ui from './uiController.js';

export function setupEventListeners() {
    console.log("DEBUG: eventManager.setupEventListeners() - Attaching all event listeners.");
    const playPauseBtn = document.getElementById('play-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedSlider = document.getElementById('speed-slider');
    const progressSlider = document.getElementById('progress-slider');
    const toggleColorsBtn = document.getElementById('toggle-colors-btn');
    const toggleNumbersBtn = document.getElementById('toggle-numbers-btn');

    playPauseBtn.addEventListener('click', () => {
        console.log("DEBUG: Event triggered: playPauseBtn click.");
        engine.togglePlayPause();
    });

    resetBtn.addEventListener('click', () => {
        console.log("DEBUG: Event triggered: resetBtn click.");
        engine.reset();
    });

    speedSlider.addEventListener('input', (e) => {
        // No log here to avoid flooding the console
        engine.changeSpeed(e.target.value);
    });
    // Log only when user finishes dragging
    speedSlider.addEventListener('change', (e) => {
        console.log(`DEBUG: Event triggered: speedSlider change, value: ${e.target.value}.`);
    });


    progressSlider.addEventListener('input', (e) => {
        // The log is inside the seek function to avoid flooding
        engine.seek(e.target.value);
    });
     progressSlider.addEventListener('change', (e) => {
        console.log(`DEBUG: Event triggered: progressSlider change, value: ${e.target.value}.`);
    });

    toggleColorsBtn.addEventListener('click', () => {
        console.log("DEBUG: Event triggered: toggleColorsBtn click.");
        engine.toggleColors();
    });

    toggleNumbersBtn.addEventListener('click', () => {
        console.log("DEBUG: Event triggered: toggleNumbersBtn click.");
        engine.toggleNumbers();
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        console.log(`DEBUG: Event triggered: keydown, key: ${e.code}.`);
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll
            engine.togglePlayPause();
        } else if (e.code === 'ArrowUp') {
            e.preventDefault();
            engine.step(-1); // Go to previous measure
        } else if (e.code === 'ArrowDown') {
            e.preventDefault();
            engine.step(1); // Go to next measure
        } else if (e.code === 'Home') {
            e.preventDefault();
            engine.reset();
        }
    });

    // Re-render on resize to adjust measure heights
    window.addEventListener('resize', () => {
        console.log("DEBUG: Event triggered: window resize.");
        ui.renderMeasures(engine.getState().measures); // This needs a way to get measures
    });
    
    console.log("DEBUG: eventManager.setupEventListeners() - All listeners attached.");
}