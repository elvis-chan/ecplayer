import DefaultProvider from './DefaultProvider';

class HlsProvider extends DefaultProvider {
  instance = null;

  // eslint-disable-next-line class-methods-use-this
  getName() {
    return { name: 'hls' };
  }

  setup(options) {
    super.setup(options);

    const { Hls } = window;

    this.instance = new Hls({
      // eslint-disable-next-line no-param-reassign
      // xhrSetup: (xhr) => { xhr.withCredentials = true; },
    });

    if (options.autoplay) {
      this.mediaEle.autoplay = true;
    }

    if (options.mute) {
      this.mediaEle.muted = true;
    }

    this.instance.loadSource(options.file);
    this.instance.attachMedia(this.mediaEle);

    this.instance.on(Hls.Events.MANIFEST_LOADED, this.handleLoadedManifest.bind(this));
  }

  handleLoadedManifest(e, { levels, audioTracks }) {
    this.qualityLevels = levels;
    this.audioTracks = audioTracks;

    this.handleBuffering();
  }
}

export default HlsProvider;
