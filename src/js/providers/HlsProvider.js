import * as _ from 'underscore';

import { MEDIA_LEVEL_CHANGED, QUALITIES, CURRENT_LEVEL_CHANGE } from 'app/events'; /* Added by [J] */
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
    // const idx = _.findIndex(this.qualityLevels, qualityLevel =>
    //   qualityLevel.level === this.instance.currentLevel);
    return this.outputQualityLevels[this.instance.currentLevel];
  }

  getCurrentQualityIndex() {
    return this.instance.currentLevel;
  }


  setCurrentQuality(index) {
    this.instance.currentLevel = index;
  }

  handleLoadedManifest(e, { audioTracks }) {
    this.audioTracks = audioTracks;
    this.qualityLevels = this.instance.levels; // added by [J]

    this.outputQualityLevels = _.map(this.qualityLevels, qualityLevel => ({
      player: 'HLS',
      bitrate: qualityLevel.bitrate,
      width: qualityLevel.width,
      height: qualityLevel.height,
      label: `${qualityLevel.height}p`,
    }));
    this.core.trigger(QUALITIES); /* Added by [J] */

    this.handleBuffering();
  }

  handleSwitchedLevel(e, { level }) {
    this.api.trigger(MEDIA_LEVEL_CHANGED, { currentQualityLevel: level });
    this.core.trigger(CURRENT_LEVEL_CHANGE);
  }

  handleUpdatedLevel(e, { details }) {
    const { live } = details;

    this.isLive = live;

    return this;
  }
}

export default HlsProvider;
