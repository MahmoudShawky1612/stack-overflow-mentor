// Only analyze the body, not the title
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'QUESTION_UPDATE') {
    // Only send body to backend (title not used)
    fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: message.data.body })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Analysis results:', data);
      sendResponse(data);
    })
    .catch(error => {
      console.error('Analysis error:', error);
      sendResponse({ suggestions: [], duplicates: [] });
    });
    
    return true; // Keep message channel open
  }
});