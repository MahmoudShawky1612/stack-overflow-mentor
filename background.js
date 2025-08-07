// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'QUESTION_UPDATE') {
    console.log('Received question update:', message.data);
    
    // TODO: Send to backend API
    // For now, mock a response
    const mockResponse = {
      suggestions: [
        "Add error messages or logs",
        "Consider adding code formatting"
      ],
      score: 65
    };
    
    sendResponse(mockResponse);
  }
  return true; // Keep message channel open
});