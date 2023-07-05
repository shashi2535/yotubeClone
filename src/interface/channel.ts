interface context {
  userId: number;
  user_uuid: string;
}

interface createChannel {
  channel_name?: string;
  handle?: string;
  profile_picture?: any;
}

export { context, createChannel };
