// Action Types
export const SET_HOVER_GITHUB = "SET_HOVER_GITHUB";
export const SET_HOVER_RESUME = "SET_HOVER_RESUME";
export const SET_CONTENT_ANIMATING = "SET_CONTENT_ANIMATING";
export const WIGGLE = "WIGGLE";

// Action Creator
export const setHoverGithub = (payload) => ({
  type: SET_HOVER_GITHUB,
  payload,
});

export const setHoverResume = (payload) => ({
  type: SET_HOVER_RESUME,
  payload,
});

export const setContentAnimating = (payload) => ({
  type: SET_CONTENT_ANIMATING,
  payload,
});

export const wiggle = (payload) => ({
   type: WIGGLE,
   payload,
});
