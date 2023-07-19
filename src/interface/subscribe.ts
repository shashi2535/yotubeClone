interface ISubscribeAttributes {
  id?: number;
  subscribe_uuid?: string;
  subscribed_channel_id?: number;
  subscribed_user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface IcreateSubscribe {
  input: {
    channel_id: string;
  };
}

export { ISubscribeAttributes, IcreateSubscribe };
