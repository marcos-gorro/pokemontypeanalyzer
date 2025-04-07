// Complete Pokémon Type Calculator Script
const typeChart = {
  Normal: { Fighting: 2, Ghost: 0 },
  Fire: { Fire: 0.5, Water: 2, Grass: 0.5, Ground: 2, Bug: 0.5, Rock: 2, Steel: 0.5, Ice: 0.5, Fairy: 0.5 },
  Water: { Fire: 0.5, Water: 0.5, Grass: 2, Electric: 2, Ground: 0.5, Rock: 0.5, Ice: 0.5 },
  Electric: { Electric: 0.5, Ground: 2, Flying: 0.5, Steel: 0.5 },
  Grass: { Fire: 2, Water: 0.5, Grass: 0.5, Electric: 0.5, Ice: 2, Poison: 2, Ground: 0.5, Flying: 2, Bug: 2 },
  Ice: { Fire: 2, Ice: 0.5, Fighting: 2, Rock: 2, Steel: 2 },
  Fighting: { Flying: 2, Psychic: 2, Fairy: 2, Rock: 0.5, Bug: 0.5, Dark: 0.5 },
  Poison: { Ground: 2, Psychic: 2, Grass: 0.5, Fighting: 0.5, Poison: 0.5, Bug: 0.5, Fairy: 0.5 },
  Ground: { Water: 2, Grass: 2, Ice: 2, Electric: 0, Poison: 0.5, Rock: 0.5 },
  Flying: { Electric: 2, Ice: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Bug: 0.5, Ground: 0 },
  Psychic: { Bug: 2, Dark: 2, Ghost: 2, Fighting: 0.5, Psychic: 0.5 },
  Bug: { Fire: 2, Flying: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Ground: 0.5 },
  Rock: { Water: 2, Grass: 2, Fighting: 2, Ground: 2, Steel: 2, Fire: 0.5, Normal: 0.5, Flying: 0.5, Poison: 0.5 },
  Ghost: { Ghost: 2, Dark: 2, Psychic: 0, Bug: 0.5, Poison: 0.5 },
  Dragon: { Dragon: 2, Fairy: 2, Ice: 2, Fire: 0.5, Water: 0.5, Grass: 0.5, Electric: 0.5 },
  Dark: { Fighting: 2, Bug: 2, Fairy: 2, Ghost: 0.5, Dark: 0.5, Psychic: 0 },
  Steel: { Fire: 2, Fighting: 2, Ground: 2, Normal: 0.5, Grass: 0.5, Ice: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 0.5, Dragon: 0.5, Steel: 0.5, Fairy: 0.5 },
  Fairy: { Poison: 2, Steel: 2, Fighting: 0.5, Bug: 0.5, Dark: 0.5, Dragon: 0 },
  
  // Offensive matchups (what moves are strong/weak against)
  offensiveEffects: {
    Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
    Fire: {Grass: 2, Ice: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock:0.5, Dragon: 0.5},
    Water: {Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5},
    Grass: {Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Dragon: 0.5},
    Electric: {Water: 2, Flying: 2, Grass: 0.5, Electric: 0.5, Dragon: 0.5, Groud: 0},
    Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Ice: 0.5, Water: 0.5, Steel: 0.5 },
    Fighting: { Normal: 2, Flying: 0.5, Poison: 0.5, Rock: 2, Bug: 0.5, Ghost: 0, Steel: 2, Psychic: 0.5, Ice: 2, Dark: 2, Fairy: 0.5 },
    Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0},
    Ground: {Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0},
    Flying: {Grass: 2, Fighthing: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5},
    Psychic: {Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0},
    Bug: {Grass: 2, Psychic: 2, Dark: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5},
    Rock: {Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5},
    Ghost: {Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0},
    Dragon: {Dragon: 2, Steel: 0.5, Fairy: 0},
    Dark: {Psychic: 2, Ghost: 2, Fighthing: 0.5, Dark: 0.5, Fairy: 0.5},
    Steel: {Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5},
    Fairy: { Fighting: 2, Poison: 0.5, Steel: 0.5, Fire: 0.5, Dragon: 0, Dark: 2 }
  }
};

// Special cases for dual-type combinations
const specialCases = {
  'Ground-Dragon': { Fairy: 2 },
  'Dark-Ghost': { Fairy: 1 },
  'Electric-Flying': { Ground: 0 },
  'Normal-Ghost': { Fighting: 0, Ghost: 0 },
  'Steel-Fairy': { Poison: 0 }
};

// All available types (excluding offensiveEffects)
const allTypes = Object.keys(typeChart).filter(type => type !== 'offensiveEffects');

// DOM Elements
const singleTypeBtn = document.getElementById('singleTypeBtn');
const dualTypeBtn = document.getElementById('dualTypeBtn');
const singleTypeSelect = document.getElementById('singleTypeSelect');
const firstTypeSelect = document.getElementById('firstTypeSelect');
const secondTypeSelect = document.getElementById('secondTypeSelect');
const singleTypeResults = document.getElementById('singleTypeResults');
const dualTypeResults = document.getElementById('dualTypeResults');
const randomSingleType = document.getElementById('randomSingleType');
const randomDualType = document.getElementById('randomDualType');
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const singleTypePokemonBtn = document.getElementById('singleTypePokemonBtn');
const dualTypePokemonBtn = document.getElementById('dualTypePokemonBtn');
const singleTypeLink = document.getElementById('singleTypeLink');
const dualTypeLink = document.getElementById('dualTypeLink');

// Initialize the app
function init() {
  populateTypeDropdowns();
  setupEventListeners();
  checkURLForSharedType();
}

function populateTypeDropdowns() {
  allTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    option.className = `type-${type.toLowerCase()}`;
    
    singleTypeSelect.appendChild(option.cloneNode(true));
    firstTypeSelect.appendChild(option.cloneNode(true));
    secondTypeSelect.appendChild(option.cloneNode(true));
  });
}

function setupEventListeners() {
  // Section toggles
  singleTypeBtn.addEventListener('click', showSingleTypeSection);
  dualTypeBtn.addEventListener('click', showDualTypeSection);
  
  // Type selection changes
  singleTypeSelect.addEventListener('change', updateSingleType);
  firstTypeSelect.addEventListener('change', updateDualType);
  secondTypeSelect.addEventListener('change', updateDualType);
  
  // Random buttons
  randomSingleType.addEventListener('click', getRandomSingleType);
  randomDualType.addEventListener('click', getRandomDualType);
  
  // Pokémon buttons
  singleTypeLink.addEventListener('click', (e) => {
    if (!singleTypeSelect.value) e.preventDefault();
  });
  
  dualTypeLink.addEventListener('click', (e) => {
    if (!firstTypeSelect.value || !secondTypeSelect.value) e.preventDefault();
  });

  themeBtn.addEventListener('click', toggleTheme);
}

// Theme functions
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeBtn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}


// Random type generators
function getRandomSingleType() {
  const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
  singleTypeSelect.value = randomType;
  displayTypeEffectiveness(randomType);
  updatePokemonButtons();
  updateHistory();
}

function getRandomDualType() {
  const type1 = allTypes[Math.floor(Math.random() * allTypes.length)];
  let type2 = allTypes[Math.floor(Math.random() * allTypes.length)];
  
  while (type2 === type1) {
    type2 = allTypes[Math.floor(Math.random() * allTypes.length)];
  }
  
  firstTypeSelect.value = type1;
  secondTypeSelect.value = type2;
  displayDualTypeEffectiveness(type1, type2);
  updatePokemonButtons();
  updateHistory();
}

// Type effectiveness calculations
function getTypeEffectiveness(type) {
  return typeChart[type] || {};
}

function getDualTypeEffectiveness(type1, type2) {
  const effectiveness = {};
  const typeKey = [type1, type2].sort().join('-');
  
  // Standard calculation
  for (const attackType in typeChart) {
    if (attackType === 'offensiveEffects') continue;
    
    const mult1 = typeChart[type1][attackType] || 1;
    const mult2 = typeChart[type2][attackType] || 1;
    effectiveness[attackType] = mult1 * mult2;
  }
  
  // Apply special cases
  if (specialCases[typeKey]) {
    Object.assign(effectiveness, specialCases[typeKey]);
  }
  
  // Apply immunity overrides
  return applyImmunityOverrides(type1, type2, effectiveness);
}

function applyImmunityOverrides(type1, type2, effectiveness) {
  // Flying immunity to Ground
  if (type1 === 'Flying' || type2 === 'Flying') {
    effectiveness.Ground = 0;
  }
  
  // Steel resists Fairy
  if ((type1 === 'Steel' || type2 === 'Steel') && effectiveness.Fairy > 0.5) {
    effectiveness.Fairy = 0.5;
  }
  
  return effectiveness;
}

function getOffensiveEffectiveness(attackType) {
  const offensiveMap = typeChart.offensiveEffects[attackType] || {};
  const result = {};
  
  for (const defenseType of allTypes) {
    result[defenseType] = offensiveMap[defenseType] || 1;
  }
  
  return result;
}

function getDualOffensiveEffectiveness(attackType1, attackType2) {
  const offensive1 = getOffensiveEffectiveness(attackType1);
  const offensive2 = getOffensiveEffectiveness(attackType2);
  const combined = {};
  
  for (const defenseType in offensive1) {
    const mult1 = offensive1[defenseType];
    const mult2 = offensive2[defenseType] || 1;
    
    if (mult1 === 0 || mult2 === 0) {
      combined[defenseType] = 0;
    } else {
      combined[defenseType] = Math.max(mult1, mult2);
    }
  }
  
  return combined;
}

// Display functions
function showSingleTypeSection() {
  singleTypeSection.classList.remove('hidden');
  dualTypeSection.classList.add('hidden');
  singleTypeBtn.classList.add('active');
  dualTypeBtn.classList.remove('active');
  updateHistory();
}

function showDualTypeSection() {
  dualTypeSection.classList.remove('hidden');
  singleTypeSection.classList.add('hidden');
  dualTypeBtn.classList.add('active');
  singleTypeBtn.classList.remove('active');
  updateHistory();
}

function updateSingleType() {
  const type = singleTypeSelect.value;
  if (type) {
    displayTypeEffectiveness(type);
    updatePokemonButtons();
    updateHistory();
  }
}

function updateDualType() {
  const type1 = firstTypeSelect.value;
  const type2 = secondTypeSelect.value;
  if (type1 && type2) {
    displayDualTypeEffectiveness(type1, type2);
    updatePokemonButtons();
    updateHistory();
  }
}

function displayTypeEffectiveness(type) {
  const defensive = getTypeEffectiveness(type);
  const offensive = getOffensiveEffectiveness(type);
  
  singleTypeResults.innerHTML = `
    <div class="type-header">
      <h3><span class="type-badge type-${type.toLowerCase()}">${type}</span> Type</h3>
    </div>
    <div class="matchup-section">
      <h4>Defensive (Incoming Attacks)</h4>
      ${createMultiplierGroupsHTML(defensive, false)}
    </div>
    <div class="matchup-section">
      <h4>Offensive (Your Attacks)</h4>
      ${createMultiplierGroupsHTML(offensive, true)}
    </div>
  `;
  
  singleTypePokemonBtn.classList.remove('hidden');
}

function displayDualTypeEffectiveness(type1, type2) {
  const defensive = getDualTypeEffectiveness(type1, type2);
  const offensive = getDualOffensiveEffectiveness(type1, type2);
  
  dualTypeResults.innerHTML = `
    <div class="type-header">
      <h3>
        <span class="type-badge type-${type1.toLowerCase()}">${type1}</span> / 
        <span class="type-badge type-${type2.toLowerCase()}">${type2}</span>
      </h3>
    </div>
    <div class="matchup-section">
      <h4>Defensive (Incoming Attacks)</h4>
      ${createMultiplierGroupsHTML(defensive, false)}
    </div>
    <div class="matchup-section">
      <h4>Offensive (Your Attacks)</h4>
      ${createMultiplierGroupsHTML(offensive, true)}
    </div>
  `;
  
  dualTypePokemonBtn.classList.remove('hidden');
}

function createMultiplierGroupsHTML(effectiveness, isOffensive) {
  const groups = {};
  
  for (const [type, mult] of Object.entries(effectiveness)) {
    const rounded = parseFloat(mult.toFixed(2));
    if (!groups[rounded]) groups[rounded] = [];
    groups[rounded].push(type);
  }
  
  const sorted = Object.entries(groups).sort((a, b) => b[0] - a[0]);
  
  let html = '';
  sorted.forEach(([mult, types]) => {
    const label = getMultiplierLabel(parseFloat(mult), isOffensive);
    const typeList = types.map(type => 
      `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join(' ');
    
    html += `
      <div class="multiplier-group">
        <span class="multiplier-label">${label}:</span>
        <span class="type-list">${typeList}</span>
      </div>
    `;
  });
  
  return html;
}

function getMultiplierLabel(mult, isOffensive) {
  if (mult === 0) return isOffensive ? 'No Effect' : 'Immune';
  if (mult >= 4) return `${mult}x Super`;
  if (mult === 2) return '2x Super';
  if (mult === 1) return 'Neutral';
  if (mult <= 0.25) return '0.25x Not';
  if (mult === 0.5) return '0.5x Not';
  return `${mult}x`;
}

// Pokémon Button functionality
function updatePokemonButtons() {
  // Single type button
  const singleType = singleTypeSelect.value.toLowerCase();
  if (singleType) {
    singleTypeLink.href = `https://www.serebii.net/pokemon/type/${singleType}`;
    singleTypePokemonBtn.classList.remove('hidden');
  } else {
    singleTypePokemonBtn.classList.add('hidden');
  }
  
  // Dual type button
  const type1 = firstTypeSelect.value;
  const type2 = secondTypeSelect.value;
  if (type1 && type2) {
    dualTypeLink.href = `https://pokemondb.net/pokedex/all?type=${type1.toLowerCase()}&type2=${type2.toLowerCase()}`;
    dualTypePokemonBtn.classList.remove('hidden');
  } else {
    dualTypePokemonBtn.classList.add('hidden');
  }
}

// URL handling
function checkURLForSharedType() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('type')) {
    const type = urlParams.get('type');
    if (allTypes.includes(type)) {
      singleTypeSelect.value = type;
      showSingleTypeSection();
      displayTypeEffectiveness(type);
    }
  } else if (urlParams.has('type1') && urlParams.has('type2')) {
    const type1 = urlParams.get('type1');
    const type2 = urlParams.get('type2');
    if (allTypes.includes(type1) && allTypes.includes(type2)) {
      firstTypeSelect.value = type1;
      secondTypeSelect.value = type2;
      showDualTypeSection();
      displayDualTypeEffectiveness(type1, type2);
    }
  }
}

function updateHistory() {
  const url = new URL(window.location.href);
  
  if (!singleTypeSection.classList.contains('hidden')) {
    const type = singleTypeSelect.value;
    if (type) {
      url.searchParams.set('type', type);
      url.searchParams.delete('type1');
      url.searchParams.delete('type2');
    }
  } else {
    const type1 = firstTypeSelect.value;
    const type2 = secondTypeSelect.value;
    if (type1 && type2) {
      url.searchParams.set('type1', type1);
      url.searchParams.set('type2', type2);
      url.searchParams.delete('type');
    }
  }
  
  history.pushState({}, '', url.toString());
}

// Initialize the app when DOM loads
document.addEventListener('DOMContentLoaded', init);

// Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
