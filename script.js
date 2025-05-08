// Dictionary data
let dictionaryData = {};
let currentLanguageFilter = 'all';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const englishWord = document.getElementById('english-word');
const myanmarWord = document.getElementById('myanmar-word');
const karenWord = document.getElementById('karen-word');
const phoneticText = document.getElementById('phonetic-text');
const partOfSpeechText = document.getElementById('part-of-speech-text');
const englishDefinition = document.getElementById('english-definition');
const myanmarDefinition = document.getElementById('myanmar-definition');
const karenDefinition = document.getElementById('karen-definition');
const soundBtn = document.getElementById('sound-btn');
const languageTabs = document.querySelectorAll('.language-tab');

// Load dictionary data
fetch('dictionary.json')
    .then(response => response.json())
    .then(data => {
        dictionaryData = data;
    })
    .catch(error => {
        console.error('Error loading dictionary data:', error);
        showError("Failed to load dictionary data. Please try again later.");
    });

// Search function
function searchWord() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showError("Please enter a word to search");
        return;
    }
    
    // Search in all languages
    const foundWord = dictionaryData.words.find(item => 
        item.english.toLowerCase() === searchTerm.toLowerCase() ||
        item.myanmar === searchTerm ||
        item.karen === searchTerm
    );
    
    if (foundWord) {
        displayResult(foundWord);
    } else {
        showError(`"${searchTerm}" was not found in the dictionary.`);
    }
}

// Display result
function displayResult(wordData) {
    errorDiv.style.display = 'none';
    
    // Display words in all languages
    englishWord.textContent = wordData.english;
    myanmarWord.textContent = wordData.myanmar;
    karenWord.textContent = wordData.karen;
    
    // Get the first definition (for simplicity)
    const firstDefinition = wordData.definitions[0];
    
    phoneticText.textContent = `Phonetic: ${wordData.phonetic}`;
    partOfSpeechText.textContent = `Part of Speech: ${firstDefinition.partOfSpeech}`;
    englishDefinition.textContent = firstDefinition.english;
    myanmarDefinition.textContent = firstDefinition.myanmar;
    karenDefinition.textContent = firstDefinition.karen;
    
    // Set up sound button (text-to-speech for English)
    soundBtn.onclick = () => {
        const utterance = new SpeechSynthesisUtterance(wordData.english);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };
    
    resultDiv.style.display = 'block';
}

// Show error
function showError(message = "Search for a word in any language to begin...") {
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.innerHTML = `<p>${message}</p>`;
}

// Filter by language
function filterByLanguage(lang) {
    currentLanguageFilter = lang;
    
    // Update active tab
    languageTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.lang === lang) {
            tab.classList.add('active');
        }
    });
    
    // For this simple implementation, we'll just change the placeholder
    // In a more advanced version, you might filter the word list
    switch(lang) {
        case 'english':
            searchInput.placeholder = "Search in English...";
            break;
        case 'myanmar':
            searchInput.placeholder = "Search in Myanmar...";
            break;
        case 'karen':
            searchInput.placeholder = "Search in Karen...";
            break;
        default:
            searchInput.placeholder = "Search in any language...";
    }
}

// Event listeners
searchBtn.addEventListener('click', searchWord);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchWord();
    }
});

// Language tab click events
languageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterByLanguage(tab.dataset.lang);
    });
});

// Initialize
showError();
filterByLanguage('all');