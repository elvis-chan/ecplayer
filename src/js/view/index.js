import * as _ from 'underscore';

import { replaceWith, addClass, removeClass, replaceClass, toggleClass, hasClass } from 'utils/dom';
import { toHumanReadable } from 'utils/strings';
import Slider from 'utils/slider';
import { STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED, MEDIA_TIME, FULLSCREEN } from 'app/events';
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

    /* added by Jerry */
    const sliderEle = this.containerEle.getElementsByClassName('ecp-volume-slider')[0];
    const volBtn = this.containerEle.getElementsByClassName('ecp-button-mute')[0];
    this.volSlider = new Slider(this, sliderEle, volBtn);
    this.volSlider.setup();
    this.checkAutoPlay();
    /* added by End */

    _.each([STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED], (event) => {
      this.core.on(event, this.handleStateChange.bind(this));
    });

    this.core.on(MEDIA_TIME, this.handleTimeUpdate.bind(this));
    this.core.on(FULLSCREEN, this.handleFullscreenChange.bind(this));
    /* Added by Jerry */
    // this.core.on(MUTE, this.handleMuteChange.bind(this));
    /* Added by Jerry End */
  }

  attachListeners() {
    const playbackEle = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    // const muteEle = this.containerEle.getElementsByClassName('ecp-button-mute')[0]; //  By [J]
    // const volumeSliderEle = this.containerEle.getElementsByClassName('ecp-volume-slider')[0]; // By [J]
    const fullscreenEle = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];
    const settingBtn = this.containerEle.getElementsByClassName('ecp-button-settings')[0];
    const videoTracks = this.containerEle.getElementsByClassName('ecp-video-tracks')[0];

    playbackEle.addEventListener('click', this.handleClickPlayback.bind(this));
    // muteEle.addEventListener('click', this.handleClickMute.bind(this)); //  By [J]
    // volumeSliderEle.addEventListener('change', this.handleChangeVolumeSlider.bind(this)); // By [J]
    fullscreenEle.addEventListener('click', this.handleClickFullscreen.bind(this));
    settingBtn.addEventListener('click', this.handleClickSetting.bind(this));
    videoTracks.addEventListener('click', this.handleClickVideoTracks.bind(this));
  }

  /* Added by Jerry */
  checkAutoPlay() {
    const playBtn = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    if (this.mediaEle.autoplay) {
      addClass(playBtn.children[0], 'ecp-icon-pause');
      removeClass(playBtn.children[0], 'ecp-icon-play');
    } else {
      addClass(playBtn.children[0], 'ecp-icon-play');
      removeClass(playBtn.children[0], 'ecp-icon-pause');
    }
  }
  /* Added by Jerry End */

  handleStateChange({ newState }) {
    replaceClass(this.containerEle, /ecp-state-([a-z]*)/, `ecp-state-${newState}`);
    const playBtn = this.containerEle.getElementsByClassName('ecp-button-playback')[0];
    switch (newState) {
      case STATE_PLAYING:
        addClass(playBtn.children[0], 'ecp-icon-pause');
        removeClass(playBtn.children[0], 'ecp-icon-play');
        break;
      case STATE_PAUSED:
        addClass(playBtn.children[0], 'ecp-icon-play');
        removeClass(playBtn.children[0], 'ecp-icon-pause');
        break;
      default:
        break;
    }
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

  /* added by Jerry */
  // handleMuteChange({ state }) {
  //   console.log('calling handleMuteChange');
  //   if (state) {
  //     addClass(this.containerEle, 'ecp-is-muted');
  //   } else {
  //     removeClass(this.containerEle, 'ecp-is-muted');
  //   }
  // }
  /* added by Jerry End */

  handleClickPlayback() {
    this.core.togglePlayback();
  }

  //  By [J]
  // handleClickMute() {
  //   const newState = !this.core.getMute();

  //   this.core.setMute(newState);
  // }
  // By [J] End

  // By [J]
  handleChangeVolumeSlider({ target }) {
    const volume = parseInt(target.value, 10);

    this.core.setVolume(volume);
  }
  // By [J] End
  handleClickFullscreen() {
    const newState = !this.core.getFullscreen();
    const fullscreenBtn = this.containerEle.getElementsByClassName('ecp-button-fullscreen')[0];

    this.core.setFullscreen(newState);

    if (newState) {
      fullscreenBtn.children[0].classList.add('ecp-icon-fullscreen-exit');
      fullscreenBtn.children[0].classList.remove('ecp-icon-fullscreen');
    } else {
      fullscreenBtn.children[0].classList.add('ecp-icon-fullscreen');
      fullscreenBtn.children[0].classList.remove('ecp-icon-fullscreen-exit');
    }
  }

  handleClickSetting(e) {
    e.preventDefault();
    const settingPanel = this.containerEle.getElementsByClassName('ecp-video-tracks')[0];
    const settingsIcon = this.containerEle.getElementsByClassName('ecp-button-settings')[0];
    toggleClass(settingPanel, 'shown');
    if (hasClass(settingPanel, 'shown')) {
      settingsIcon.style.transform = 'rotate(90deg) translatez(0)';
    } else {
      settingsIcon.style.transform = 'rotate(0)';
    }
  }

  handleClickVideoTracks(e) {
    e.preventDefault();
    if (e.target.matches('.ecp-resolution')) {
      const settingPanel = this.containerEle.getElementsByClassName('ecp-video-tracks')[0];
      const settingsIcon = this.containerEle.getElementsByClassName('ecp-button-settings')[0];
      toggleClass(settingPanel, 'shown');
      settingsIcon.style.transform = 'rotate(0)';
    }
  }
}

export default View;
