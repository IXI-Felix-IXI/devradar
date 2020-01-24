import axios from 'axios';
import { Types } from 'mongoose';
import Dev from '../models/Dev';
import { findConnections, sendMessage } from '../websocket';

import parseStringAsArray from '../utils/parseStringAsArray';

class DevController {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  }

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      try {
        // Utilizando AXIOS para consumir a API do Github
        const apiResponse = await axios.get(
          `https://api.github.com/users/${github_username}`
        );

        // Recurso da desestruturação, caso não encontre o campo name o valor padrão sera  login
        // eslint-disable-next-line no-undef
        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs.toLowerCase());

        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };

        dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location,
        });

        // Filtrar as conexões que estão há no máximo 10km de distância
        // e que o novo dev tenha pelo menos uma das tecnologias filtradas

        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          techsArray
        );

        sendMessage(sendSocketMessageTo, 'new-dev', dev);
      } catch (error) {
        return res.status(400).json({ error });
      }
    }

    return res.json(dev);
  }

  async update(req, res) {
    // Verificando se o ID informado é um ObjectID válido
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Developer ID does not exists.' });
    }

    const dev = await Dev.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(dev);
  }

  async destroy(req, res) {
    await Dev.findByIdAndRemove(req.params.id);

    return res.send();
  }
}

export default new DevController();
