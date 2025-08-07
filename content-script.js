console.log("Content script loaded");

// Detect Stack Overflow question page
if (window.location.href.includes('stackoverflow.com/questions/')) {
  console.log("Detected Stack Overflow question page");
  
  // Wait for fields to load
  setTimeout(() => {
    // Focus only on the body field
    const bodyField = document.querySelector('.js-editable, .wmd-input, [aria-label="Body"]');
    
    if (bodyField) {
      console.log("Body element found:", bodyField);
      
      // Create suggestion container
      const suggestionContainer = document.createElement('div');
      suggestionContainer.id = 'som-suggestion-container';
      suggestionContainer.style.position = 'absolute';
      suggestionContainer.style.bottom = '-10px';
      suggestionContainer.style.right = '0';
      suggestionContainer.style.left = '0';
      suggestionContainer.style.zIndex = '1000';
      suggestionContainer.style.backgroundColor = '#f8f9f9';
      suggestionContainer.style.border = '1px solid #e4e6e8';
      suggestionContainer.style.borderRadius = '4px';
      suggestionContainer.style.opacity = '0';
      suggestionContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      suggestionContainer.style.transform = 'translateY(10px)';
      suggestionContainer.style.pointerEvents = 'auto';
      suggestionContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      suggestionContainer.style.maxHeight = '300px';
      suggestionContainer.style.overflowY = 'auto';
      suggestionContainer.style.padding = '10px';
      
      // Create suggestion header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '10px';
      header.style.paddingBottom = '8px';
      header.style.borderBottom = '1px solid #e4e6e8';
      
      const title = document.createElement('div');
      title.style.display = 'flex';
      title.style.alignItems = 'center';
      title.style.gap = '8px';
      title.style.fontWeight = 'bold';
      title.style.color = '#535a60';
      
      const icon = document.createElement('span');
      icon.textContent = '💡';
      icon.style.fontSize = '16px';
      
      const titleText = document.createElement('span');
      titleText.textContent = 'Suggestions';
      titleText.id = 'som-suggestion-title';
      
      title.appendChild(icon);
      title.appendChild(titleText);
      
      const qualityScore = document.createElement('div');
      qualityScore.id = 'som-quality-score';
      qualityScore.style.background = '#f48024';
      qualityScore.style.color = 'white';
      qualityScore.style.padding = '4px 8px';
      qualityScore.style.borderRadius = '12px';
      qualityScore.style.fontSize = '12px';
      qualityScore.style.fontWeight = 'bold';
      
      header.appendChild(title);
      header.appendChild(qualityScore);
      
      suggestionContainer.appendChild(header);
      
      // Create suggestions list container
      const suggestionsList = document.createElement('div');
      suggestionsList.id = 'som-suggestions-list';
      suggestionsList.style.display = 'flex';
      suggestionsList.style.flexDirection = 'column';
      suggestionsList.style.gap = '8px';
      
      suggestionContainer.appendChild(suggestionsList);
      
      // Add to DOM
      bodyField.parentNode.style.position = 'relative';
      bodyField.parentNode.appendChild(suggestionContainer);
      
      let currentAnalysis = null;
      let lastUpdateTime = 0;
      let isFocused = false;
      
      // Debounced input handler
      const handleInput = () => {
        const now = Date.now();
        // Throttle updates to once per second
        if (now - lastUpdateTime < 1000) return;
        lastUpdateTime = now;
        
        const questionData = {
          body: bodyField.textContent
        };
        
        // Show loading state
        showLoadingState();
        
        chrome.runtime.sendMessage(
          { type: 'QUESTION_UPDATE', data: questionData },
          (response) => {
            console.log("Analysis received:", response);
            currentAnalysis = response;
            updateSuggestionUI(response);
          }
        );
      };
      
      // Show loading state
      function showLoadingState() {
        suggestionsList.innerHTML = '';
        
        const loadingItem = document.createElement('div');
        loadingItem.style.display = 'flex';
        loadingItem.style.alignItems = 'center';
        loadingItem.style.padding = '8px';
        loadingItem.style.gap = '8px';
        loadingItem.style.background = '#f1f2f3';
        loadingItem.style.borderRadius = '4px';
        
        const loadingIcon = document.createElement('div');
        loadingIcon.textContent = '⏳';
        
        const loadingText = document.createElement('div');
        loadingText.textContent = 'Analyzing your question...';
        loadingText.style.color = '#6a737c';
        
        loadingItem.appendChild(loadingIcon);
        loadingItem.appendChild(loadingText);
        
        suggestionsList.appendChild(loadingItem);
        suggestionContainer.style.opacity = '1';
        suggestionContainer.style.transform = 'translateY(0)';
      }
      
      // Update the UI based on analysis
      function updateSuggestionUI(analysis) {
        suggestionsList.innerHTML = '';
        
        // Update quality score
        if (analysis.qualityScore !== undefined) {
          qualityScore.textContent = `Quality: ${analysis.qualityScore}/100`;
        }
        
        if (!analysis.suggestions || analysis.suggestions.length === 0) {
          const noSuggestions = document.createElement('div');
          noSuggestions.style.display = 'flex';
          noSuggestions.style.alignItems = 'center';
          noSuggestions.style.padding = '8px';
          noSuggestions.style.gap = '8px';
          noSuggestions.style.background = '#e6f4ea';
          noSuggestions.style.borderRadius = '4px';
          noSuggestions.style.borderLeft = '3px solid #5fba7d';
          
          const icon = document.createElement('div');
          icon.textContent = '✅';
          
          const text = document.createElement('div');
          text.textContent = "Your question looks great! Keep writing...";
          text.style.color = '#535a60';
          
          noSuggestions.appendChild(icon);
          noSuggestions.appendChild(text);
          
          suggestionsList.appendChild(noSuggestions);
          
          // Auto-hide after 3 seconds
          setTimeout(() => {
            if (!isFocused) {
              suggestionContainer.style.opacity = '0';
              suggestionContainer.style.transform = 'translateY(10px)';
            }
          }, 3000);
          return;
        }
        
        // Create suggestion items
        analysis.suggestions.forEach(suggestion => {
          const suggestionItem = document.createElement('div');
          suggestionItem.style.display = 'flex';
          suggestionItem.style.alignItems = 'flex-start';
          suggestionItem.style.padding = '8px';
          suggestionItem.style.gap = '8px';
          suggestionItem.style.background = '#fff';
          suggestionItem.style.borderRadius = '4px';
          suggestionItem.style.borderLeft = '3px solid #f48024';
          suggestionItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
          
          const icon = document.createElement('div');
          icon.textContent = '⚠️';
          icon.style.fontSize = '14px';
          icon.style.paddingTop = '2px';
          
          const text = document.createElement('div');
          text.textContent = suggestion;
          text.style.color = '#3c4146';
          text.style.fontSize = '13px';
          text.style.lineHeight = '1.4';
          text.style.flex = '1';
          
          suggestionItem.appendChild(icon);
          suggestionItem.appendChild(text);
          
          suggestionsList.appendChild(suggestionItem);
        });
        
        suggestionContainer.style.opacity = '1';
        suggestionContainer.style.transform = 'translateY(0)';
      }
      
      // Setup event listeners
      bodyField.addEventListener('input', handleInput);
      
      // Show when field is focused
      bodyField.addEventListener('focus', () => {
        isFocused = true;
        if (currentAnalysis) {
          suggestionContainer.style.opacity = '1';
          suggestionContainer.style.transform = 'translateY(0)';
        } else {
          showPlaceholder();
        }
      });
      
      // Hide when field is blurred
      bodyField.addEventListener('blur', () => {
        isFocused = false;
        setTimeout(() => {
          if (!isFocused) {
            suggestionContainer.style.opacity = '0';
            suggestionContainer.style.transform = 'translateY(10px)';
          }
        }, 200);
      });
      
      // Show placeholder message
      function showPlaceholder() {
        suggestionsList.innerHTML = '';
        
        const placeholder = document.createElement('div');
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.padding = '8px';
        placeholder.style.gap = '8px';
        placeholder.style.background = '#f1f2f3';
        placeholder.style.borderRadius = '4px';
        
        const icon = document.createElement('div');
        icon.textContent = '💡';
        
        const text = document.createElement('div');
        text.textContent = 'Start typing to get suggestions...';
        text.style.color = '#6a737c';
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text);
        
        suggestionsList.appendChild(placeholder);
        suggestionContainer.style.opacity = '1';
        suggestionContainer.style.transform = 'translateY(0)';
      }
      
      // Initial display
      showPlaceholder();
      
    } else {
      console.error("Body field not found");
    }
  }, 2000);
}