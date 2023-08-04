interface IPlaylistAttributes {
  id: number;
  playlist_name: string;
  channel_id: number;
  playlist_uuid: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

interface IPlaylistCreateAttributes {
  input: {
    playlist_name: string;
    channel_id: string;
  };
}

interface IDeletePlayListAttributes {
  input: {
    playlist_id: string;
  };
}

export { IPlaylistAttributes, IPlaylistCreateAttributes, IDeletePlayListAttributes };
