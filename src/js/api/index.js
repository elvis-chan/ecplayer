
import * as _ from 'underscore';

import Events from 'utils/events';
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

    getContainer() {
      return core.getContainer();
    },

    getQualityLevels() {
      return core.getQualityLevels();
    },

    play: (state) => {
      core.play(state);

      return this;
    },

    pause: () => {
      core.pause();

      return this;
    },
  });
};

Object.assign(Api.prototype, {
  on: function on(name, callback, context) {
    return Events.on.call(this, name, callback, context);
  },

  off: function off(name, callback, context) {
    return Events.off.call(this, name, callback, context);
  },

  trigger: function trigger(name, e) {
    const args = _.isObject(e) ? Object.assign({}, e) : {};

    args.type = name;

    return Events.triggerSafe.call(this, name, args);
  },
});

export default Api;
