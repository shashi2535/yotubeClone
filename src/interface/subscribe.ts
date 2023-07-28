import { IAvtarAttributes } from './avtar';
import { IchannelAttributes } from './channel';

interface ISubscribeAttributes {
  id?: number;
  subscribe_uuid?: string;
  subscribed_channel_id?: number;
  subscribed_user_id?: number;
  subscribed_channel_id_count?: number;
  subscribed_channel_uuid?: string;
  Channel?: IchannelAttributes;
  Avtar?: IAvtarAttributes;
  created_at?: Date;
  updated_at?: Date;
}
interface ISubscribeData {
  id?: number;
  subscribe_uuid?: string;
  subscribed_channel_id?: number;
  subscribed_user_id?: number;
  subscribed_channel_id_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface IcreateSubscribe {
  input: {
    channel_id: string;
  };
}
interface IRemoveSubscribe {
  input: {
    subscribe_id: string;
  };
}

export { ISubscribeAttributes, IcreateSubscribe, IRemoveSubscribe };
