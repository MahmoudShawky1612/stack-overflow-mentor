// Get extension ID dynamically
const extensionId = chrome.runtime.id;
const backendUrl = `http://localhost:3000/analyze`;

 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'QUESTION_UPDATE') {
    console.log('Sending to backend:', {
      title: message.data.title.substring(0, 50),
      body: message.data.body.substring(0, 50)
    });
    
    fetch(backendUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Extension-ID': extensionId
      },
      body: JSON.stringify({ 
        title: message.data.title,
        body: message.data.body
      })
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Analysis success:', data);
      sendResponse(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      sendResponse({ 
        suggestions: [`Backend connection failed: ${error.message}`],
        qualityScore: 0,
        duplicates: []
      });
    });
    
    return true;
  }
});