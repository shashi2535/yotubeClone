import { IAvtarAttributes } from './avtar';
import { IUserAttributes } from './user';
import { IVideoFile } from './video';

interface Icontext {
  userId?: number;
  user_uuid?: string;
  role?: string;
}

interface IchannelAttributes {
  id: number;
  chanel_uuid?: string;
  user_id?: number;
  channel_name?: string;
  handle?: string;
  discription?: string;
  created_at?: Date;
  updated_at?: Date;
  Avtar?: IAvtarAttributes;
  User?: IUserAttributes;
  is_verified?: boolean;
}
interface IverifiedChannelByAdmin {
  input: {
    channel_id: string;
  };
}

interface ICreateChannelReq {
  input: {
    channel_name: string;
    handle: string;
  };
  profile_picture?: Promise<IVideoFile>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IdeleteChannel {}
export { Icontext, IchannelAttributes, IdeleteChannel, IverifiedChannelByAdmin, ICreateChannelReq };
