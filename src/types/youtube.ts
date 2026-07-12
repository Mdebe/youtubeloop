export interface YoutubeVideoElement extends HTMLVideoElement {}

export interface YoutubePlayerState {
  video: YoutubeVideoElement | null
  videoId: string | null
  isReady: boolean
}