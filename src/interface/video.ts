import { IAvtarAttributes } from './avtar';
import { IchannelAttributes } from './channel';

interface IVideoAttributes {
  id?: number;
  video_uuid?: string;
  channel_id?: number;
  user_id?: number;
  video_url?: string;
  description?: string;
  type?: string;
  title?: string;
  public_id?: string;
  video_view?: number;
  duration?: number;
  Channel?: IchannelAttributes;
  Avtar?: IAvtarAttributes;
  created_at?: Date;
  updated_at?: Date;
}
interface IVideoFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}
interface ICreateVideo {
  input: {
    title: string;
    description: string;
  };
  video_url?: Promise<IVideoFile>;
}

interface IdeleteVideo {
  input: {
    video_id: string;
  };
}
interface IUpdateVideo {
  input: {
    video_id: string;
    title: string;
    description: string;
  };
}
interface IGetVideo {
  input: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    type?: string;
    title?: string;
    video_uuid?: string;
    fields?: string;
  };
}

export { IVideoAttributes, ICreateVideo, IdeleteVideo, IUpdateVideo, IGetVideo, IVideoFile };
