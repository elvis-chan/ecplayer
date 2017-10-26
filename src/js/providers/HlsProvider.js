import * as _ from 'underscore';

import { MEDIA_LEVEL_CHANGED } from 'app/events';
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
    const idx = _.findIndex(this.qualityLevels, qualityLevel =>
      qualityLevel.level === this.instance.currentLevel);

    return this.outputQualityLevels[idx];
  }

  setCurrentQuality(index) {
    this.instance.currentLevel = index;
  }

  handleLoadedManifest(e, { levels, audioTracks }) {
    this.qualityLevels = levels;
    this.audioTracks = audioTracks;

    this.outputQualityLevels = _.map(this.qualityLevels, qualityLevel => ({
      bitrate: qualityLevel.bitrate,
      width: qualityLevel.width,
      height: qualityLevel.height,
      label: `${qualityLevel.height}p`,
    }));

    this.handleBuffering();
  }

  handleSwitchedLevel(e, { level }) {
    this.api.trigger(MEDIA_LEVEL_CHANGED, { currentQualityIndex: level });
  }

  handleUpdatedLevel(e, { details }) {
    const { live } = details;

    this.isLive = live;

    return this;
  }
}

export default HlsProvider;
