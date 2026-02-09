// 🔐 Load saved progress or initialize
let levels = JSON.parse(localStorage.getItem("gameLevels")) || Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, completed: false, unlocked: i === 0
  }));
  
  let mediumLevels = JSON.parse(localStorage.getItem("mediumGameLevels")) || Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, completed: false, unlocked: i === 0
  }));
  
  let hardLevels = JSON.parse(localStorage.getItem("hardGameLevels")) || Array.from({ length: 12 }, (_, i) => ({
    number: i + 1, completed: false, unlocked: i === 0
  }));
  
  // 🎨 Game constants
  const baseColors = ["red", "blue", "yellow", "green", "purple", "orange", "pink", "teal"];
  const levelGrid = document.querySelector(".level-grid");
  const mediumLevelGrid = document.querySelector(".level-grid-medium");
  const hardLevelGrid = document.querySelector(".level-grid-hard");
  let draggedBlock = null;
  
  // 🔁 Render Easy Levels
  function renderLevels() {
    levelGrid.innerHTML = "";
    levels.forEach(level => {
      const levelBox = document.createElement("div");
      levelBox.className = "level-box";
      levelBox.id = `level-${level.number}`;
      levelBox.innerHTML = level.unlocked
        ? `Level ${level.number}`
        : `<img src="image/lock.webp" class="img" alt="Locked"> Level ${level.number}`;
      if (level.unlocked) levelBox.addEventListener("click", () => launchLevel(level.number));
      if (!level.unlocked) levelBox.classList.add("locked");
      levelGrid.appendChild(levelBox);
    });
  }
  
  // 🔁 Render Medium Levels
  function renderMediumLevels() {
    mediumLevelGrid.innerHTML = "";
    mediumLevels.forEach(level => {
      const levelBox = document.createElement("div");
      levelBox.className = "levelw-box";
      levelBox.id = `medium-level-${level.number}`;
      levelBox.innerHTML = level.unlocked
        ? `Level ${level.number}`
        : `<img src="image/lock.webp" class="img" alt="Locked"> Level ${level.number}`;
      if (level.unlocked) levelBox.addEventListener("click", () => launchMediumLevel(level.number));
      if (!level.unlocked) levelBox.classList.add("locked");
      mediumLevelGrid.appendChild(levelBox);
    });
  }
  
  // 🔁 Render Hard Levels
  function renderHardLevels() {
    hardLevelGrid.innerHTML = "";
    hardLevels.forEach(level => {
      const levelBox = document.createElement("div");
      levelBox.className = "levell-box";
      levelBox.id = `hard-level-${level.number}`;
      levelBox.innerHTML = level.unlocked
        ? `Level ${level.number}`
        : `<img src="image/lock.webp" class="img" alt="Locked"> Level ${level.number}`;
      if (level.unlocked) levelBox.addEventListener("click", () => launchHardLevel(level.number));
      if (!level.unlocked) levelBox.classList.add("locked");
      hardLevelGrid.appendChild(levelBox);
    });
  }
  
  // 🎮 Launch Engine for Any Difficulty
  function launchLevelEngine(levelNumber, levelData, onFinish) {
    let gameArea = document.getElementById("gameArea");
    if (!gameArea) {
      gameArea = document.createElement("div");
      gameArea.id = "gameArea";
      gameArea.className = "game-area";
      document.body.appendChild(gameArea);
    }
  
    const levelColors = baseColors.slice(0, levelNumber);
    const tubesRequired = levelColors.length + 1;
    const filledTubes = tubesRequired - 1;
    const blocksPerTube = levelNumber + 1;
    const totalBlocks = filledTubes * blocksPerTube;
    const blockHeight = 45;
    const tubeHeight = blocksPerTube * blockHeight + 60;
  
    let colorBlocks = [], colorUsage = {};
    while (colorBlocks.length < totalBlocks) {
      const randomColor = levelColors[Math.floor(Math.random() * levelColors.length)];
      colorUsage[randomColor] = (colorUsage[randomColor] || 0) + 1;
      if (colorUsage[randomColor] <= blocksPerTube) colorBlocks.push(randomColor);
    }
  
    colorBlocks.sort(() => Math.random() - 0.5);
  
    let tubesHTML = `<div class="tube-container">`;
    for (let i = 0; i < tubesRequired; i++) {
      tubesHTML += `<div class="tube" id="tube${i}" style="height:${tubeHeight}px;">`;
      if (i < filledTubes) {
        for (let j = 0; j < blocksPerTube; j++) {
          const color = colorBlocks.pop();
          tubesHTML += `<div class="color-block ${color}" draggable="true"></div>`;
        }
      }
      tubesHTML += `</div>`;
    }
    tubesHTML += `</div>`;
  
    gameArea.innerHTML = `
      <h2 class="text-center text-warning">🎮 Playing Level ${levelNumber}</h2>
      <p class="text-center text-light">Group same colors to win!</p>
      ${tubesHTML}
      <button id="finishLevelBtn" class="btn btn-success d-block mx-auto mt-4">Finish</button>
    `;
    gameArea.style.display = "block";
  
    document.getElementById("finishLevelBtn").addEventListener("click", () => {
      if (canFinishLevel()) onFinish(levelNumber);
      else alert("Not yet! Each tube must contain blocks of the same color.");
    });
  
    bindDragAndDropEvents();
  }
  
  // 🎮 Launch Wrappers
  function launchLevel(levelNumber) {
    launchLevelEngine(levelNumber, levels, finishLevel);
  }
  function launchMediumLevel(levelNumber) {
    launchLevelEngine(levelNumber, mediumLevels, finishMediumLevel);
  }
  function launchHardLevel(levelNumber) {
    launchLevelEngine(levelNumber, hardLevels, finishHardLevel);
  }
  
  // 🎯 Finish Handlers
  function finishLevel(levelNumber) {
    document.getElementById("gameArea").style.display = "none";
    levels[levelNumber - 1].completed = true;
    if (levels[levelNumber]) levels[levelNumber].unlocked = true;
    localStorage.setItem("gameLevels", JSON.stringify(levels));
    renderLevels();
  }
  function finishMediumLevel(levelNumber) {
    document.getElementById("gameArea").style.display = "none";
    mediumLevels[levelNumber - 1].completed = true;
    if (mediumLevels[levelNumber]) mediumLevels[levelNumber].unlocked = true;
    localStorage.setItem("mediumGameLevels", JSON.stringify(mediumLevels));
    renderMediumLevels();
  }
  function finishHardLevel(levelNumber) {
    document.getElementById("gameArea").style.display = "none";
    hardLevels[levelNumber - 1].completed = true;
    if (hardLevels[levelNumber]) hardLevels[levelNumber].unlocked = true;
    localStorage.setItem("hardGameLevels", JSON.stringify(hardLevels));
    renderHardLevels();
  }
  
  // 🎯 Drag + Drop
  function bindDragAndDropEvents() {
    const blocks = document.querySelectorAll(".color-block");
    const tubes = document.querySelectorAll(".tube");
    blocks.forEach(block => {
      block.addEventListener("dragstart", () => draggedBlock = block);
    });
    tubes.forEach(tube => {
      tube.addEventListener("dragover", e => e.preventDefault());
      tube.addEventListener("drop", e => {
        e.preventDefault();
        if (draggedBlock && tube !== draggedBlock.parentNode) {
          tube.appendChild(draggedBlock);
          draggedBlock = null;
        }
      });
    });
  }
  
  // 🧠 Victory checker
  function canFinishLevel() {
    const tubes = document.querySelectorAll(".tube");
    return [...tubes].every(tube => {
      const blocks = tube.querySelectorAll(".color-block");
      if (blocks.length === 0) return true;
      const colorClass = [...blocks[0].classList].find(cls => baseColors.includes(cls));
      return [...blocks].every(b => b.classList.contains(colorClass));
    });
  }
  
  // 🟢 Load all grids
  renderLevels();
  renderMediumLevels();
  renderHardLevels();

  

  
  