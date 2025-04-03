// Type chart data
const typeChart = {
    Normal: { Fighting: 2, Ghost: 0 },
    Fire: { Fire: 0.5, Water: 2, Grass: 0.5, Ground: 2, Bug: 0.5, Rock: 2, Steel: 0.5, Ice: 0.5, Fairy: 0.5 },
    Water: { Fire: 0.5, Water: 0.5, Grass: 2, Electric: 2, Ground: 0.5, Rock: 0.5, Ice: 0.5 },
    Electric: { Electric: 0.5, Ground: 2, Flying: 0.5, Steel: 0.5 },
    Grass: { Fire: 2, Water: 0.5, Grass: 0.5, Electric: 0.5, Ice: 2, Poison: 2, Ground: 0.5, Flying: 2, Bug: 2 },
    Ice: { Fire: 2, Ice: 0.5, Fighting: 2, Rock: 2, Steel: 2 },
    Fighting: { Flying: 2, Psychic: 2, Fairy: 2, Rock: 0.5, Bug: 0.5, Dark: 0.5 },
    Poison: { Ground: 2, Psychic: 2, Grass: 0.5, Fighting: 0.5, Poison: 0.5, Bug: 0.5, Fairy: 0.5 },
    Ground: { Water: 2, Grass: 2, Ice: 2, Flying: 1, Poison: 0.5, Rock: 0.5 },
    Flying: { Electric: 2, Ice: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Bug: 0.5, Ground: 0 },
    Psychic: { Bug: 2, Dark: 2, Ghost: 2, Fighting: 0.5, Psychic: 0.5 },
    Bug: { Fire: 2, Flying: 2, Rock: 2, Grass: 0.5, Fighting: 0.5, Ground: 0.5 },
    Rock: { Water: 2, Grass: 2, Fighting: 2, Ground: 2, Steel: 2, Fire: 0.5, Normal: 0.5, Flying: 0.5, Poison: 0.5 },
    Ghost: { Ghost: 2, Dark: 2, Psychic: 0, Bug: 0.5, Poison: 0.5 },
    Dragon: { Dragon: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Grass: 0.5, Electric: 0.5 },
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
const randomSingleType = document.getElementById('randomSingleType');
const randomDualType = document.getElementById('randomDualType');
const themeBtn = document.getElementById('themeBtn');
const singleTypeShare = document.getElementById('singleTypeShare');
const dualTypeShare = document.getElementById('dualTypeShare');
const singleTypeShareLink = document.getElementById('singleTypeShareLink');
const dualTypeShareLink = document.getElementById('dualTypeShareLink');

// Initialize the app
function init() {
    // Populate type dropdowns
    allTypes.forEach(type => {
        singleTypeSelect.appendChild(createOption(type));
        firstTypeSelect.appendChild(createOption(type));
        secondTypeSelect.appendChild(createOption(type));
    });
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Check URL for shared type
    checkURLForSharedType();
}

function setupEventListeners() {
    singleTypeBtn.addEventListener('click', () => {
        singleTypeSection.classList.remove('hidden');
        dualTypeSection.classList.add('hidden');
        singleTypeBtn.classList.add('active');
        dualTypeBtn.classList.remove('active');
        updateHistory();
    });
    
    dualTypeBtn.addEventListener('click', () => {
        dualTypeSection.classList.remove('hidden');
        singleTypeSection.classList.add('hidden');
        dualTypeBtn.classList.add('active');
        singleTypeBtn.classList.remove('active');
        updateHistory();
    });
    
    singleTypeSelect.addEventListener('change', () => {
        if (singleTypeSelect.value) {
            displayTypeEffectiveness(singleTypeSelect.value);
            updateHistory();
        }
    });
    
    firstTypeSelect.addEventListener('change', () => {
        updateDualTypeResults();
        updateHistory();
    });
    
    secondTypeSelect.addEventListener('change', () => {
        updateDualTypeResults();
        updateHistory();
    });
    
    randomSingleType.addEventListener('click', () => {
        const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
        singleTypeSelect.value = randomType;
        displayTypeEffectiveness(randomType);
        updateHistory();
    });
    
    randomDualType.addEventListener('click', () => {
        const type1 = allTypes[Math.floor(Math.random() * allTypes.length)];
        let type2 = allTypes[Math.floor(Math.random() * allTypes.length)];
        // Ensure different types
        while (type2 === type1) {
            type2 = allTypes[Math.floor(Math.random() * allTypes.length)];
        }
        firstTypeSelect.value = type1;
        secondTypeSelect.value = type2;
        displayDualTypeEffectiveness(type1, type2);
        updateHistory();
    });
    
    themeBtn.addEventListener('click', toggleTheme);
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', generateShareLink);
    });
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', copyShareLink);
    });
    
    // Social media buttons
    document.querySelector('.twitter').addEventListener('click', shareOnTwitter);
    document.querySelector('.facebook').addEventListener('click', shareOnFacebook);
    
    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        checkURLForSharedType();
    });
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

// Create an option element for select dropdown
function createOption(type) {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    option.className = `type-${type.toLowerCase()}`;
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
    let html = `
        <div class="type-header">
            <h3><span class="type-badge type-${type.toLowerCase()}">${type}</span> Type</h3>
        </div>`;
    
    // Defensive matchups
    html += `
        <div class="matchup-section">
            <h4>Defensive: Weak/Resistant to</h4>
            ${createMultiplierGroupsHTML(getTypeEffectiveness(type), false)}
        </div>`;
    
    // Offensive matchups
    html += `
        <div class="matchup-section">
            <h4>Offensive: Strong/Ineffective against</h4>
            ${createMultiplierGroupsHTML(getOffensiveEffectiveness(type), true)}
        </div>`;
    
    singleTypeResults.innerHTML = html;
    singleTypeShare.classList.remove('hidden');
}

// Display dual type effectiveness
function displayDualTypeEffectiveness(type1, type2) {
    let html = `
        <div class="type-header">
            <h3>
                <span class="type-badge type-${type1.toLowerCase()}">${type1}</span> / 
                <span class="type-badge type-${type2.toLowerCase()}">${type2}</span> 
                Dual Type
            </h3>
        </div>`;
    
    // Defensive matchups
    html += `
        <div class="matchup-section">
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
    
    html += `
        <div class="matchup-section">
            <h4>Offensive: Strong/Ineffective against</h4>
            ${createMultiplierGroupsHTML(combinedOffensive, true)}
        </div>`;
    
    dualTypeResults.innerHTML = html;
    dualTypeShare.classList.remove('hidden');
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
        ).join(' ');
        
        html += `
            <div class="multiplier-group">
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
        if (multiplier >= 4) return '4× Super Effective';
        if (multiplier === 2) return '2× Super Effective';
        if (multiplier === 1) return 'Neutral';
        if (multiplier <= 0.25) return '0.25× Not Very Effective';
        if (multiplier === 0.5) return '0.5× Not Very Effective';
    } else {
        if (multiplier >= 4) return '4× Weak To';
        if (multiplier === 2) return '2× Weak To';
        if (multiplier === 1) return 'Neutral';
        if (multiplier <= 0.25) return '0.25× Resistant To';
        if (multiplier === 0.5) return '0.5× Resistant To';
    }
    return `${multiplier}×`;
}

// Share functionality
function generateShareLink() {
    const currentURL = new URL(window.location.href);
    
    if (!singleTypeSection.classList.contains('hidden')){
        const type = singleTypeSelect.value;
        if (!type) return;
        
        currentURL.searchParams.set('type', type);
        currentURL.searchParams.delete('type1');
        currentURL.searchParams.delete('type2');
        
        singleTypeShareLink.value = currentURL.toString();
    } else {
        const type1 = firstTypeSelect.value;
        const type2 = secondTypeSelect.value;
        if (!type1 || !type2) return;
        
        currentURL.searchParams.set('type1', type1);
        currentURL.searchParams.set('type2', type2);
        currentURL.searchParams.delete('type');
        
        dualTypeShareLink.value = currentURL.toString();
    }
}

function copyShareLink() {
    const input = singleTypeSection.classList.contains('hidden') 
        ? dualTypeShareLink 
        : singleTypeShareLink;
    
    input.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = input.nextElementSibling;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

function shareOnTwitter() {
    let text = "Check out this Pokémon type effectiveness: ";
    let url = window.location.href;
    
    if (!singleTypeSection.classList.contains('hidden')) {
        const type = singleTypeSelect.value;
        if (!type) return;
        text += `${type} type`;
    } else {
        const type1 = firstTypeSelect.value;
        const type2 = secondTypeSelect.value;
        if (!type1 || !type2) return;
        text += `${type1}/${type2} dual type`;
    }
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// URL handling for sharing
function checkURLForSharedType() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('type')) {
        const type = urlParams.get('type');
        if (allTypes.includes(type)) {
            singleTypeSelect.value = type;
            singleTypeBtn.click();
            displayTypeEffectiveness(type);
        }
    } else if (urlParams.has('type1') && urlParams.has('type2')) {
        const type1 = urlParams.get('type1');
        const type2 = urlParams.get('type2');
        if (allTypes.includes(type1) && allTypes.includes(type2)) {
            firstTypeSelect.value = type1;
            secondTypeSelect.value = type2;
            dualTypeBtn.click();
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

// Initialize the app when the DOM is loaded
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
