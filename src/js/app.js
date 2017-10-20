import 'es6-object-assign/auto';
import 'es6-promise/auto';

import scriptLoader from 'utils/scriptLoader';
import instances from 'app/instances';
import Api from './api';

scriptLoader.load('ecplayer.css');

const getInstanceById = (id) => {
  for (let i = 0; i < instances.length; i += 1) {
    if (id === instances[i].id) {
      return instances[i];
    }
  }
  return null;
};

const ecplayer = (query) => {
  let player = null;
  let domElement = null;

  if (typeof query === 'string') {
    player = getInstanceById(query);

    if (!player) {
      domElement = document.getElementById(query);
    }
  }

  if (player) {
    return player;
  }

  if (domElement) {
    const api = new Api(domElement);

    instances.push(api);

    return api;
  }

  return null;
};

window.ecplayer = ecplayer;

export default ecplayer;
