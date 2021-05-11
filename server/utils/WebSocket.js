class WebSockets {
  //list of active users in the application
  users = [];
  /**
   * Core method of this class that handles the connection events to the chat
   * @param {*} client is our server
   */
  connection(client) {
    //user connection lost
    client.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
    });
    //user logged in from the front end, making connection with server giving us the identity
    client.on("identity", (userId) => {
      this.users.push({
        socketId: client.id,
        userId: userId,
      });
    });
    //user joining the chat room
    client.on("subscribe", (room, otherUserId = "") => {
      client.join(room);
    });
    //user leaving the chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }
}

export default new WebSockets();
