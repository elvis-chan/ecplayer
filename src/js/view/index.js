import { replaceWith } from 'utils/dom';
import { PLAYBACK, FULLSCREEN } from 'app/events';
import getMediaElement from 'api/getMediaElement';
import playerTemplate from 'templates/player.html';

class View {
  playerId = '';
  api = null;
  containerEle = null;

  setup({ id, api }) {
    this.playerId = id;
    this.api = api;
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
  }

  attachListeners() {
    const playbackEle = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    const fullscreenEle = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];

    playbackEle.addEventListener('click', this.handleClickPlayback.bind(this));
    fullscreenEle.addEventListener('click', this.handleClickFullscreen.bind(this));
  }

  handleClickPlayback() {
    this.api.trigger(PLAYBACK);
  }

  handleClickFullscreen() {
    this.api.trigger(FULLSCREEN, { state: false });
  }
}

export default View;
