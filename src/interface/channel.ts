interface context {
  userId: number;
  user_uuid: string;
}

interface createChannel {
  channel_name: string;
  handle: string;
}

export { context, createChannel };
