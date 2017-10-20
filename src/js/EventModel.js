import * as _ from 'underscore';

import Events from 'utils/events';

export default {
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
};
