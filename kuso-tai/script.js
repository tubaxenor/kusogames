document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('gameArea');
  const target = document.getElementById('target');
  const scoreDisplay = document.getElementById('score');
  const startButton = document.getElementById('startButton');

  let score = 0;
  let notes = []; // Array to hold note objects
  let gameInterval;
  let noteSpawnInterval;
  let noteSpeed = 3; // Pixels per frame
  let noteIdCounter = 0;
  let isPlaying = false;

  const gameAreaWidth = gameArea.offsetWidth;
  const targetPos = target.offsetLeft + (target.offsetWidth / 2); // Center of the target

  // --- Game Initialization ---
  function initGame() {
    score = 0;
    updateScoreDisplay();
    notes.forEach(note => note.element.remove()); // Clear existing notes from DOM
    notes = []; // Clear notes array
    noteIdCounter = 0;
    isPlaying = true;
    startButton.disabled = true;

    gameInterval = requestAnimationFrame(gameLoop);
    // Start spawning notes (very basic for now)
    noteSpawnInterval = setInterval(spawnNote, 1500); // Spawn a note every 1.5 seconds
  }

  // --- Game Loop ---
  function gameLoop() {
    if (!isPlaying) return;

    moveNotes();
    checkMisses();

    gameInterval = requestAnimationFrame(gameLoop);
  }

  // --- Note Management ---
  function spawnNote() {
    if (!isPlaying) return;

    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    // For now, only spawn 'don' notes
    noteElement.classList.add('don');
    noteElement.style.right = '-50px'; // Start off-screen to the right
    // noteElement.style.top = `${gameArea.offsetHeight / 2 - 25}px`; // Centered vertically

    const note = {
      id: noteIdCounter++,
      element: noteElement,
      type: 'don', // Could be 'don' or 'ka' in the future
      x: gameAreaWidth + 50, // Initial logical x-position (off-screen right)
    };

    notes.push(note);
    gameArea.appendChild(noteElement);
  }

  function moveNotes() {
    notes.forEach(note => {
      note.x -= noteSpeed;
      note.element.style.left = `${note.x - (note.element.offsetWidth / 2)}px`;
    });
  }

  function checkMisses() {
    notes = notes.filter(note => {
      if (note.x + (note.element.offsetWidth / 2) < 0) { // Note completely off-screen to the left
        note.element.remove();
        // console.log('Miss!'); // Optional: Add miss feedback
        // decreaseScore(10); // Optional: Penalty for missing
        return false; // Remove from notes array
      }
      return true;
    });
  }

  // --- Input Handling ---
  function handleKeyPress(event) {
    if (!isPlaying) return;

    // Let's use 'F' key for 'don' notes for now
    if (event.key.toUpperCase() === 'F') {
      checkHit('don');
    }
    // Example for 'J' key for 'ka' notes (if you implement them)
    // if (event.key.toUpperCase() === 'J') {
    //     checkHit('ka');
    // }
  }

  function checkHit(noteType) {
    const hittableZone = {
      min: targetPos - (target.offsetWidth / 2) - 15, // A bit of leeway
      max: targetPos + (target.offsetWidth / 2) + 15,
    };

    let hitOccurred = false;
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const noteCenter = note.x;

      // Check if the correct type of note is in the hittable zone
      if (note.type === noteType && noteCenter > hittableZone.min && noteCenter < hittableZone.max) {
        // Hit!
        score += 100;
        updateScoreDisplay();
        note.element.remove();
        notes.splice(i, 1); // Remove from array
        hitOccurred = true;
        // console.log('Hit!'); // Optional: Add hit feedback
        break; // Assume one hit per key press
      }
    }
    if (!hitOccurred) {
      // Optional: penalty for pressing key when no note is there
      // score -= 10;
      // updateScoreDisplay();
      // console.log("Empty hit!");
    }
  }

  // --- Score Management ---
  function updateScoreDisplay() {
    scoreDisplay.textContent = score;
  }

  // --- Event Listeners ---
  startButton.addEventListener('click', initGame);
  document.addEventListener('keydown', handleKeyPress);

  // Optional: Clean up intervals when window is unloaded (e.g., navigating away)
  window.addEventListener('beforeunload', () => {
    isPlaying = false;
    if (gameInterval) cancelAnimationFrame(gameInterval);
    if (noteSpawnInterval) clearInterval(noteSpawnInterval);
  });
});
