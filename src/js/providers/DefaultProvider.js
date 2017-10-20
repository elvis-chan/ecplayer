import { PLAYBACK, FULLSCREEN } from 'app/events';

class DefaultProvider {
  api = null;
  options = {};
  mediaEle = null;

  constructor(api) {
    this.api = api;
  }

  setup(options) {
    this.options = options;
    this.mediaEle = this.options.mediaEle;

    this.api.on(PLAYBACK, this.handlePlayback.bind(this));
    this.api.on(FULLSCREEN, this.handleFullscreen.bind(this));
  }

  play() {
    this.mediaEle.play();
  }

  pause() {
    this.mediaEle.pause();
  }

  handlePlayback() {
    this[this.mediaEle.paused ? 'play' : 'pause']();
  }

  handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.api.getContainer().requestFullscreen();
    }
  }
}

export default DefaultProvider;
