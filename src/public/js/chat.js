const socket = io();

//Chat
Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa tu usuario",
    inputValidator: (value) => {
        return !value && 'necesitas escribir un nombre';
    },
    allowOutsideClick: false,
}).then(result => {
    user_name = result.value;
    
})
chatBox.addEventListener("keyup", evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            let messageData = {
                user_name: user_name,
                messages: chatBox.value
            };
            socket.emit('message', messageData);
            chatBox.value = "";
        }
    }
})

socket.on('messageLogs', async data => {
    let log = document.getElementById('messageLogs');
    const chatrender = data.map(data => {
        return `<p><strong>${data.user_name} dice :</strong> ${data.messages}`;
   }).join(" ");
        log.innerHTML = chatrender;
})
