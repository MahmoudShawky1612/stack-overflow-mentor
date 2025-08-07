// content-script.js (updated)
console.log("Content script loaded");

// Detect any question page (ask or edit)
if (window.location.href.includes('stackoverflow.com/questions/')) {
  console.log("Detected Stack Overflow question page");
  
  // Wait for fields to load
  setTimeout(() => {
// Try these if above doesn't work
const titleField = document.querySelector('input[type="text"][name="title"]');
const bodyField = document.querySelector('.wmd-input, .js-editor');

    if (titleField && bodyField) {
      console.log("Title element found:", titleField);
      console.log("Body element found:", bodyField);
      
      const handleInput = () => {
        const questionData = {
          title: titleField.value,
          body: bodyField.textContent
        };
        console.log("Question data:", questionData);
        chrome.runtime.sendMessage(
  { type: 'QUESTION_UPDATE', data: questionData },
  (response) => {
    console.log("Received analysis:", response);
    // TODO: Display suggestions to user
    alert(`Suggestion: ${response.suggestions[0]}`);
  }
);
      };

      titleField.addEventListener('input', handleInput);
      bodyField.addEventListener('input', handleInput);
    } else {
      console.error("Fields not found. Actual page structure:", document.body.innerHTML.substring(0, 300));
    }
  }, 2000); // Wait 2 seconds for page to load
}