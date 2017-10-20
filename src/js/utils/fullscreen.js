export const isInFullscreen = () =>
  (document.fullscreenElement && document.fullscreenElement !== null) ||
  (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
  (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
  (document.msFullscreenElement && document.msFullscreenElement !== null);

export const requestFullscreen = (ele) => {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullScreen) {
    ele.webkitRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
};

export const exitFullscreen = (ele = document) => {
  if (ele.exitFullscreen) {
    ele.exitFullscreen();
  } else if (ele.webkitExitFullscreen) {
    ele.webkitExitFullscreen();
  } else if (ele.mozCancelFullScreen) {
    ele.mozCancelFullScreen();
  } else if (ele.msExitFullscreen) {
    ele.msExitFullscreen();
  }
};

export default { isInFullscreen, requestFullscreen, exitFullscreen };
