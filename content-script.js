console.log("Content script loaded");

// Detect Stack Overflow question page
if (window.location.href.includes('stackoverflow.com/questions/')) {
  console.log("Detected Stack Overflow question page");
  
  // Wait for fields to load
  setTimeout(() => {
    // Try these selectors in order
const bodyField = 
  document.querySelector('.js-editable') || // New editor
  document.querySelector('.wmd-input') ||    // Old editor
  document.querySelector('[aria-label="Body"]') ||
  document.querySelector('#wmd-input');
    
    if (bodyField) {
      console.log("Body element found:", bodyField);
      
      // Create subtle indicator container
      const indicatorContainer = document.createElement('div');
      indicatorContainer.id = 'som-indicator';
      indicatorContainer.style.marginTop = '10px';
      indicatorContainer.style.padding = '8px 12px';
      indicatorContainer.style.backgroundColor = '#f8f9f9';
      indicatorContainer.style.border = '1px solid #e4e6e8';
      indicatorContainer.style.borderRadius = '3px';
      indicatorContainer.style.fontSize = '13px';
      indicatorContainer.style.display = 'none';
      
      // Insert after the body field
      bodyField.parentNode.insertBefore(indicatorContainer, bodyField.nextSibling);
      
      let currentAnalysis = null;
      let lastUpdateTime = 0;
      
      // Debounced input handler
      const handleInput = () => {
        const now = Date.now();
        // Throttle updates to once per second
        if (now - lastUpdateTime < 1000) return;
        lastUpdateTime = now;
        
        const questionData = {
          title: '', // Not used
          body: bodyField.textContent
        };
        
chrome.runtime.sendMessage(
  { type: 'QUESTION_UPDATE', data: questionData },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('Message error:', chrome.runtime.lastError);
      return;
    }
    console.log("Analysis received:", response);
    currentAnalysis = response;
    updateIndicatorUI(response);
  }
);
      };

      bodyField.addEventListener('input', handleInput);
      
      // Update the subtle indicator
      function updateIndicatorUI(analysis) {
        if (!analysis.suggestions || analysis.suggestions.length === 0) {
          indicatorContainer.style.display = 'none';
          return;
        }
        
        // Create a subtle notification
        indicatorContainer.innerHTML = '';
        indicatorContainer.style.display = 'block';
        
        // Only show the first suggestion to avoid overwhelming
        const primarySuggestion = analysis.suggestions[0];
        
        const suggestionEl = document.createElement('div');
        suggestionEl.style.display = 'flex';
        suggestionEl.style.alignItems = 'center';
        
        const icon = document.createElement('span');
        icon.textContent = '💡';
        icon.style.marginRight = '8px';
        icon.style.fontSize = '14px';
        
        const text = document.createElement('span');
        text.textContent = primarySuggestion;
        text.style.color = '#535a60';
        
        suggestionEl.appendChild(icon);
        suggestionEl.appendChild(text);
        indicatorContainer.appendChild(suggestionEl);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          indicatorContainer.style.opacity = '0.5';
        }, 8000);
        setTimeout(() => {
          indicatorContainer.style.display = 'none';
        }, 10000);
      }
      
    } else {
      console.error("Body field not found");
    }
  }, 2000);
}