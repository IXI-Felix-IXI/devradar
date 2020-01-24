import Dev from '../models/Dev';

import parseStringAsArray from '../utils/parseStringAsArray';

class SearchController {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // meters
        },
      },
    });

    return res.json(devs);
  }
}

export default new SearchController();
