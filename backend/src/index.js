import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import routes from './routes';
import { setupWebsocket } from './websocket';

const app = express();

// Extraindo o servidor http de dentro do express
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-7ehg2.mongodb.net/week10?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
