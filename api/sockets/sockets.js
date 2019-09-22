module.exports = (io, server) => {
  const history = [];
  const rooms = ["general", "party", "trade"];

  let connections = [];
  const users = [];

  const roomCollection = [
    {
      room: "general",
      history: []
    },
    {
      room: "party",
      history: []
    },
    {
      room: "trade",
      history: []
    }
  ];

  io.on("connection", socket => {
    connections.push(socket);
    // add username to chat
    socket.rooms = "general";
    socket.join("general");

    socket.on("disconnect", () => {
      //users.splice(users.indexOf(socket.username), 1)
      connections.splice(connections.indexOf(socket, 1));
      io.sockets.emit("updateusers", users);
    });

    socket.on("adduser", username => {
      // const find = users.find(user => user === username);

      socket.username = username;
      users.push(username);

      socket.join("general");
      //socket.rooms = 'general';

      socket.emit(
        "updatechat",
        "SERVER",
        `You are now connected to ${socket.rooms} room`
      );

      socket
        .to(socket.rooms)
        .emit(
          "updatechat",
          "SERVER",
          `${username} has connected to ${socket.rooms}`
        );

      //username + " has connected to this room " + socket.rooms

      socket.emit("updaterooms", rooms, rooms[0]);
    });

    //send
    socket.on("send", (user, data) => {
      console.log("MSG:", data, "user:", user);
      io.in(socket.rooms).emit("updatechat", user, data);
      const test = {
        user,
        data
      };

      //socket.rooms.push(test);
     roomCollection.map(data => {
          if(data.room === socket.rooms) {
              return {...data, history: [...data.history, user ]}
          }
           return data;
      });

      /*
      console.log('HEJ');
      */
    });


    // IS TYPING

    socket.on("typing", data => {
      console.log(data);
      socket.emit("istyping", data);
    });

    // Switch rooms
    socket.on("switchRoom", newroom => {
        console.log("HISTORY", roomCollection);

      socket
        .to(socket.rooms)
        .emit(
          "updatechat",
          "SERVER",
          `${socket.username} has left the ${socket.rooms} room`
        );

      socket.leave(socket.rooms);

      socket.rooms = newroom;
      socket.join(newroom);

      socket.emit("updatechat", "SERVER", "You are in " + newroom);

      socket
        .to(socket.rooms)
        .emit(
          "updatechat",
          "SERVER",
          `${socket.username} has joined ${newroom} room`
        );

      socket.emit("updaterooms", rooms, newroom);
    });
  });
};
