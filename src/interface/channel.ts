import { IAvtarAttributes } from './avtar';

interface context {
  userId: number;
  user_uuid: string;
}

interface createChannel {
  channel_name?: string;
  handle?: string;
  profile_picture?: any;
}
interface IchannelAttributes {
  id: number;
  chanel_uuid?: string;
  UserId?: number;
  channel_name?: string;
  handle?: string;
  discription?: string;
  created_at?: Date;
  updated_at?: Date;
  Avtar?: IAvtarAttributes;
}

export { context, createChannel, IchannelAttributes };
