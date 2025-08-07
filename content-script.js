console.log("Content script loaded");

 if (window.location.href.includes('stackoverflow.com/questions/')) {
  console.log("Detected Stack Overflow question page");
  
   setTimeout(() => {
     const bodyField = document.querySelector('.js-editable, .wmd-input, [aria-label="Body"]');
        const titleField = document.querySelector('input#title');



    
    if (bodyField && titleField) {
      console.log("Body element found:", bodyField);
      console.log("Title element found:", titleField);

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
      
       const suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'som-suggestions-container';
      suggestionsContainer.style.padding = '15px';
      suggestionsContainer.style.flex = '1';
      suggestionsContainer.style.overflowY = 'auto';
      
       const initialMessage = document.createElement('div');
      initialMessage.textContent = 'Start typing to get suggestions...';
      initialMessage.style.color = '#6a737c';
      initialMessage.style.textAlign = 'center';
      initialMessage.style.padding = '20px';
      initialMessage.id = 'som-initial-message';
      
      suggestionsContainer.appendChild(initialMessage);
      sidebar.appendChild(suggestionsContainer);
      
       document.body.appendChild(sidebar);
      
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
      
       const handleInput = () => {
        const now = Date.now();
         if (now - lastUpdateTime < 1000) return;
        lastUpdateTime = now;
        
        const questionData = {
          title: titleField.value,
          body: bodyField.textContent
        };
        
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
      
    function updateSuggestionsUI(analysis) {
        suggestionsContainer.innerHTML = '';
        
        // Update quality score
        if (analysis.qualityScore !== undefined) {
          qualityScore.textContent = `Quality: ${analysis.qualityScore}/100`;
        }
        
        const hasSuggestions = analysis.suggestions && analysis.suggestions.length > 0;
        const hasDuplicates = analysis.duplicates && analysis.duplicates.length > 0;
        
        if (!hasSuggestions && !hasDuplicates) {
          const noSuggestions = document.createElement('div');
          noSuggestions.textContent = '✅ Your question looks great! Keep writing...';
          noSuggestions.style.color = '#3c4146';
          noSuggestions.style.textAlign = 'center';
          noSuggestions.style.padding = '20px';
          suggestionsContainer.appendChild(noSuggestions);
          return;
        }
        
        // Display suggestions
        if (hasSuggestions) {
          analysis.suggestions.forEach(suggestion => {
            const suggestionItem = createSuggestionItem(suggestion);
            suggestionsContainer.appendChild(suggestionItem);
          });
        }
        
        // Display duplicates section
        if (hasDuplicates) {
          const duplicatesSection = document.createElement('div');
          duplicatesSection.style.marginTop = hasSuggestions ? '20px' : '0';
          
          const sectionHeader = document.createElement('div');
          sectionHeader.textContent = '🔗 Possible Duplicates';
          sectionHeader.style.fontWeight = 'bold';
          sectionHeader.style.color = '#3c4146';
          sectionHeader.style.marginBottom = '10px';
          sectionHeader.style.fontSize = '15px';
          duplicatesSection.appendChild(sectionHeader);
          
          // Process duplicates
          analysis.duplicates.forEach(dup => {
            const dupItem = createDuplicateItem(dup);
            duplicatesSection.appendChild(dupItem);
          });
          
          suggestionsContainer.appendChild(duplicatesSection);
        }
      }
      
      function createSuggestionItem(suggestion) {
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
        return suggestionItem;
      }
      
      function createDuplicateItem(dup) {
        const dupItem = document.createElement('a');
        dupItem.href = dup.link;
        dupItem.target = '_blank';
        dupItem.style.display = 'block';
        dupItem.style.padding = '10px 12px';
        dupItem.style.marginBottom = '8px';
        dupItem.style.backgroundColor = '#eef7ff';
        dupItem.style.borderRadius = '6px';
        dupItem.style.border = '1px solid #d1e0f0';
        dupItem.style.textDecoration = 'none';
        dupItem.style.color = '#2c5777';
        
         const title = document.createElement('div');
        title.textContent = dup.title;
        title.style.fontWeight = '500';
        title.style.fontSize = '13px';
        title.style.marginBottom = '5px';
        title.style.overflow = 'hidden';
        title.style.textOverflow = 'ellipsis';
        title.style.display = '-webkit-box';
        title.style.webkitLineClamp = '2';
        title.style.webkitBoxOrient = 'vertical';
        
         const metaRow = document.createElement('div');
        metaRow.style.display = 'flex';
        metaRow.style.gap = '10px';
        metaRow.style.fontSize = '12px';
        metaRow.style.color = '#6a737c';
        
        const score = document.createElement('span');
        score.textContent = `Score: ${dup.score}`;
        
        const answers = document.createElement('span');
        answers.textContent = `Answers: ${dup.answer_count}`;
        
        const status = document.createElement('span');
        status.textContent = dup.is_answered ? '✔ Answered' : '✘ Unanswered';
        status.style.color = dup.is_answered ? '#45a163' : '#cf6a6a';
        
        metaRow.appendChild(score);
        metaRow.appendChild(answers);
        metaRow.appendChild(status);
        
        dupItem.appendChild(title);
        dupItem.appendChild(metaRow);
        return dupItem;
      }
      
      
       bodyField.addEventListener('input', handleInput);
      titleField.addEventListener('input', handleInput);

      
    } else {
      console.error("Body field not found");
    }
  }, 2000);
}