import socketio from 'socket.io';
import parseStringAsArray from './utils/parseStringAsArray';
import calculateDistante from './utils/calculateDistance';

const connections = [];
let io;

// eslint-disable-next-line import/prefer-default-export
export function setupWebsocket(server) {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs.toLowerCase()),
    });
  });
}

export function findConnections(coordinates, techs) {
  return connections.filter(connection => {
    return (
      calculateDistante(coordinates, connection.coordinates) < 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
}

export function sendMessage(to, message, data) {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
}
