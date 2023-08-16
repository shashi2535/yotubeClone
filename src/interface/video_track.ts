interface IvideoTrackAttributes {
  id?: number;
  video_track_uuid?: string;
  user_id?: number;
  video_id?: number;
  start_time?: number;
  end_time?: number;
  is_watched?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export { IvideoTrackAttributes };
