import initialState from 'redux/initialState';

/**
 * Reducer for the application
 *
 * WIGGLE: controls wiggling Dots demo, disables background scroll for
 *  performance reasons
 */

// create a simple reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IMAGE_LOAD_COMPLETE_BG':
          return {
            ...state,
            imageLoadCompleteBG: true,
          }
        case 'IMAGE_LOAD_COMPLETE_CONTENT':
          return {
            ...state,
            imageLoadCompleteContent: true,
          }
        case 'LOAD_COMPLETE_CONTENT':
          return {
            ...state,
            loadCompleteContent: true,
          }
        case 'LOAD_COMPLETE_PROFILE_IMAGE':
          return {
            ...state,
            loadCompleteProfileImage: true,
          }
        case 'SET_BACKGROUND_TRANSLATEY':
          return {
            ...state,
            backgroundTranslateY: action.payload,
          }
        case 'SET_CONTENT_ANIMATING':
            return {
              ...state,
              contentAnimating: action.payload,
            }
        case 'SET_HOVER_GITHUB':
          return {
            ...state,
            hoverGithub: action.payload,
          }
        case 'SET_HOVER_RESUME':
          return {
            ...state,
            hoverResume: action.payload,
          }
        case 'WIGGLE':
            return {
              ...state,
              wiggle: action.payload,
              backgroundScroll: !action.payload,
            }
        default:
            return state
    }
};

export default reducer;
