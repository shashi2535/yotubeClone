interface IAvtarAttributes {
  id: number;
  image_uuid: string;
  avtar_url: string;
  user_id?: number | null;
  public_id?: string | undefined;
  channel_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export { IAvtarAttributes };
