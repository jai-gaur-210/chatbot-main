// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Scroll to bottom of conversation
// conversation.scrollTop = conversation.scrollHeight;

const deleteChatButton = document.getElementById('submit-btn');
deleteChatButton.addEventListener('click', deleteChat);

async function deleteChat() {
  localStorage.clear();
  conversation.innerHTML = '';
  conversationHistory = [];
}

// Open chatbot event listener
chatbot.addEventListener('click', function () {
  chatbot.classList.toggle('open');
  if (chatbot.classList.contains('open')) {
    // Scroll to bottom of conversation when chatbot is opened
    conversation.scrollTop = conversation.scrollHeight;
  }
});

// Load conversation history from local storage
console.log(localStorage.getItem('conversationHistory'))
let conversationHistory = JSON.parse(localStorage.getItem('conversationHistory')) || [];

// Display conversation history in the chatbot
for (let i = 1; i < conversationHistory.length; i++) {
  let message = document.createElement('div');
  message.classList.add('chatbot-message', conversationHistory[i].sender);
  message.innerHTML = `<p class="chatbot-text" sentTime="${conversationHistory[i].time}">${conversationHistory[i].message}</p>`;
  conversation.appendChild(message);
}

inputForm.addEventListener('submit', async function (event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = '';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

  // Add user input to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'user-message');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
  conversation.appendChild(message);

  // Generate chatbot response
  const response = await generateResponse(input);

  // Add chatbot response to conversation
  message = document.createElement('div');
  message.classList.add('chatbot-message', 'chatbot');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });

  // Save conversation history to local storage
  conversationHistory.push({ sender: 'user-message', message: input, time: currentTime });
  conversationHistory.push({ sender: 'chatbot', message: response, time: currentTime });
  console.log(conversationHistory)
  localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
});

// Generate chatbot response function
async function generateResponse(input) {
  try {
    if (input == '') {
      const response = 'enter a question';
      return response;
    }
    input = input + " answer in less than 50 words"
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": input }],
        "max_tokens": 50,
      })
    })
    console.log(response)
    const data = await response.json();
    console.log(data.choices[0].message.content); // log the response data to inspect its structure
    const message = data.choices[0].message.content

    // Save chatbot response to local storage
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    conversationHistory.push({ sender: 'chatbot', message: message, time: currentTime });
    localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));

    return message;
  } catch (error) {
    console.error(error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}
