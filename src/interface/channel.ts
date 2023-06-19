interface context {
  userId: number;
  user_uuid: string;
}

interface createChannel {
  input: {
    channel_name: string;
    handle: string;
  };
}

export { context, createChannel };
