import { WIGGLE } from 'redux/actions';
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
        case 'SET_CONTENT_ANIMATING':
            return {
              ...state,
              contentAnimating: action.payload,
            };
        case 'WIGGLE':
            return {
              ...state,
              wiggle: action.payload,
              backgroundScroll: !action.payload,
            };
        default:
            return state
    }
};

export default reducer;
