const {insertChatHistory, getAllHistory} = require("./socketDB");

module.exports = (io, server) => {
  const rooms = ["general", "party", "trade"];

  let connections = [];
  let users = [];

  io.on("connection", socket => {
    console.log("Connected to chat");
    connections.push(socket);
    // add username to chat

    //socket.rooms = "general";
    //socket.room = "general";

    socket.join("general");

    getAllHistory(socket.room, callback => {
      socket.emit("updatechat", callback);
    });

    socket.on("disconnect", () => {
      users = users.filter(user => user.name !== socket.username);
      //users.splice(users.indexOf(socket.username), 1);

      connections.splice(connections.indexOf(socket, 1));
      io.sockets.emit("updateusers", users);

      console.log("disconnected");
    });

    socket.on("adduser", username => {
      socket.username = username.name;
      socket.id = username.id;
      users.push(username);

      socket.join("general");

      socket.emit("getUsers", users);

      socket.room = "general";

      /*
      const serverreplyToUser = {
        user: "SERVER",
        message: `You are now connected to ${socket.rooms} room`
      };

      socket.emit("updatechat", serverreplyToUser);
      */

      const serverReplyToChat = {
        user: "SERVER",
        message: `${username.name} has connected to ${socket.room}`,
        room: socket.room
      };

      socket.to(socket.room).emit("updatechat", serverReplyToChat);

      socket.emit("updaterooms", rooms, rooms[0]);
    });
    //send
    socket.on("send", data => {
      const today = new Date().toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });

      const message = {
        id: socket.id,
        message: data.message,
        user: data.user,
        time: today,
        room: data.room
      };

      console.log("Socket.js  Message", socket.room);
      //socket.broadcast.emit("updatechat", message);
      io.in(socket.room).emit("updatechat", message);

      insertChatHistory(message);
    });

    // IS TYPING

    socket.on("typing", (data, user) => {
      console.log("Is Anyone writing?:", data, "Who is Writing?", user);
      // socket.broadcast.emit("istyping", data, user);
      // All the other folks but not U
      console.log("ROOM TYPE", socket.room);
      socket.broadcast.to(socket.room).emit("istyping", data, user);
    });

    // Switch rooms
    socket.on("switchRoom", newroom => {
      /*
      const messageLeft = {
        user: "SERVER",
        message: `${socket.username} has left the ${socket.rooms} room`
      };

      socket.to(socket.rooms).emit("updatechat", messageLeft);
*/
      socket.leave(socket.room);

      //socket.room = newroom;

      socket.join(newroom);

      const whichRoom = {
        user: "SERVER",
        message: `You are in ${newroom} room`
      };

      socket.emit("updatechat", whichRoom);

      getAllHistory(newroom, callback => {
        socket.emit("updatechat", callback);
      });

      /*
      const newRoomJoin = {
        user: "SERVER",
        message: `${socket.username} has joined ${newroom} room`
      };
      */

      // socket.to(socket.rooms).emit("updatechat", newRoomJoin);

      socket.emit("updaterooms", rooms, newroom);
    });
  });
};
