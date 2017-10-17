export default (parent) => {
  let media = null;

  if (parent) {
    media = parent.querySelector('video');
  }

  if (!media) {
    const container = parent.getElementsByClassName('ecp-media')[0];

    media = document.createElement('video');
    container.appendChild(media);
  }

  media.className = 'ecp-video';

  return media;
};
