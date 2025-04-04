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
    Dragon: { Dragon: 2, Fairy: 0, Ice: 2, Fire: 0.5, Water: 0.5, Grass: 0.5, Electric: 0.5 },
    Dark: { Fighting: 2, Bug: 2, Fairy: 2, Ghost: 0.5, Dark: 0.5, Psychic: 0 },
    Steel: { Fire: 2, Fighting: 2, Ground: 2, Normal: 0.5, Grass: 0.5, Ice: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 0.5, Dragon: 0.5, Steel: 0.5, Fairy: 0.5 },
    Fairy: { Poison: 2, Steel: 2, Fighting: 0.5, Bug: 0.5, Dark: 0.5, Dragon: 0 }
  };
  
  // Special cases for dual-type combinations
  const specialCases = {
    'Ground-Dragon': { Fairy: 2 },
    'Dark-Ghost': { Fairy: 1 },
    'Electric-Flying': { Ground: 0 },
    'Normal-Ghost': { Fighting: 0, Ghost: 0 },
    'Steel-Fairy': { Poison: 0 }
  };
  
  // DOM Elements
  const singleTypeBtn = document.getElementById('singleTypeBtn');
  const dualTypeBtn = document.getElementById('dualTypeBtn');
  const singleTypeSelect = document.getElementById('singleTypeSelect');
  const firstTypeSelect = document.getElementById('firstTypeSelect');
  const secondTypeSelect = document.getElementById('secondTypeSelect');
  const singleTypeResults = document.getElementById('singleTypeResults');
  const dualTypeResults = document.getElementById('dualTypeResults');
  const singleTypePokemonBtn = document.getElementById('singleTypePokemonBtn');
  const dualTypePokemonBtn = document.getElementById('dualTypePokemonBtn');
  const singleTypeLink = document.getElementById('singleTypeLink');
  const dualTypeLink = document.getElementById('dualTypeLink');
  
  // Initialize the app
  function init() {
    populateTypeDropdowns();
    setupEventListeners();
    testAllSpecialCases(); // Run tests in console
  }
  
  function populateTypeDropdowns() {
    const types = Object.keys(typeChart);
    
    types.forEach(type => {
      const option1 = document.createElement('option');
      option1.value = type;
      option1.textContent = type;
      option1.className = `type-${type.toLowerCase()}`;
      
      const option2 = option1.cloneNode(true);
      const option3 = option1.cloneNode(true);
      
      singleTypeSelect.appendChild(option1);
      firstTypeSelect.appendChild(option2);
      secondTypeSelect.appendChild(option3);
    });
  }
  
  function setupEventListeners() {
    singleTypeBtn.addEventListener('click', showSingleTypeSection);
    dualTypeBtn.addEventListener('click', showDualTypeSection);
    singleTypeSelect.addEventListener('change', updateSingleType);
    firstTypeSelect.addEventListener('change', updateDualType);
    secondTypeSelect.addEventListener('change', updateDualType);
    // Add to your existing event listeners
document.getElementById('randomSingleType').addEventListener('click', () => {
  const types = Object.keys(typeChart).filter(t => t !== 'offensiveEffects');
  const randomType = types[Math.floor(Math.random() * types.length)];
  singleTypeSelect.value = randomType;
  displayTypeEffectiveness(randomType);
  updatePokemonButtons();
});

document.getElementById('randomDualType').addEventListener('click', () => {
  const types = Object.keys(typeChart).filter(t => t !== 'offensiveEffects');
  let type1 = types[Math.floor(Math.random() * types.length)];
  let type2 = types[Math.floor(Math.random() * types.length)];
  
  // Ensure different types
  while (type2 === type1) {
    type2 = types[Math.floor(Math.random() * types.length)];
  }
  
  firstTypeSelect.value = type1;
  secondTypeSelect.value = type2;
  displayDualTypeEffectiveness(type1, type2);
  updatePokemonButtons();
});

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
  
  // Display functions
  function showSingleTypeSection() {
    document.getElementById('singleTypeSection').classList.remove('hidden');
    document.getElementById('dualTypeSection').classList.add('hidden');
    singleTypeBtn.classList.add('active');
    dualTypeBtn.classList.remove('active');
  }
  
  function showDualTypeSection() {
    document.getElementById('dualTypeSection').classList.remove('hidden');
    document.getElementById('singleTypeSection').classList.add('hidden');
    dualTypeBtn.classList.add('active');
    singleTypeBtn.classList.remove('active');
  }
  
  function updateSingleType() {
    const type = singleTypeSelect.value;
    if (type) {
      displayTypeEffectiveness(type);
      updatePokemonButtons();
    }
  }
  
  function updateDualType() {
    const type1 = firstTypeSelect.value;
    const type2 = secondTypeSelect.value;
    if (type1 && type2) {
      displayDualTypeEffectiveness(type1, type2);
      updatePokemonButtons();
    }
  }
  
  function displayTypeEffectiveness(type) {
    const effectiveness = getTypeEffectiveness(type);
    const offensive = getOffensiveEffectiveness(type);
    
    singleTypeResults.innerHTML = `
      <div class="type-header">
        <h3><span class="type-badge type-${type.toLowerCase()}">${type}</span> Type</h3>
      </div>
      <div class="matchup-section">
        <h4>Defensive Matchups</h4>
        ${createMultiplierGroupsHTML(effectiveness, false)}
      </div>
      <div class="matchup-section">
        <h4>Offensive Matchups</h4>
        ${createMultiplierGroupsHTML(offensive, true)}
      </div>
    `;
    
    singleTypePokemonBtn.classList.remove('hidden');
  }
  
  function displayDualTypeEffectiveness(type1, type2) {
    const effectiveness = getDualTypeEffectiveness(type1, type2);
    const offensive1 = getOffensiveEffectiveness(type1);
    const offensive2 = getOffensiveEffectiveness(type2);
    const combinedOffensive = {};
    
    for (const type in offensive1) {
      combinedOffensive[type] = Math.max(offensive1[type], offensive2[type] || 1);
    }
    
    dualTypeResults.innerHTML = `
      <div class="type-header">
        <h3>
          <span class="type-badge type-${type1.toLowerCase()}">${type1}</span> / 
          <span class="type-badge type-${type2.toLowerCase()}">${type2}</span>
        </h3>
      </div>
      <div class="matchup-section">
        <h4>Defensive Matchups</h4>
        ${createMultiplierGroupsHTML(effectiveness, false)}
      </div>
      <div class="matchup-section">
        <h4>Offensive Matchups</h4>
        ${createMultiplierGroupsHTML(combinedOffensive, true)}
      </div>
    `;
    
    dualTypePokemonBtn.classList.remove('hidden');
  }
  
  function getOffensiveEffectiveness(type) {
    const offensive = {};
    for (const defenseType in typeChart) {
      offensive[defenseType] = typeChart[defenseType][type] || 1;
    }
    return offensive;
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
      dualTypeLink.href = `https://www.serebii.net/pokedex-search.shtml?type=${type1}&type2=${type2}`;
      dualTypePokemonBtn.classList.remove('hidden');
    } else {
      dualTypePokemonBtn.classList.add('hidden');
    }
  }
  
  // Test cases (run in console)
  function testAllSpecialCases() {
    const tests = [
      { types: ['Ground', 'Dragon'], attack: 'Fairy', expected: 2 },
      { types: ['Electric', 'Flying'], attack: 'Ground', expected: 0 },
      { types: ['Dark', 'Ghost'], attack: 'Fairy', expected: 1 },
      { types: ['Normal', 'Ghost'], attack: 'Fighting', expected: 0 },
      { types: ['Steel', 'Fairy'], attack: 'Poison', expected: 0 }
    ];
    
    tests.forEach(test => {
      const effectiveness = getDualTypeEffectiveness(...test.types);
      const actual = effectiveness[test.attack];
      if (actual !== test.expected) {
        console.error(`FAIL: ${test.types.join('/')} vs ${test.attack} - Expected ${test.expected}, got ${actual}`);
      }
    });
    console.log('Tests completed');
  }
  
  // Initialize the app when DOM loads
  document.addEventListener('DOMContentLoaded', init);
