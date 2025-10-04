/* assets\js\modules\uiController.js */
// Manages all direct DOM interactions.

// Centralized DOM element references
const elements = {
    songTitle: document.getElementById('song-title'),
    noteContainer: document.getElementById('note-container'),
    visualizer: document.getElementById('visualizer'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    speedSlider: document.getElementById('speed-slider'), 
    speedValue: document.getElementById('speed-value'),
    progressSlider: document.getElementById('progress-slider'),
    toggleColorsBtn: document.getElementById('toggle-colors-btn'),
    toggleNumbersBtn: document.getElementById('toggle-numbers-btn'),
};

const noteColorMap = {
    'Do': 'color-Do', 'Re': 'color-Re', 'Mi': 'color-Mi', 'Fa': 'color-Fa',
    'Sol': 'color-Sol', 'La': 'color-La', 'Si': 'color-Si'
};

let measureHeight = 0;

/**
 * Renders all measure elements into the DOM.
 * @param {Array<Array<string>>} measures - The array of measures for the song.
 */
export function renderMeasures(measures) {
    console.log("DEBUG: uiController.renderMeasures() - Starting measure rendering.");
    const visualizerHeight = elements.visualizer.offsetHeight;
    measureHeight = visualizerHeight / 3; // Show current, next, and previous
    const offset = visualizerHeight / 2 - measureHeight / 2;

    elements.noteContainer.innerHTML = '';
    elements.noteContainer.style.transform = `translateY(${offset}px)`;

    measures.forEach((measure, index) => {
        const measureEl = document.createElement('div');
        measureEl.className = 'measure';
        measureEl.style.height = `${measureHeight}px`;
        measureEl.dataset.index = index;

        // Add measure number element
        const numberEl = document.createElement('span');
        numberEl.className = 'measure-number';
        numberEl.textContent = index + 1;
        measureEl.appendChild(numberEl);

        measure.forEach(noteText => {
            const noteEl = document.createElement('span');
            noteEl.className = 'note';
            noteEl.textContent = noteText;
            measureEl.appendChild(noteEl);
        });
        elements.noteContainer.appendChild(measureEl);
    });

    elements.progressSlider.max = measures.length - 1;
    console.log(`DEBUG: uiController.renderMeasures() - Rendered ${measures.length} measures.`);
    updateActiveMeasure(0); // Set initial active measure
}


/**
 * Updates the visual display to center on the current measure.
 * @param {number} currentMeasureIndex - The index of the measure to activate.
 */
export function updateActiveMeasure(currentMeasureIndex) {
    const offset = elements.visualizer.offsetHeight / 2 - measureHeight / 2;
    const newY = offset - (currentMeasureIndex * measureHeight);
    elements.noteContainer.style.transform = `translateY(${newY}px)`;

    document.querySelectorAll('.measure').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.index) === currentMeasureIndex);
    });
    
    if (document.activeElement !== elements.progressSlider) {
        elements.progressSlider.value = currentMeasureIndex;
    }
}

/**
 * Toggles the visibility of play/pause icons.
 * @param {boolean} isPlaying - The current playing state.
 */
export function togglePlayPauseIcon(isPlaying) {
    elements.playIcon.classList.toggle('hidden', isPlaying);
    elements.pauseIcon.classList.toggle('hidden', !isPlaying);
    console.log(`DEBUG: uiController.togglePlayPauseIcon() - Set state to ${isPlaying ? 'playing' : 'paused'}.`);
}

/**
 * Updates the speed value display.
 * @param {number} speed - The new playback speed.
 */
export function updateSpeedLabel(speed) {
    elements.speedValue.textContent = parseFloat(speed).toFixed(2);
}

/**
 * Updates the speed slider's visual position.
 * @param {number} speed - The new playback speed.
 */
export function updateSpeedSlider(speed) {
    if (elements.speedSlider) {
        elements.speedSlider.value = speed;
        console.log(`DEBUG: uiController.updateSpeedSlider() - Set slider value to ${speed}.`);
    }
}

/**
 * Applies or removes color classes from notes.
 * @param {boolean} shouldColor - Whether to apply colors.
 */
export function toggleNoteColors(shouldColor) {
    console.log(`DEBUG: uiController.toggleNoteColors() - Setting colors to ${shouldColor}.`);
    elements.toggleColorsBtn.classList.toggle('active', shouldColor);
    document.querySelectorAll('.note').forEach(noteEl => {
        const noteName = noteEl.textContent.replace(/♯|♭/g, '');
        const colorClass = noteColorMap[noteName];
        
        if (shouldColor && colorClass) {
            noteEl.classList.add(colorClass);
        } else {
            // Remove all possible color classes
            Object.values(noteColorMap).forEach(c => noteEl.classList.remove(c));
        }
    });
}

/**
 * Shows or hides the measure numbers.
 * @param {boolean} shouldShow - Whether to show the numbers.
 */
export function toggleMeasureNumbers(shouldShow) {
    console.log(`DEBUG: uiController.toggleMeasureNumbers() - Setting numbers visibility to ${shouldShow}.`);
    elements.toggleNumbersBtn.classList.toggle('active', shouldShow);
    elements.visualizer.classList.toggle('show-numbers', shouldShow);
}

/**
 * Updates the song title display.
 * @param {string} title - The title of the song.
 */
export function setSongTitle(title) {
    elements.songTitle.textContent = title;
}

/**
 * Returns the height of a single measure element.
 * @returns {number} The height in pixels.
 */
export function getMeasureHeight() {
    return measureHeight;
}