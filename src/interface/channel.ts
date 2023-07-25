import { IAvtarAttributes } from './avtar';
import { IUserAttributes } from './user';

interface Icontext {
  userId: number;
  user_uuid: string;
}

interface IcreateChannel {
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
  User?: IUserAttributes;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IdeleteChannel {}

export { Icontext, IcreateChannel, IchannelAttributes, IdeleteChannel };
