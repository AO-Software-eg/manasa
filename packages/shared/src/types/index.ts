export * from './user';
export * from './courses';
export * from './lecture';
export * from './exams';


declare global {
  interface Window {
    VdoPlayer: {
      getInstance: (iframe: HTMLIFrameElement) => any;
    };

    onVdoPlayerV2APIReady?: () => void;
  }
}