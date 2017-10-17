import Api from './api';

const ecplayer = (query) => {
  let domElement = null;

  if (typeof query === 'string') {
    domElement = document.getElementById(query);
  }

  if (domElement) {
    const api = new Api(domElement);

    return api;
  }

  return null;
};

window.ecplayer = ecplayer;

export default ecplayer;
