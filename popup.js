// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    updateUI(message.data);
  }
});

function updateUI(analysis) {
   document.getElementById('score-text').textContent = 
    `Quality Score: ${analysis.qualityScore}/100`;
    
  document.getElementById('quality-fill').style.width = 
    `${analysis.qualityScore}%`;
  
   const suggestionsContainer = document.getElementById('suggestions-container');
  suggestionsContainer.innerHTML = '<h3>Suggestions:</h3>';
  
  if (analysis.suggestions.length === 0) {
    suggestionsContainer.innerHTML += 
      '<div class="suggestion">✅ Your question looks great!</div>';
  } else {
    analysis.suggestions.forEach(suggestion => {
      const suggestionEl = document.createElement('div');
      suggestionEl.className = 'suggestion';
      suggestionEl.textContent = `⚠️ ${suggestion}`;
      suggestionsContainer.appendChild(suggestionEl);
    });
  }
  
   const duplicatesContainer = document.getElementById('duplicates-container');
  const duplicatesList = document.getElementById('duplicates-list');
  duplicatesList.innerHTML = '';
  
  if (analysis.duplicates.length > 0) {
    duplicatesContainer.style.display = 'block';
    analysis.duplicates.forEach(dup => {
      const link = document.createElement('a');
      link.className = 'duplicate-link';
      link.href = dup.link;
      link.target = '_blank';
      link.textContent = dup.title;
      duplicatesList.appendChild(link);
    });
  } else {
    duplicatesContainer.style.display = 'none';
  }
}

 window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'REQUEST_ANALYSIS'});
  });
});