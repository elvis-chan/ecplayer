import * as _ from 'underscore';

import { replaceWith, addClass, removeClass, replaceClass, toggleClass, createElement, removeChild } from 'utils/dom';
import { toHumanReadable } from 'utils/strings';
// import VolumeSlider from 'utils/volumeSlider';
import VolumeSlider from 'view/volumeSlider';
import { STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED, MEDIA_TIME, FULLSCREEN, QUALITIES_LOADED, CURRENT_LEVEL_CHANGE } from 'app/events';
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
    const sliderEle = this.containerEle.getElementsByClassName('ecp-volume-slider')[0];
    const muteEle = this.containerEle.getElementsByClassName('ecp-button-mute')[0];
    this.volumeSlider = new VolumeSlider(this, sliderEle, muteEle);
    this.volumeSlider.setup();
    const controlBar = this.containerEle.getElementsByClassName('ecp-controlbar')[0];
    this.controlBar = controlBar;
    this.mouseMoveId = null;
    // this.checkAutoPlay();

    _.each([STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED], (event) => {
      this.core.on(event, this.handleStateChange.bind(this));
    });

    this.core.on(MEDIA_TIME, this.handleTimeUpdate.bind(this));
    this.core.on(FULLSCREEN, this.handleFullscreenChange.bind(this));
    this.core.on(QUALITIES_LOADED, this.handleQualitiesLoaded.bind(this));
    this.core.on(CURRENT_LEVEL_CHANGE, this.handleCurrentLevelChange.bind(this));
  }

  attachListeners() {
    const playbackEle = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    const fullscreenEle = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];
    const settingsEle = this.containerEle.getElementsByClassName('ecp-button-settings')[0];
    const videoTracksEle = this.containerEle.getElementsByClassName('ecp-video-tracks')[0];

    this.containerEle.addEventListener('mousemove', this.handleMouseMoveVideo.bind(this));
    this.containerEle.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    playbackEle.addEventListener('click', this.handleClickPlayback.bind(this));
    fullscreenEle.addEventListener('click', this.handleClickFullscreen.bind(this));
    settingsEle.addEventListener('click', this.handleClickSetting.bind(this));
    videoTracksEle.addEventListener('click', this.handleClickVideoTracks.bind(this));
  }

  checkAutoPlay() {
    const playBackEle = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    if (this.mediaEle.autoplay) {
      addClass(playBackEle.children[0], 'ecp-icon-pause');
      removeClass(playBackEle.children[0], 'ecp-icon-play');
    } else {
      addClass(playBackEle.children[0], 'ecp-icon-play');
      removeClass(playBackEle.children[0], 'ecp-icon-pause');
    }
  }

  handleMouseMoveVideo() {
    addClass(this.controlBar, 'is-shown');
    if (this.mouseMoveId) {
      clearTimeout(this.mouseMoveId);
    }
    this.mouseMoveId = setTimeout(this.hideControlBar.bind(this), 3000);
  }

  hideControlBar() {
    removeClass(this.controlBar, 'is-shown');
  }

  handleMouseLeave() {
    removeClass(this.controlBar, 'is-shown');
  }

  handleStateChange({ newState }) {
    replaceClass(this.containerEle, /ecp-state-([a-z]*)/, `ecp-state-${newState}`);
  }

  handleTimeUpdate({ duration, currentPlaybackTime }) {
    const elapsedEle = this.containerEle.getElementsByClassName('ecp-time-elapsed')[0];
    const durationEle = this.containerEle.getElementsByClassName('ecp-time-duration')[0];

    elapsedEle.innerHTML = toHumanReadable(currentPlaybackTime);
    durationEle.innerHTML = toHumanReadable(duration);
  }

  handleFullscreenChange({ state }) {
    if (state) {
      addClass(this.containerEle, 'ecp-is-fullscreen');
    } else {
      removeClass(this.containerEle, 'ecp-is-fullscreen');
    }
  }

  handleQualitiesLoaded() {
    const qualityLevels = this.core.getQualityLevels();
    const videoTracksEle = this.containerEle.getElementsByClassName('ecp-video-tracks')[0];
    removeChild(videoTracksEle);

    _.each(qualityLevels, (level, index) => {
      const html = createElement(`<li class="ecp-resolution">${level.label}</li>`);

      if (index === 0) {
        addClass(html, 'is-selected');
      }

      videoTracksEle.appendChild(html);
    });
  }

  handleCurrentLevelChange({ level }) {
    const resolutionEle = this.containerEle.getElementsByClassName('ecp-resolution');

    _.forEach(resolutionEle, resolution => removeClass(resolution, 'is-selected'));

    if (resolutionEle[level]) {
      addClass(resolutionEle[level], 'is-selected');
    }
  }

  handleClickPlayback() {
    this.core.togglePlayback();
  }

  handleChangeVolumeSlider({ target }) {
    const volume = parseInt(target.value, 10);

    this.core.setVolume(volume);
  }

  handleClickFullscreen() {
    const newState = !this.core.getFullscreen();
    // const fullscreenEle = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];

    this.core.setFullscreen(newState);
  }

  handleClickSetting(e) {
    e.preventDefault();
    const settingsIcon = this.containerEle.getElementsByClassName('ecp-button-settings')[0];
    toggleClass(settingsIcon, 'is-shown');
  }

  handleClickVideoTracks(e) {
    e.preventDefault();

    if (e.target.matches('.ecp-resolution')) {
      const videoTracksEle = e.target.parentElement;
      const settingsEle = this.containerEle.getElementsByClassName('ecp-button-settings')[0];

      const index = [...videoTracksEle.children].indexOf(e.target);

      this.core.setCurrentQuality(index);

      toggleClass(settingsEle, 'is-shown');
    }
  }
}

export default View;
