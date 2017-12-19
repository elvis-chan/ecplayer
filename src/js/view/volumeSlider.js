import { MUTE } from 'app/events';
import { addClass, removeClass } from 'utils/dom';

class VolumeSlider {
  constructor(view, sliderEle, controlEle) {
    /* eslint-disable */
    this.view = view;
    this.slider = sliderEle;
    this.controlEle = controlEle;
    this.sliderBar = this.slider.getElementsByClassName('ecp-slider-bar')[0];
    this.filledContent = this.slider.getElementsByClassName('ecp-filled-content')[0];
    this.pointer = this.slider.getElementsByClassName('ecp-slider-pointer')[0];
    this.controlBar = this.view.containerEle.getElementsByClassName('ecp-controlbar')[0];
    this.sliderBarHidden = true;
    this.sliderBarW = 40;
    /* eslint-enable */
  }

  setup() {
    this.view.core.on(MUTE, this.handleOnVolChange.bind(this));
    this.attachEventListener.bind(this)();
  }

  handleOnVolChange({ state }) {
    if (typeof state !== 'number') {
      addClass(this.view.containerEle, 'ecp-is-muted');
      this.setSliderPosition(0);
    } else {
      /* eslint-disable */
      if (state === 0) {
        this.setSliderPosition(0.5);
        this.view.core.setVolume(50);
      } else if (state > 0) {
        removeClass(this.view.containerEle, 'ecp-is-muted');
        this.setSliderPosition(state);
      }
      /* eslint-enable */
    }
  }

  attachEventListener() {
    this.mouseEnterSlider = this.constructor.mouseEnterSlider.bind(this);
    this.mouseDownSliderBar = this.constructor.mouseDownSliderBar.bind(this);
    this.mouseClickControlEle = this.constructor.mouseClickControlEle.bind(this);
    this.mouseLeaveSlider = this.constructor.mouseLeaveSlider.bind(this);
    this.mouseMoveControlBar = this.constructor.mouseMoveControlBar.bind(this);
    this.mouseUpControlBar = this.constructor.mouseUpControlBar.bind(this);
    this.mouseLeaveControlBar = this.constructor.mouseLeaveControlBar.bind(this);

    this.slider.addEventListener('mouseenter', this.mouseEnterSlider);
    this.sliderBar.addEventListener('mousedown', this.mouseDownSliderBar);
    this.controlEle.addEventListener('click', this.mouseClickControlEle);
  }

  static mouseEnterSlider() {
    if (this.sliderBarHidden) {
      this.sliderBarHidden = false;
      this.sliderBar.style.width = `${this.sliderBarW}px`;
      this.slider.addEventListener('mouseleave', this.mouseLeaveSlider);
    }
  }

  static mouseLeaveSlider() {
    this.constructor.hideSliderBar.bind(this)();
  }

  static mouseDownSliderBar(e) {
    e.preventDefault();
    this.setSliderPositionOnEvent(e);
    this.controlBar.addEventListener('mousemove', this.mouseMoveControlBar);
    this.controlBar.addEventListener('mouseup', this.mouseUpControlBar);
    this.controlBar.addEventListener('mouseleave', this.mouseLeaveControlBar);
    this.slider.removeEventListener('mouseleave', this.mouseLeaveSlider);
  }

  static mouseClickControlEle(e) {
    e.preventDefault();
    const newMuteState = !this.view.core.getMute();
    this.view.core.setMute(newMuteState);
  }

  static mouseMoveControlBar(e) {
    e.preventDefault();
    this.setSliderPositionOnEvent(e);
  }

  static mouseUpControlBar() {
    this.controlBar.removeEventListener('mousemove', this.mouseMoveControlBar);
    this.controlBar.removeEventListener('mouseup', this.mouseUpControlBar);
  }

  static hideSliderBar() {
    this.sliderBar.style.width = '0';
    this.sliderBarHidden = true;
  }
  static mouseLeaveControlBar() {
    this.controlBar.removeEventListener('mousemove', this.mouseMoveControlBar);
    this.controlBar.removeEventListener('mouseup', this.mouseUpControlBar);
    this.controlBar.removeEventListener('mouseleave', this.mouseLeaveControlBar);
    this.constructor.hideSliderBar.bind(this)();
  }

  setSliderPositionOnEvent(e) {
    const pointerW = this.pointer.offsetWidth;
    const actualW = this.sliderBarW - pointerW;
    const leftOffset = this.sliderBar.getBoundingClientRect().left;
    const xPosition = e.clientX;
    let borderOffset = xPosition - leftOffset;
    if (borderOffset <= 0) {
      borderOffset = 0;
      this.view.core.setMute(true);
    } else if (borderOffset > 0 && borderOffset < actualW) {
      this.view.core.setMute(false);
    } else if (borderOffset >= actualW) {
      this.view.core.setMute(false);
      borderOffset = actualW;
    }
    this.filledContent.style.borderLeftWidth = `${borderOffset}px`;
    this.view.core.setVolume((borderOffset / actualW) * 100);
  }

  setSliderPosition(value) {
    const actualW = this.sliderBarW - this.pointer.offsetWidth;
    if (value <= 0) {
      this.filledContent.style.borderLeftWidth = '0';
    } else if (value > 0 && value < 1) {
      this.filledContent.style.borderLeftWidth = `${(value * actualW)}px`;
    } else if (value >= 1) {
      this.filledContent.style.borderLeftWidth = `${actualW}px`;
    }
  }
}

export default VolumeSlider;
