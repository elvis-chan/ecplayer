import * as _ from 'underscore';

import { replaceWith, addClass, removeClass, replaceClass } from 'utils/dom';
import { STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED, FULLSCREEN } from 'app/events';
import getMediaElement from 'api/getMediaElement';
import playerTemplate from 'templates/player.html';

class View {
  playerId = '';
  core = null;
  containerEle = null;

  constructor(core) {
    this.core = core;
  }

  setup({ id }) {
    this.playerId = id;
    this.containerEle = document.getElementById(this.playerId);

    this.transform();

    return this;
  }

  transform() {
    const replaceContent = { id: this.playerId, content: playerTemplate };

    this.containerEle = replaceWith(this.containerEle, replaceContent);
    this.mediaEle = getMediaElement(this.containerEle);

    const aspectEle = this.containerEle.getElementsByClassName('ecp-aspect')[0];

    aspectEle.style.paddingTop = `${(9 / 16) * 100}%`;
  }

  init() {
    this.attachListeners();

    _.each([STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED], (event) => {
      this.core.on(event, this.handleStateChange.bind(this));
    });

    this.core.on(FULLSCREEN, this.handleFullscreenChange.bind(this));
  }

  attachListeners() {
    const playbackEle = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    const fullscreenEle = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];

    playbackEle.addEventListener('click', this.handleClickPlayback.bind(this));
    fullscreenEle.addEventListener('click', this.handleClickFullscreen.bind(this));
  }

  handleStateChange({ newState }) {
    replaceClass(this.containerEle, /ecp-state-([a-z]*)/, `ecp-state-${newState}`);
  }

  handleFullscreenChange({ state }) {
    if (state) {
      addClass(this.containerEle, 'ecp-is-fullscreen');
    } else {
      removeClass(this.containerEle, 'ecp-is-fullscreen');
    }
  }

  handleClickPlayback() {
    this.core.togglePlayback();
  }

  handleClickFullscreen() {
    const newState = !this.core.getFullscreen();

    this.core.setFullscreen(newState);
  }
}

export default View;
