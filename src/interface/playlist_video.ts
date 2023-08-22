interface IPlaylistVideoAttributes {
  id: number;
  playlist_id: number;
  video_id: number;
  playlist_video_uuid: string;
  created_at?: Date;
  updated_at?: Date;
}

export { IPlaylistVideoAttributes };
