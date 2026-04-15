
export default function initSocket(io) {
    function sendUsers(cafeId){
        const users = [];
        const room = io.sockets.adapter.rooms.get(cafeId);

        if (room) {
            for (const socketId of room) {
                const clientSocket = io.sockets.sockets.get(socketId);
                if(clientSocket && clientSocket.userId && clientSocket.username){
                    users.push({
                        userId: clientSocket.userId,
                        username: clientSocket.username
                    })
                }
            }
        }
        console.log('all users in ', cafeId, ' are ', users)
        io.to(cafeId).emit("users", users);
    }
    io.on('connection', async (socket) => {
        try {
            const {myUserId : userId, cafeId, username} = socket.handshake.auth;
            if (!username || !userId || !cafeId || cafeId === "undefined") {
                socket.disconnect();
                return;
            }
            console.log('joining cafe: ', cafeId, " user: ", userId)
            console.log("rooms: ", socket.rooms)
            if(socket.cafeId){
                socket.leave(socket.cafeId);
            }
            socket.username = username;
            socket.userId = userId;
            socket.cafeId = cafeId;

            socket.join(cafeId);
            socket.join(userId);
            console.log('connected: ', username, " in: ", cafeId)
            sendUsers(cafeId);
            
            socket.on('request', ({chatWith}) => {

                io.to(chatWith).emit('request', {username : socket.username, id : socket.userId});

            })
            socket.on('response', ({chatWith, status}) => {
                console.log('res: ', status)
                io.to(chatWith).emit('response', status);

            })
            socket.on('message', ({msg, chatWith}) => {

                io.to(chatWith).emit('message',  {msg, senderId: socket.userId});

            })
            socket.on('chatDisconnect', ({chatWith}) => {
                console.log("chat disconnected")
                io.to(chatWith).emit('chatDisconnect');
            })
            socket.on('disconnect', () => {
                console.log('disconnected: ', username)
                sendUsers(socket.cafeId)
            })
        }
        catch (err) {
            console.log(err);
        }
    });
}
