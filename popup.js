
      window.onload = function() {
  // Listen for the submit button being clicked
  const submitApiKeyButton = document.getElementById('submit-api-key'); 
  const apiKeyInput = document.getElementById('api-key');
  const submitButton = document.getElementById('submit');
  const apiKeyLabel = document.getElementById('api-key-label'); 
  let apikey;

  chrome.storage.local.get('apiKey', function(result) {
    if (result.apiKey) {
      // Hide the input field, label, and submit button
      apiKeyInput.style.display = 'none';
      apiKeyLabel.style.display = 'none';
      submitApiKeyButton.style.display = 'none';
    }
  });

  submitApiKeyButton.addEventListener('click', (event) => {
    // Prevent the form from being submitted
    event.preventDefault();

    // Retrieve the API key from the input field
    const apiKey = apiKeyInput.value
    console.log(apiKey)

    // Save the API key in the extension's local storage
    chrome.storage.local.set({'apiKey': apiKey}, function() {
      console.log('API key saved');
    });

    // Hide the form
    apiKeyInput.style.display = 'none';
    submitApiKeyButton.style.display = 'none';
    apiKeyLabel.style.display = 'none';   
  });

  // Define the sendMessage function in the local scope
  function sendMessage() {
    // Get the input and output textarea elements
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');

    // Get the message from the input textarea
    const message = inputTextarea.value;
      
    // Clear the input textarea
    inputTextarea.value = '';

    // Retrieve the API key from the extension's local storage
    chrome.storage.local.get('apiKey', function(result) {
      // Check if the API key was retrieved successfully
      if (result.apiKey) {
        // Send the message to the OpenAI API
        fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.apiKey}`,
          },
          body: JSON.stringify({
            prompt: message,
            model: 'text-davinci-003',
            temperature: 0.1,
            max_tokens: 4000
          })
        })
        .then(response => response.json())
        .then(data => {
          // Check if the choices property exists before trying to access it
          console.log(data);
          const response = data.choices && data.choices[0].text;

// Append ChatGPT's response to the output textarea
outputTextarea.value += `\nChatGPT: ${response}`;

// Clear the input textarea
inputTextarea.value = '';
})
.then(response => {
console.log(response);
})
.catch(error => {
// Handle any errors that occurred during the request
console.error(error);

// Append an error message to the output textarea
outputTextarea.value += `\nAn error occurred while sending the message: ${error.message}`;
});
} else {
// Append an error message to the output textarea
outputTextarea.value += '\nNo API key was found in the extension\'s local storage.';
}
});
};

submitButton.addEventListener('click', sendMessage);
}

