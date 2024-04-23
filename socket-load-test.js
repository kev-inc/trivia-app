const { io } = require("socket.io-client");
const { GameState } = require("./data/gamestate");
const { questionList } = require("./data/questions");

const URL = process.env.URL || "http://localhost:3001";
const MAX_CLIENTS = 100;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const randomNumber = (max) => {
  return Math.floor(Math.random() * (max + 1))
}

const randomUser = () => {
    return "user" + randomNumber(100000)
}

const createClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  const socket = io(URL, {
    transports,
  });
  
  let name = randomUser()

  socket.emit('joinGame', {username: name})

//   setInterval(() => {
//     // socket.emit("client to server event");
//     socket.emit('joinGame', { username: randomUser()})
//   }, EMIT_INTERVAL_IN_MS);

//   socket.on("server to client event", () => {
//     packetsSinceLastReport++;
//   });
  socket.on('joinedGame', ({username}) => {
    packetsSinceLastReport++;
  })
  socket.on('joinGameError', ({msg}) => {
    name = randomUser()
    socket.emit('joinGame', {username: name})
  })

  socket.on('updateState', ({gamestate}) => {
    if (gamestate.state == GameState.SHOW_ANSWERS) {
      setTimeout(() => {
        const answer = randomNumber(4)
        const correct = answer === questionList[gamestate.questionNumber]['answer']
        socket.emit('userAnsweredQuestion', { questionNo: gamestate.questionNumber, answer, correct })
      }, randomNumber(10000))
    }
  })

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);