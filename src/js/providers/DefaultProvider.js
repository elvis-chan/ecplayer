import * as _ from 'underscore';

import { isInFullscreen, requestFullscreen, exitFullscreen } from 'utils/fullscreen';
import { STATE_IDLE, STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED, MEDIA_TIME, FULLSCREEN } from 'app/events';

class DefaultProvider {
  core = null;
  api = null;
  options = {};
  mediaEle = null;

  isInFullscreen = false;
  isLive = false;
  duration = 0;
  currentPlaybackTime = 0;
  qualityLevels = [];
  outputQualityLevels = [];
  audioTracks = [];

  constructor(core) {
    this.core = core;
    this.api = this.core.api;

    this.state = STATE_IDLE;
  }

  setup(options) {
    this.options = options;
    this.mediaEle = this.options.mediaEle;

    _.each(['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'], (event) => {
      document.addEventListener(event, this.handleFullscreenChange.bind(this), false);
    });

    this.mediaEle.onloadedmetadata = this.handleOnLoadedMetadata.bind(this);
    this.mediaEle.oncanplay = this.handleOnCanPlay.bind(this);
    this.mediaEle.onplay = this.handleOnPlay.bind(this);
    this.mediaEle.onpause = this.handleOnPause.bind(this);
    this.mediaEle.ontimeupdate = this.handleOnTimeUpdate.bind(this);
  }

  getState() {
    return this.state;
  }

  setState(state) {
    const oldState = this.state;
    const newState = state;
    const data = { newState, oldState };

    this.state = newState;

    this.core.trigger(state, data);
    this.api.trigger(state, data);
  }

  play() {
    this.mediaEle.play();
  }

  pause() {
    this.mediaEle.pause();
  }

  togglePlayback() {
    this[this.mediaEle.paused ? 'play' : 'pause']();
  }

  getPosition() {
    return this.currentPlaybackTime || 0;
  }

  getDuration() {
    return this.mediaEle.duration;
  }

  getFullscreen() {
    return this.isInFullscreen;
  }

  setFullscreen(state) {
    const containerEle = this.api.getContainer();

    if (state) {
      requestFullscreen(containerEle);
    } else {
      exitFullscreen(document);
    }
  }

  getQualityLevels() {
    return this.outputQualityLevels;
  }

  getMute() {
    return this.mediaEle.muted;
  }

  getVolume() {
    return this.mediaEle.volume;
  }

  setMute(state) {
    this.mediaEle.muted = state;
  }

  setVolume(volume) {
    if (_.isNumber(volume)) {
      this.mediaEle.volume = volume / 100;
    }
  }

  handleOnLoadedMetadata() {
    this.duration = this.mediaEle.duration;

    const data = { duration: this.getDuration(), currentPlaybackTime: this.getPosition() };

    this.core.trigger(MEDIA_TIME, data);
  }

  handleOnCanPlay() {
    this.setState(STATE_IDLE);
  }

  handleBuffering() {
    this.setState(STATE_BUFFERING);
  }

  handleOnPlay() {
    this.setState(STATE_PLAYING);
  }

  handleOnPause() {
    this.setState(STATE_PAUSED);
  }

  handleOnTimeUpdate() {
    this.currentPlaybackTime = this.mediaEle.currentTime;

    const data = { duration: this.getDuration(), currentPlaybackTime: this.getPosition() };

    this.core.trigger(MEDIA_TIME, data);
  }

  handleFullscreenChange() {
    this.isInFullscreen = isInFullscreen() || false;

    this.core.trigger(FULLSCREEN, { state: this.isInFullscreen });
  }
}

export default DefaultProvider;
