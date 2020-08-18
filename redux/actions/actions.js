// Action Types
export const SET_CONTENT_ANIMATING = "SET_CONTENT_ANIMATING";
export const WIGGLE = "WIGGLE";

// Action Creator
export const setContentAnimating = (payload) => ({
  type: SET_CONTENT_ANIMATING,
  payload,
});

export const wiggle = (payload) => ({
   type: WIGGLE,
   payload,
});
