import { Router } from 'express';

import DevController from './controllers/DevController';
import SearchController from './controllers/SearchController';

const routes = Router();

//-----------------------------------------
// DEVS
//-----------------------------------------
routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);
routes.put('/devs/:id', DevController.update);
routes.delete('/devs/:id', DevController.destroy);

//-----------------------------------------
// SEARCH
//-----------------------------------------
routes.get('/search', SearchController.index);

export default routes;
