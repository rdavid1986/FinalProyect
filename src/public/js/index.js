const socket = io();


socket.on('event_socket', data => {
    socket.emit(data);
})

socket.on('Event_all_but_current_one', data =>{
    socket.emit(data);
})

socket.on('It_is_received_by_all_clients', data => {
    socket.emit(data);
})




