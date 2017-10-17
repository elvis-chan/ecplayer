import * as _ from 'underscore';
import shaka from 'shaka-player';

import { replaceWith, replaceClass, addClass, removeClass } from 'utils/dom';
import ee from 'utils/events';
import getMediaElement from 'api/getMediaElement';
import playerTemplate from 'templates/player.html';

export default class Api {
  constructor(domElement) {
    this.playerId = domElement.id;
    this.playerContainer = domElement;

    this.aspectRatio = 9 / 16;
    this.instance = null;
  }

  updateAspectRatio() {
    const aspectElement = this.playerContainer.getElementsByClassName('ecp-aspect')[0];

    aspectElement.style.paddingTop = `${this.aspectRatio * 100}%`;
  }

  identifyMediaContent() {
    if (this.instance.isLive()) {
      addClass(this.playerContainer, 'ecp-is-live');
    } else {
      removeClass(this.playerContainer, 'ecp-is-live');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  on(name, callback) {
    return ee.on(name, callback);
  }

  handleLoadedMetadata() {
    const media = getMediaElement(this.playerContainer);

    console.debug('onloadedmetadata', media.videoHeight, media.videoWidth);

    const playbackBtnElement = this.playerContainer.getElementsByClassName('ecp-button-playback')[0];
    const muteBtnElement = this.playerContainer.getElementsByClassName('ecp-button-mute')[0];
    const volumeSliderElement = this.playerContainer.getElementsByClassName('ecp-volume-slider')[0];
    const fullscreenBtnElement = this.playerContainer.getElementsByClassName('ecp-button-fullscreen')[0];

    playbackBtnElement.addEventListener('click', this.handleClickPlaybackBtn.bind(this));
    muteBtnElement.addEventListener('click', this.handleClickMuteBtn.bind(this));
    volumeSliderElement.addEventListener('change', this.handleChangeVolumeSlider.bind(this));
    fullscreenBtnElement.addEventListener('click', this.handleClickFullscreenBtn.bind(this));
  }

  handleClickPlaybackBtn(e) {
    const mediaElement = getMediaElement(this.playerContainer);

    if (mediaElement.paused) {
      mediaElement.play();
      e.target.innerHTML = 'pause';
    } else {
      mediaElement.pause();
      e.target.innerHTML = 'play';
    }
  }

  handleClickMuteBtn() {
    const mediaElement = getMediaElement(this.playerContainer);
    const volumeSliderElement = this.playerContainer.getElementsByClassName('ecp-volume-slider')[0];
    const muteBtnElement = this.playerContainer.getElementsByClassName('ecp-button-mute')[0];

    console.debug(mediaElement.volume, mediaElement.muted);

    if (mediaElement.muted) {
      mediaElement.muted = false;
      volumeSliderElement.value = mediaElement.volume * 100;
      muteBtnElement.innerHTML = 'mute';
    } else {
      mediaElement.muted = true;
      volumeSliderElement.value = 0;
      muteBtnElement.innerHTML = 'unmute';
    }
  }

  handleChangeVolumeSlider(e) {
    const muteBtnElement = this.playerContainer.getElementsByClassName('ecp-button-mute')[0];
    const mediaElement = getMediaElement(this.playerContainer);

    console.debug('handleChangeVolumeSlider', e.target.value);

    mediaElement.muted = false;
    mediaElement.volume = e.target.value / 100;
    muteBtnElement.innerHTML = 'mute';
  }

  handleClickFullscreenBtn() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.playerContainer.requestFullscreen();
    }
  }

  handleLoadedManifest() {
    this.identifyMediaContent();

    ee.emit('ready');

    const mediaElement = getMediaElement(this.playerContainer);
    const muteBtnElement = this.playerContainer.getElementsByClassName('ecp-button-mute')[0];
    const volumeSliderElement = this.playerContainer.getElementsByClassName('ecp-volume-slider')[0];

    if (mediaElement.muted) {
      volumeSliderElement.value = 0;
      muteBtnElement.innerHTML = 'unmute';
    } else {
      volumeSliderElement.value = mediaElement.volume * 100;
      muteBtnElement.innerHTML = 'mute';
    }

    this.renderVideoTracks();
  }

  renderVideoTracks() {
    this.variantTracks = this.instance.getVariantTracks();

    const videoTracksElement = this.playerContainer.getElementsByClassName('ecp-video-tracks')[0];

    _.each(this.variantTracks, (track) => {
      const { id, height } = track;
      const optionElement = document.createElement('option');
      optionElement.value = id;
      optionElement.innerHTML = `${height}p`;

      videoTracksElement.appendChild(optionElement);
    });

    videoTracksElement.addEventListener('change', this.handleChangeVideoTrack.bind(this));
  }

  handleChangeVideoTrack() {
    const videoTracksElement = this.playerContainer.getElementsByClassName('ecp-video-tracks')[0];

    const matchedTrackIdx = _.findIndex(this.variantTracks, ({ id }) => {
      const selectedTrackIdx = videoTracksElement.selectedIndex;

      return parseInt(videoTracksElement[selectedTrackIdx].value, 10) === id;
    });

    if (matchedTrackIdx === -1) {
      this.instance.configure({ abr: { enabled: true } });
    } else {
      this.instance.configure({ abr: { enabled: false } });
      this.instance.selectVariantTrack(this.variantTracks[matchedTrackIdx], true);
    }
  }

  handleBuffering(e) {
    if (e.buffering) {
      replaceClass(this.playerContainer, /ecp-state-([a-z]*)/, 'ecp-state-buffering');
    } else {
      removeClass(this.playerContainer, 'ecp-state-buffering');
    }
  }

  handlePause() {
    console.debug('onpause');

    replaceClass(this.playerContainer, /ecp-state-([a-z]*)/, 'ecp-state-paused');
  }

  handleCanPlayThrough() {
    console.debug('oncanplaythrough');

    replaceClass(this.playerContainer, /ecp-state-([a-z]*)/, 'ecp-state-playing');
  }

  handleFullscreenChange() {
    const fullscreenBtnElement = this.playerContainer.getElementsByClassName('ecp-button-fullscreen')[0];

    if (document.webkitIsFullScreen === false) {
      fullscreenBtnElement.innerHTML = 'fullscreen';
      removeClass(this.playerContainer, 'ecp-is-fullscreen');
    } else {
      fullscreenBtnElement.innerHTML = 'fullscreen_exit';
      addClass(this.playerContainer, 'ecp-is-fullscreen');
    }
  }

  setup({ file, mute = false }) {
    const playerContent = { content: playerTemplate, id: this.playerId };

    this.playerContainer = replaceWith(this.playerContainer, playerContent);

    this.updateAspectRatio();

    const mediaElement = getMediaElement(this.playerContainer);

    // mediaElement.controls = true;
    mediaElement.autoplay = true;

    if (mute) {
      mediaElement.muted = true;
    }

    shaka.polyfill.installAll();

    const player = new shaka.Player(mediaElement);

    this.instance = player;

    player.addEventListener('buffering', this.handleBuffering.bind(this));
    mediaElement.addEventListener('loadedmetadata', this.handleLoadedMetadata.bind(this));
    mediaElement.addEventListener('canplaythrough', this.handleCanPlayThrough.bind(this));
    mediaElement.addEventListener('pause', this.handlePause.bind(this));
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));

    player.load(file).then(this.handleLoadedManifest.bind(this));

    return this;
  }
}
