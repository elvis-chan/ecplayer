import * as _ from 'underscore';
import mime from 'mime-types';

import EventModel from 'app/EventModel';
import View from 'view';
import getMediaElement from 'api/getMediaElement';
import Providers from 'providers';

const API_COMMANDS = [
  // playback related
  'getState',
  'play',
  'pause',
  'togglePlayback',

  // seek related
  'getPosition',
  'getDuration',

  // resize related
  'getFullscreen',
  'setFullscreen',

  // quality related
  'getQualityLevels',
  'getCurrentQuality',
  'setCurrentQuality',

  // volume related
  'getMute',
  'getVolume',
  'setMute',
  'setVolume',
];

class Core {
  containerEle = null;
  api = null;
  view = null;

  setup({ container, api }) {
    this.api = api;
    this.view = new View(this);

    this.view.setup({ id: container.id });

    this.containerEle = document.getElementById(container.id);
  }

  init(options) {
    this.options = options;

    this.injectCommands();

    if (this.options.file) {
      this.api.load(this.options.file);
    }
  }

  injectCommands() {
    _.each(API_COMMANDS, (command) => {
      this[command] = (...rest) => {
        const method = this.provider[command];

        return method.apply(this.provider, rest);
      };
    });
  }

  load(manifest) {
    this.options.file = manifest;

    const mimeType = mime.lookup(manifest);

    let type = null;

    if (mimeType === 'application/dash+xml') {
      type = 'shaka';
    } else if (mimeType === false || mimeType === 'application/vnd.apple.mpegurl') {
      type = 'hls';
    } else {
      type = 'html5';
    }

    const providers = new Providers(this);

    providers.load([type]).then(() => {
      this.provider = providers.choose(type);

      this.options.containerEle = this.getContainer();
      this.options.mediaEle = getMediaElement(this.containerEle);

      this.provider.setup(this.options);
      this.view.init();
      this.api.trigger('ready');
    });
  }

  getContainer() {
    return this.containerEle;
  }
}

Object.assign(Core.prototype, EventModel);

export default Core;
