import EventModel from 'app/EventModel';
import Core from 'core';

let createdInstance = 0;

const Api = function Api(ele) {
  createdInstance += 1;

  // uniqueId will be started at 1
  const uniqueId = createdInstance;
  const playerId = ele.id;

  const core = new Core();

  Object.defineProperties(this, {
    id: { get() { return playerId; } },
    uniqueId: { get() { return uniqueId; } },
  });

  Object.assign(this, {
    setup: (options) => {
      core.setup({ container: ele, api: this });
      core.init(options);
      return this;
    },

    load: (manifest) => {
      core.load(manifest);
      return this;
    },

    getContainer: () => core.getContainer(),

    getState: () => core.getState(),

    play: (state) => {
      core.play(state);
      return this;
    },

    pause: () => {
      core.pause();
      return this;
    },

    getPosition: () => core.getPosition(),

    getDuration: () => core.getDuration(),

    getFullscreen: () => core.getFullscreen(),

    setFullscreen: (state) => {
      core.setFullscreen(state);
      return this;
    },

    getQualityLevels: () => core.getQualityLevels(),

    getCurrentQuality: () => core.getCurrentQuality(),

    setCurrentQuality: index => core.setCurrentQuality(index),

    getMute: () => core.getMute(),

    getVolume: () => core.getVolume(),

    setMute: (state) => {
      core.setMute(state);
      return this;
    },

    setVolume: (volume) => {
      core.setVolume(volume);

      return this;
    },

  });
};

Object.assign(Api.prototype, EventModel);

export default Api;
