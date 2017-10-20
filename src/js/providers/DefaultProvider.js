import * as _ from 'underscore';

import { STATE_IDLE, STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED, FULLSCREEN } from 'app/events';
import { isInFullscreen, requestFullscreen, exitFullscreen } from 'utils/fullscreen';

class DefaultProvider {
  core = null;
  api = null;
  options = {};
  mediaEle = null;

  isInFullscreen = false;
  isLive = false;
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

    this.mediaEle.onplay = this.handleOnPlay.bind(this);
    this.mediaEle.onpause = this.handleOnPause.bind(this);
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

  setMute(state) {
    this.mediaEle.muted = state;
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

  handleFullscreenChange() {
    this.isInFullscreen = isInFullscreen() || false;

    this.core.trigger(FULLSCREEN, { state: this.isInFullscreen });
  }
}

export default DefaultProvider;
