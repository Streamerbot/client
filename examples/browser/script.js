const client = new StreamerbotClient();

client.on('Twitch.ChatMessage', ({ data }) => {
  document.getElementById('chat').innerHTML += `<div class="message"><span class="username" style="color: ${data.message.color}">${data.message.displayName}</span>${data.message.message}</div>`;
});