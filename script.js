// Type chart data - converted from your Java version
const typeChart = {
    Normal: { Fighting: 2, Ghost: 0 },
    Fire: { Fire: 0.5, Water: 2, Grass: 0.5, Ground: 2, Bug: 0.5, Rock: 2, Steel: 0.5, Ice: 0.5, Fairy: 0.5 },
    Water: { Fire: 0.5, Water: 0.5, Grass: 2, Electric: 2, Ground: 0.5, Rock: 0.5, Ice: 0.5 },
    Electric: { Electric: 0.5, Ground: 2, Flying: 0.5, Steel: 0.5 },
    Grass: { Fire: 2, Water: 0.5, Grass: 0.5, Electric: 0.5, Ice: 2, Poison: 2, Ground: 0.5, Flying: 2, Bug: 2 },
    Ice: { Fire: 2, Ice: 0.5, Fighting: 2, Rock: 2, Steel: 2 },
    Fighting: { Flying: 2, Psychic: 2, Fairy: 2, Rock: 0.5, Bug: 0.5, Dark: 0.5 },
    Poison: { Ground: 2, Psychic: 2, Grass: 0.5, Fighting: 0.5, Poison: 0.5, Bug: 0.5, Fairy: 0.5 },
    Ground: { Water: 2, Grass: 2, Ice: 2, Flying: 0, Poison: 0.5, Rock: 0.5 },
    Flying: { Electric: 2, Ice: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Bug: 0.5, Ground: 0 },
    Psychic: { Bug: 2, Dark: 2, Ghost: 2, Fighting: 0.5, Psychic: 0.5 },
    Bug: { Fire: 2, Flying: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Ground: 0.5 },
    Rock: { Water: 2, Grass: 2, Fighting: 2, Ground: 2, Steel: 2, Fire: 0.5, Normal: 0.5, Flying: 0.5, Poison: 0.5 },
    Ghost: { Ghost: 2, Dark: 2, Psychic: 0, Bug: 0.5, Poison: 0.5 },
    Dragon: { Dragon: 2, Fairy: 0, Fire: 0.5, Water: 0.5, Grass: 0.5, Electric: 0.5 },
    Dark: { Fighting: 2, Bug: 2, Fairy: 2, Ghost: 0.5, Dark: 0.5, Psychic: 0 },
    Steel: { Fire: 2, Fighting: 2, Ground: 2, Normal: 0.5, Grass: 0.5, Ice: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 0.5, Dragon: 0.5, Steel: 0.5, Fairy: 0.5 },
    Fairy: { Poison: 2, Steel: 2, Fighting: 0.5, Bug: 0.5, Dark: 0.5, Dragon: 0 }
};

// All available types
const allTypes = Object.keys(typeChart);

// DOM elements
const singleTypeBtn = document.getElementById('singleTypeBtn');
const dualTypeBtn = document.getElementById('dualTypeBtn');
const singleTypeSection = document.getElementById('singleTypeSection');
const dualTypeSection = document.getElementById('dualTypeSection');
const singleTypeSelect = document.getElementById('singleTypeSelect');
const firstTypeSelect = document.getElementById('firstTypeSelect');
const secondTypeSelect = document.getElementById('secondTypeSelect');
const singleTypeResults = document.getElementById('singleTypeResults');
const dualTypeResults = document.getElementById('dualTypeResults');

// Initialize the app
function init() {
    // Populate type dropdowns
    allTypes.forEach(type => {
        singleTypeSelect.appendChild(createOption(type));
        firstTypeSelect.appendChild(createOption(type));
        secondTypeSelect.appendChild(createOption(type));
    });
    
    // Set up event listeners
    singleTypeBtn.addEventListener('click', () => {
        singleTypeSection.classList.remove('hidden');
        dualTypeSection.classList.add('hidden');
    });
    
    dualTypeBtn.addEventListener('click', () => {
        dualTypeSection.classList.remove('hidden');
        singleTypeSection.classList.add('hidden');
    });
    
    singleTypeSelect.addEventListener('change', () => {
        if (singleTypeSelect.value) {
            displayTypeEffectiveness(singleTypeSelect.value);
        }
    });
    
    firstTypeSelect.addEventListener('change', updateDualTypeResults);
    secondTypeSelect.addEventListener('change', updateDualTypeResults);
}

// Create an option element for select dropdown
function createOption(type) {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    return option;
}

// Get defensive effectiveness for a type
function getTypeEffectiveness(type) {
    return typeChart[type] || {};
}

// Get dual type effectiveness
function getDualTypeEffectiveness(type1, type2) {
    const effectiveness1 = getTypeEffectiveness(type1);
    const effectiveness2 = getTypeEffectiveness(type2);
    const combined = {};
    
    allTypes.forEach(attackType => {
        const multiplier1 = effectiveness1[attackType] || 1;
        const multiplier2 = effectiveness2[attackType] || 1;
        combined[attackType] = multiplier1 * multiplier2;
    });
    
    return combined;
}

// Get offensive effectiveness for a type
function getOffensiveEffectiveness(type) {
    const offensiveMap = {};
    
    allTypes.forEach(defendingType => {
        const multiplier = typeChart[defendingType][type] || 1;
        offensiveMap[defendingType] = multiplier;
    });
    
    return offensiveMap;
}

// Display single type effectiveness
function displayTypeEffectiveness(type) {
    let html = `<div class="type-header"><h3>${type} Type</h3></div>`;
    
    // Defensive matchups
    html += `<div class="matchup-section">
        <h4>Defensive: Weak/Resistant to</h4>
        ${createMultiplierGroupsHTML(getTypeEffectiveness(type), false)}
    </div>`;
    
    // Offensive matchups
    html += `<div class="matchup-section">
        <h4>Offensive: Strong/Weak against</h4>
        ${createMultiplierGroupsHTML(getOffensiveEffectiveness(type), true)}
    </div>`;
    
    singleTypeResults.innerHTML = html;
}

// Display dual type effectiveness
function displayDualTypeEffectiveness(type1, type2) {
    let html = `<div class="type-header"><h3>${type1}/${type2} Dual Type</h3></div>`;
    
    // Defensive matchups
    html += `<div class="matchup-section">
        <h4>Defensive: Weak/Resistant to</h4>
        ${createMultiplierGroupsHTML(getDualTypeEffectiveness(type1, type2), false)}
    </div>`;
    
    // Offensive matchups (combined for both types)
    const offensive1 = getOffensiveEffectiveness(type1);
    const offensive2 = getOffensiveEffectiveness(type2);
    const combinedOffensive = {};
    
    allTypes.forEach(defendingType => {
        const mult1 = offensive1[defendingType] || 1;
        const mult2 = offensive2[defendingType] || 1;
        combinedOffensive[defendingType] = Math.max(mult1, mult2);
    });
    
    html += `<div class="matchup-section">
        <h4>Offensive: Strong/Ineffective against</h4>
        ${createMultiplierGroupsHTML(combinedOffensive, true)}
    </div>`;
    
    dualTypeResults.innerHTML = html;
}

// Update dual type results when either select changes
function updateDualTypeResults() {
    if (firstTypeSelect.value && secondTypeSelect.value) {
        displayDualTypeEffectiveness(firstTypeSelect.value, secondTypeSelect.value);
    }
}

// Create HTML for multiplier groups
function createMultiplierGroupsHTML(effectiveness, isOffensive) {
    const grouped = {};
    
    // Group types by multiplier
    Object.entries(effectiveness).forEach(([type, multiplier]) => {
        if (!grouped[multiplier]) {
            grouped[multiplier] = [];
        }
        grouped[multiplier].push(type);
    });
    
    // Sort multipliers in descending order
    const sortedMultipliers = Object.keys(grouped).sort((a, b) => b - a);
    
    let html = '';
    sortedMultipliers.forEach(mult => {
        const label = getMultiplierLabel(parseFloat(mult), isOffensive);
        const types = grouped[mult].map(type => 
            `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
        ).join(', ');
        
        html += `<div class="multiplier-group">
            <span class="multiplier-label">${label}:</span>
            <span class="type-list">${types}</span>
        </div>`;
    });
    
    return html;
}

// Get label for multiplier
function getMultiplierLabel(multiplier, isOffensive) {
    if (multiplier === 0) return 'Immune';
    if (isOffensive) {
        if (multiplier >= 4) return '4× Super';
        if (multiplier === 2) return '2× Super';
        if (multiplier === 1) return 'Neutral';
        if (multiplier <= 0.25) return '0.25× Not';
        if (multiplier === 0.5) return '0.5× Not';
    } else {
        if (multiplier >= 4) return '4× Weak';
        if (multiplier === 2) return '2× Weak';
        if (multiplier === 1) return 'Neutral';
        if (multiplier <= 0.25) return '0.25× Res';
        if (multiplier === 0.5) return '0.5× Res';
    }
    return `${multiplier}×`;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);