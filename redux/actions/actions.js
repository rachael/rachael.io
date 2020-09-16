// Action Types
const IMAGE_LOAD_COMPLETE_BG = 'IMAGE_LOAD_COMPLETE_BG';
const IMAGE_LOAD_COMPLETE_CONTENT = 'IMAGE_LOAD_COMPLETE_CONTENT';
const LOAD_COMPLETE_CONTENT = 'LOAD_COMPLETE_CONTENT';
const LOAD_COMPLETE_PROFILE_IMAGE = 'LOAD_COMPLETE_PROFILE_IMAGE';
const REVERSE_BACKGROUND_DIRECTION = 'REVERSE_BACKGROUND_DIRECTION';
const SET_BACKGROUND_TRANSLATEY = 'SET_BACKGROUND_TRANSLATEY';
const SET_HOVER_GITHUB = 'SET_HOVER_GITHUB';
const SET_HOVER_RESUME = 'SET_HOVER_RESUME';
const WIGGLE = 'WIGGLE';

// Action Creators
export const imageLoadCompleteBG = () => ({
  type: IMAGE_LOAD_COMPLETE_BG,
});

export const imageLoadCompleteContent = () => ({
  type: IMAGE_LOAD_COMPLETE_CONTENT,
});

export const loadCompleteContent = () => ({
  type: LOAD_COMPLETE_CONTENT,
});

export const loadCompleteProfileImage = () => ({
  type: LOAD_COMPLETE_PROFILE_IMAGE,
});

export const reverseBackgroundDirection = (payload) => ({
  type: REVERSE_BACKGROUND_DIRECTION,
});

export const setBackgroundTranslateY = (payload) => ({
  type: SET_BACKGROUND_TRANSLATEY,
  payload,
});

export const setHoverGithub = (payload) => ({
  type: SET_HOVER_GITHUB,
  payload,
});

export const setHoverResume = (payload) => ({
  type: SET_HOVER_RESUME,
  payload,
});

export const wiggle = (payload) => ({
   type: WIGGLE,
   payload,
});
