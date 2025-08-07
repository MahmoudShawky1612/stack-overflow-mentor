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
      
      // Create suggestions sidebar container
      const sidebar = document.createElement('div');
      sidebar.id = 'som-suggestions-sidebar';
      sidebar.style.position = 'fixed';
      sidebar.style.right = '20px';
      sidebar.style.top = '100px';
      sidebar.style.width = '350px';
      sidebar.style.backgroundColor = 'white';
      sidebar.style.border = '1px solid #e4e6e8';
      sidebar.style.borderRadius = '8px';
      sidebar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      sidebar.style.zIndex = '10000';
      sidebar.style.display = 'flex';
      sidebar.style.flexDirection = 'column';
      sidebar.style.maxHeight = 'calc(100vh - 150px)';
      sidebar.style.overflow = 'hidden';
      
      // Create sidebar header
      const header = document.createElement('div');
      header.style.backgroundColor = '#f48024';
      header.style.color = 'white';
      header.style.padding = '12px 16px';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      
      const title = document.createElement('div');
      title.textContent = '💡 Suggestions';
      title.style.fontWeight = 'bold';
      title.style.fontSize = '16px';
      
      const qualityScore = document.createElement('div');
      qualityScore.id = 'som-quality-score';
      qualityScore.textContent = 'Quality: --/100';
      qualityScore.style.backgroundColor = 'rgba(255,255,255,0.2)';
      qualityScore.style.padding = '4px 10px';
      qualityScore.style.borderRadius = '12px';
      qualityScore.style.fontSize = '14px';
      
      header.appendChild(title);
      header.appendChild(qualityScore);
      sidebar.appendChild(header);
      
      // Create suggestions container
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'som-suggestions-container';
      suggestionsContainer.style.padding = '15px';
      suggestionsContainer.style.flex = '1';
      suggestionsContainer.style.overflowY = 'auto';
      
      // Create initial message
      const initialMessage = document.createElement('div');
      initialMessage.textContent = 'Start typing to get suggestions...';
      initialMessage.style.color = '#6a737c';
      initialMessage.style.textAlign = 'center';
      initialMessage.style.padding = '20px';
      initialMessage.id = 'som-initial-message';
      
      suggestionsContainer.appendChild(initialMessage);
      sidebar.appendChild(suggestionsContainer);
      
      // Add to document
      document.body.appendChild(sidebar);
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.position = 'absolute';
      closeBtn.style.right = '10px';
      closeBtn.style.top = '10px';
      closeBtn.style.backgroundColor = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.color = 'white';
      closeBtn.style.fontSize = '20px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => sidebar.style.display = 'none';
      header.appendChild(closeBtn);
      
      let currentAnalysis = null;
      let lastUpdateTime = 0;
      
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
        suggestionsContainer.innerHTML = '';
        const loading = document.createElement('div');
        loading.textContent = 'Analyzing your question...';
        loading.style.color = '#6a737c';
        loading.style.textAlign = 'center';
        loading.style.padding = '20px';
        suggestionsContainer.appendChild(loading);
        
        chrome.runtime.sendMessage(
          { type: 'QUESTION_UPDATE', data: questionData },
          (response) => {
            console.log("Analysis received:", response);
            currentAnalysis = response;
            updateSuggestionsUI(response);
          }
        );
      };
      
      // Update the UI with all suggestions
      function updateSuggestionsUI(analysis) {
        suggestionsContainer.innerHTML = '';
        
        // Update quality score
        if (analysis.qualityScore !== undefined) {
          qualityScore.textContent = `Quality: ${analysis.qualityScore}/100`;
        }
        
        if (!analysis.suggestions || analysis.suggestions.length === 0) {
          const noSuggestions = document.createElement('div');
          noSuggestions.textContent = '✅ Your question looks great! Keep writing...';
          noSuggestions.style.color = '#3c4146';
          noSuggestions.style.textAlign = 'center';
          noSuggestions.style.padding = '20px';
          suggestionsContainer.appendChild(noSuggestions);
          return;
        }
        
        // Create suggestion items
        analysis.suggestions.forEach(suggestion => {
          const suggestionItem = document.createElement('div');
          suggestionItem.style.padding = '12px';
          suggestionItem.style.marginBottom = '10px';
          suggestionItem.style.backgroundColor = '#f8f9f9';
          suggestionItem.style.borderRadius = '6px';
          suggestionItem.style.borderLeft = '4px solid #f48024';
          suggestionItem.style.display = 'flex';
          suggestionItem.style.gap = '10px';
          
          const icon = document.createElement('div');
          icon.textContent = '⚠️';
          icon.style.fontSize = '16px';
          icon.style.paddingTop = '2px';
          
          const text = document.createElement('div');
          text.textContent = suggestion;
          text.style.color = '#3c4146';
          text.style.fontSize = '14px';
          
          suggestionItem.appendChild(icon);
          suggestionItem.appendChild(text);
          suggestionsContainer.appendChild(suggestionItem);
        });
      }
      
      
      // Setup event listeners
      bodyField.addEventListener('input', handleInput);

      
    } else {
      console.error("Body field not found");
    }
  }, 2000);
}