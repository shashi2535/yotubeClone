export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging',
}
export const user = process.env.NODE_ENV === 'development' ? '0' : 'user';

export enum ApiVersions {
  V1 = 'v1',
  V2 = 'v2',
}

export enum Locale {
  EN = 'en',
  HI = 'hi',
}

export enum VideoTypes {
  SHORT = 'shorts',
  VIDEO = 'full_video',
}

export enum Like_types {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export enum MIME_TYPE {
  FOR_VIDEO = 'video/mp4',
  FOR_IMAGE = 'image/png',
}
