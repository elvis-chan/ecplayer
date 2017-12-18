import * as _ from 'underscore';

import { MEDIA_LEVEL_CHANGED, QUALITIES_LOADED, CURRENT_LEVEL_CHANGE } from 'app/events'; /* Added by [J] */
import DefaultProvider from './DefaultProvider';

class HlsProvider extends DefaultProvider {
  instance = null;

  // eslint-disable-next-line class-methods-use-this
  getName() {
    return { name: 'hls' };
  }

  setup(options) {
    super.setup(options);

    const { Hls } = window;

    this.instance = new Hls({
      // eslint-disable-next-line no-param-reassign
      // xhrSetup: (xhr) => { xhr.withCredentials = true; },
    });

    this.instance.loadSource(options.file);
    this.instance.attachMedia(this.mediaEle);

    this.instance.on(Hls.Events.MANIFEST_LOADED, this.handleLoadedManifest.bind(this));
    this.instance.on(Hls.Events.LEVEL_SWITCHED, this.handleSwitchedLevel.bind(this));
    this.instance.on(Hls.Events.LEVEL_UPDATED, this.handleUpdatedLevel.bind(this));
  }

  getCurrentQuality() {
    return this.outputQualityLevels[this.instance.currentLevel];
  }

  setCurrentQuality(index) {
    const { width, height, bitrate } = this.outputQualityLevels[index];

    const currentLevel = _.findIndex(this.qualityLevels, { width, height, bitrate });

    this.instance.currentLevel = currentLevel;

    this.core.trigger(CURRENT_LEVEL_CHANGE, { level: index });
  }

  handleLoadedManifest(e, { audioTracks }) {
    this.loadLevel = -1;
    this.audioTracks = audioTracks;
    this.qualityLevels = this.instance.levels;

    this.outputQualityLevels = _.chain({ player: 'HLS', label: 'Auto' })
      .concat(this.qualityLevels)
      .sortBy('height')
      .reverse()
      .map(qualityLevel => ({
        player: 'HLS',
        bitrate: qualityLevel.bitrate,
        width: qualityLevel.width,
        height: qualityLevel.height,
        label: qualityLevel.label || `${qualityLevel.height}p`,
      }))
      .value();

    this.core.trigger(QUALITIES_LOADED);

    this.handleBuffering();
  }

  handleSwitchedLevel(e, { level }) {
    this.api.trigger(MEDIA_LEVEL_CHANGED, { currentQualityLevel: level });
  }

  handleUpdatedLevel(e, { details }) {
    const { live } = details;

    this.isLive = live;

    return this;
  }
}

export default HlsProvider;
