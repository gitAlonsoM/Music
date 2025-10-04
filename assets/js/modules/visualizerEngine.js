/* assets\js\modules\visualizerEngine.js */
// Contains the core state and logic for playback.
import * as ui from './uiController.js';

let state = {
    isPlaying: false,
    currentMeasureIndex: 0,
    speed: 0.7, // Slower default speed
    animationInterval: null,
    measures: [],
    isColorsActive: false,
    isNumbersActive: false
};

/**
 * Initializes the engine with song data.
 * @param {Object} songData - The full song data object.
 */
export function init(songData) {
    console.log("DEBUG: visualizerEngine.init() - Initializing with new song data.", songData);
    state.measures = songData.measures;
    state.currentMeasureIndex = 0;
    state.isPlaying = false;
    clearInterval(state.animationInterval);
    state.animationInterval = null;
    
   // Set initial speed from song data, or use the default value from the state
    state.speed = songData.recommendedSpeed || state.speed;
    console.log(`DEBUG: visualizerEngine.init() - Initial speed set to ${state.speed}.`);

    ui.setSongTitle(songData.title);
    ui.renderMeasures(state.measures);
    ui.togglePlayPauseIcon(false);
    ui.updateSpeedSlider(state.speed); // Update the slider's position
    ui.updateSpeedLabel(state.speed); // Update the speed label text
    
    // Re-apply toggle states if they were active
    ui.toggleNoteColors(state.isColorsActive);
    ui.toggleMeasureNumbers(state.isNumbersActive);
}

function play() {
    if (state.isPlaying) return;
    
    // If at the end, reset before playing again
    if (state.currentMeasureIndex >= state.measures.length - 1) {
        reset();
    }
    
    state.isPlaying = true;
    ui.togglePlayPauseIcon(true);
    console.log("DEBUG: visualizerEngine.play() - Playback started.");

    const intervalTime = (1 / state.speed) * 1000;
    state.animationInterval = setInterval(() => {
        if (state.currentMeasureIndex < state.measures.length - 1) {
            state.currentMeasureIndex++;
            ui.updateActiveMeasure(state.currentMeasureIndex);
        } else {
            pause(); // End of song
            console.log("DEBUG: visualizerEngine - Reached end of song.");
        }
    }, intervalTime);
}

function pause() {
    if (!state.isPlaying) return;
    state.isPlaying = false;
    clearInterval(state.animationInterval);
    state.animationInterval = null;
    ui.togglePlayPauseIcon(false);
    console.log("DEBUG: visualizerEngine.pause() - Playback paused.");
}

export function togglePlayPause() {
    console.log("DEBUG: visualizerEngine.togglePlayPause() called.");
    if (state.isPlaying) {
        pause();
    } else {
        play();
    }
}

export function reset() {
    console.log("DEBUG: visualizerEngine.reset() called.");
    pause();
    state.currentMeasureIndex = 0;
    ui.updateActiveMeasure(state.currentMeasureIndex);
}

export function seek(index) {
    const newIndex = parseInt(index);
    if (isNaN(newIndex) || newIndex < 0 || newIndex >= state.measures.length) return;
    
    console.log(`DEBUG: visualizerEngine.seek() - Seeking to index ${newIndex}.`);
    const wasPlaying = state.isPlaying;
    if (wasPlaying) pause();
    
    state.currentMeasureIndex = newIndex;
    ui.updateActiveMeasure(state.currentMeasureIndex);
}

export function changeSpeed(newSpeed) {
    state.speed = newSpeed;
    ui.updateSpeedLabel(state.speed);
    console.log(`DEBUG: visualizerEngine.changeSpeed() - Speed changed to ${state.speed}.`);
    
    if (state.isPlaying) {
        pause();
        play();
    }
}

export function step(direction) {
    let newIndex = state.currentMeasureIndex + direction;
    // Clamp index within bounds
    newIndex = Math.max(0, Math.min(state.measures.length - 1, newIndex));
    seek(newIndex);
}

export function toggleColors() {
    state.isColorsActive = !state.isColorsActive;
    console.log(`DEBUG: visualizerEngine.toggleColors() - Colors active: ${state.isColorsActive}.`);
    ui.toggleNoteColors(state.isColorsActive);
}

export function toggleNumbers() {
    state.isNumbersActive = !state.isNumbersActive;
    console.log(`DEBUG: visualizerEngine.toggleNumbers() - Numbers active: ${state.isNumbersActive}.`);
    ui.toggleMeasureNumbers(state.isNumbersActive);
}


/**
 * Exposes the current state for other modules to read.
 * @returns {Object} The current state object.
 */
export function getState() {
    // This provides read-only access to the state for external modules.
    return state;
}