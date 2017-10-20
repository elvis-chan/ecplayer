import scriptLoader from 'utils/scriptLoader';
import HTML5Provider from './HTML5Provider';
import HlsProvider from './HlsProvider';
import ShakaProvider from './ShakaProvider';

class Providers {
  api = null;
  loadedProviders = {};

  constructor(api) {
    this.api = api;
  }
}

Object.assign(Providers.prototype, {
  load: function load(candidates) {
    return Promise.all(candidates.map((provider) => {
      if (provider === 'html5') {
        this.loadedProviders[provider] = new HTML5Provider(this.api);
        return Promise.resolve();
      }

      return scriptLoader.load(`provider.${provider}.js`).then(() => {
        const Provider = provider === 'hls' ? HlsProvider : ShakaProvider;

        this.loadedProviders[provider] = new Provider(this.api);
      });
    }));
  },

  choose: function choose(type) {
    return this.loadedProviders[type];
  },
});

export default Providers;
