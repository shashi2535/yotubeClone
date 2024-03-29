import i18next from 'i18next';
import * as yup from 'yup';
import { Like_types, VideoTypes } from '../constant';
// i18next.t('STATUS.INVALID_EMAIL');

const phone = yup
  .string()
  .required('phone is required.')
  .min(5, i18next.t('STATUS.PHONE_MIN_CHAR_REQUIRED'))
  .max(13, i18next.t('STATUS.PHONE_MAX_CHAR_REQUIRED'))
  .matches(/^([7-9]{1})([0-9]{9})$/, i18next.t('STATUS.PHONE_VALID'));

const first_name = yup
  .string()
  .required('First Name is required.')
  .trim()
  .min(3, i18next.t('STATUS.FIRST_NAME_MIN_CHAR'));
const last_name = yup.string().required('Last name is required.').min(3, i18next.t('STATUS.LAST_NAME_MIN_CHAR'));
const email = yup.string().required('Email is required.').email(i18next.t('STATUS.INVALID_EMAIL'));
const password = yup
  .string()
  .required('Password is required.')
  .min(5, 'Password should have atleast 5 characters.')
  .max(10, 'Password should have atmost 10 characters.');
const otp = yup
  .string()
  .required('otp is required')
  .min(6, 'otp should have atleast 6 characters.')
  .max(6, 'otp should have atleast 6 characters.');
const code = yup.string().required('code is required').min(8, 'code should have atleast 8 characters.');
const channel_id = yup.string().required('channel_id is required');
const video_id = yup.string().required('video_id is required');
const comment_id = yup.string().required(i18next.t('STATUS.COMMENT_ID_REQUIRED'));
const comment = yup.string().required('comment is required').min(5, 'comment should have atleast 5 characters.');
const title = yup.string().required('title is required').min(5, 'title should have atleast 5 characters.');
const description = yup
  .string()
  .required('description is required')
  .min(5, 'description should have atleast 5 characters.');
const type = yup.string().required(i18next.t('STATUS.TYPE_IS_REQUIRED')).oneOf([Like_types.LIKE, Like_types.DISLIKE]);
const sub_comment_id = yup.string().required('sub_comment_id is required');
const playlist_name = yup.string().required('playlist_name is required');
const playlist_id = yup.string().required('playlist_id is required');
const duration = yup.number().required('duration is required');
// for filtering pagination sorting searching
const page = yup.number();
const limit = yup.number();
const sort = yup.string();
const search = yup.string();

export const UserRegisterationRules = yup.object().shape({
  password,
  first_name,
  last_name,
  email,
  phone,
});
export const UserLoginRules = yup.object().shape({
  email,
  password,
});

export const verifyEmailRules = yup.object().shape({
  email,
  code,
});

export const resendCodeOnEmailRule = yup.object().shape({
  code,
});

export const verifyOtpRule = yup.object().shape({
  phone,
  otp,
});

export const verifiedChannelByAdminRule = yup.object().shape({
  channel_id,
});
export const verifiedCreateVideoRule = yup.object().shape({
  title,
  description,
});
export const videoUpdateRule = yup.object().shape({
  video_id,
});

export const updateVideoRule = yup.object().shape({
  video_id,
  title,
  description,
});

export const likeCreateOnVideoRule = yup.object().shape({
  video_id,
  type,
});

export const commentCreateOnVideoRule = yup.object().shape({
  video_id,
  comment,
});

export const commentDeleteOnVideoRule = yup.object().shape({
  comment_id,
});

export const commentUpdateOnVideoRule = yup.object().shape({
  comment_id,
  comment,
});

export const subCommentUpdateOnVideoRule = yup.object().shape({
  sub_comment_id,
  comment,
});

export const subCommentdeleteOnVideoRule = yup.object().shape({
  sub_comment_id,
});

export const likeCreateOnCommentRule = yup.object().shape({
  comment_id,
  type,
});

export const createPlaylistRule = yup.object().shape({
  channel_id,
  playlist_name,
});

export const removePlaylistRule = yup.object().shape({
  playlist_id,
});

export const createVideoTrackRule = yup.object().shape({
  duration,
  video_id,
});

export const getVideoRule = yup.object().shape({
  page,
  limit,
  sort,
  search,
  type: yup.string().oneOf([VideoTypes.SHORT, VideoTypes.VIDEO]),
  title: yup.string(),
  video_uuid: yup.string(),
});

export const createChannelRule = yup.object().shape({
  channel_name: yup.string().trim().min(1, 'channel_name should have atleast 5 characters.'),
  handle: yup.string().trim().min(1, 'channel_name should have atleast 5 characters.'),
});

export const nextPrevVideoRule = yup.object().shape({
  video_id,
  type: yup.string().oneOf(['next', 'previous']).required('Type Is Required.'),
});
