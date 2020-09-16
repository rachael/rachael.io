import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { imageLoadCompleteContent, loadCompleteProfileImage } from 'redux/actions';
import { Overlay } from './overlay';

import styles from 'styles/home/Profile.module.scss';

function ProfileImg() {
  // Must detect Firefox because animations are too laggy in Firefox to run
  // All browser detection credit goes to https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
  const isFirefox = typeof InstallTrigger !== 'undefined';

  const dispatch = useDispatch();

  const imgRef = useRef();
  const borderRef = useRef();

  const imgControls = useAnimation();
  const borderControls = useAnimation();
  const imgScale = useMotionValue(1);
  const borderScale = useMotionValue(1.06);

  const borderStrokeWidth = 4; // TODO: set to 5 on very large screens

  // Absolute units for Firefox/Safari
  // Necessary because Firefox/Safari requires absolute units on svg elements,
  // so vw/vh cannot be used. Emulates vw/vh by updating on resize.
  // http://ronaldroe.com/psa-viewport-units-on-svg/
  const [[windowWidth, windowHeight], setWindowSize] = useState([0, 0]);
  const [absoluteUnits, setAbsoluteUnits] = useState({});
  const [positions, setPositions] = useState({});

  const updateWindowSize = () => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  };

  const updateAbsoluteUnits = () => {
    setAbsoluteUnits({
      '100vw': windowWidth,
      '300vh': windowHeight * 3,
    });
  };

  useEffect(() => {
    updateWindowSize();
  }, []);

  useEffect(() => {
    updateAbsoluteUnits();
  }, [windowWidth, windowHeight]);

  // Window resize listener
  // Updates all absolutely set positions on resize for Firefox/Safari
  useEffect(() => {
    const onResize = () => {
      updateWindowSize();
      updateAbsoluteUnits();
    }
    // detect orientation change (works for iOS -- and first 'resize' is required)
    if ("onorientationchange" in window) window.addEventListener('resize orientationchange', onResize);
    else window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('resize orientataionchange', onResize);
    }
  });

  // Disable scale animations in Safari, mobile, and Firefox.
  // A function so that it will be up to date when used from within setTimeout.
  // Must detect Safari because Safari does not properly support SVG overflows
  // due to scaling and clips the ring SVG so animation must be turned off.
  // Mobile has the same problem.
  // Also disable in Firefox as animations look terrible.
  // All browser detection credit goes to https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
  const isSafari = () => {
    return /constructor/i.test(window.HTMLElement) || (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  };

  const scaleAnimationsEnabled = () => {
    if(isFirefox || isSafari() || windowWidth < 800) return false;
    return true;
  };

  // Set position of profile border fill so pattern acts as a mask.
  // fill position:
  const [borderFillX, setBorderFillX] = useState(0);
  const [borderFillY, setBorderFillY] = useState(0);

  const setBorderFillPosition = () => {
    const borderPos = borderRef.current.getBoundingClientRect();
    setBorderFillX(`${-borderPos.x + borderStrokeWidth}px`);
    setBorderFillY(`${-borderPos.y + borderStrokeWidth}px`);
  };

  useEffect(() => {
    // on mount:
    setBorderFillPosition();

    // on scale:
    const unsubscribeBorderScale = borderScale.onChange(setBorderFillPosition);
    const unsubscribeImageScale = imgScale.onChange(setBorderFillPosition);
    return () => {
      unsubscribeBorderScale();
      unsubscribeImageScale();
    }
  });

  // Image load
  // scaled: true if the image has been scaled for initial load animation
  const [scaled, setScaled] = useState();
  // breatheStarted: true if initial breathe animation has been started
  const [breatheStarted, setBreatheStarted] = useState();
  // loaded: true if image has finished loading and started its 'pulse' animation.
  // ensures pulse is only fired off once.
  const [loaded, setLoaded] = useState();
  // loadedFromCache: hides the loading indicator to prevent flash
  const [loadedFromCache, setLoadedFromCache] = useState();
  // loadComplete store variables
  const isImageLoadCompleteBG = useSelector(state => state.imageLoadCompleteBG);
  const isImageLoadCompleteContent = useSelector(state => state.imageLoadCompleteContent);
  // timeout ID for pulse on load, safeguards that the ID does not get destroyed
  // by render cycle before timeout can be cleared
  const [loadTimeoutID, setLoadTimeoutID] = useState();
  // callback on img load complete
  const setLoadCompleteCB = useCallback(() => {
    if(!isImageLoadCompleteContent) {
      dispatch(imageLoadCompleteContent());
    }
  }, [isImageLoadCompleteContent, dispatch]);

  useEffect(() => {
    if(windowWidth) {
      // only scale image for loading animation on large screens
      // do not scale in Firefox (animations look terrible)
      if(!scaled && windowWidth >= 800 && !isFirefox) {
        imgControls.start('scaled').then(() => setBorderFillPosition());
        setScaled(true);
      }

      // start breathe once
      if (!breatheStarted && scaleAnimationsEnabled()) {
        borderControls.start('breathe');
        setBreatheStarted(true);
      }

      // image has been loaded from cache
      if(!isImageLoadCompleteContent && imgRef.current && imgRef.current.complete) {
        dispatch(imageLoadCompleteContent());
        setLoadedFromCache(true);
      }

      // once loaded, wait 1.6 seconds to show enlarged profile img and then pulse
      // firefox: fade out profile ring, then fade in when pulse is over
      // mobile: don't wait as image is not scaled
      if(!loaded && isImageLoadCompleteBG && isImageLoadCompleteContent) {
        setLoaded(true);
        if(windowWidth >= 800 && !isFirefox) {
          // large screens
          const timeoutID = setTimeout(() => {
            if(!scaleAnimationsEnabled()) {
              // no scale animations; Safari
              imgControls.start('imgPulse')
                .then(() => {
                  dispatch(loadCompleteProfileImage());
                });
            } else {
              // pulse animation
              imgControls.start('imgPulse');
              borderControls.start('pulse')
                .then(() => {
                  dispatch(loadCompleteProfileImage());
                  borderControls.start('fadeInAndBreathe');
                })
                .then(() => borderControls.start('breathe'));
            }
          }, 1600);
          setLoadTimeoutID(timeoutID);
        } else {
          // mobile
          dispatch(loadCompleteProfileImage());
        }
      }
      return () => {
        clearTimeout(loadTimeoutID);
      };
    }
  }, [
    breatheStarted,
    isImageLoadCompleteBG,
    isImageLoadCompleteContent,
    loaded,
    windowWidth,
  ]);

  // Button hover states -- add overlay to profile image
  const hoverGithub = useSelector(state => state.hoverGithub);
  const hoverResume = useSelector(state => state.hoverResume);

  let imgSrc = '/images/profile_sm.png';
  if (windowWidth >= 800 && (hoverGithub || hoverResume)) {
    imgSrc = '/images/profile_sm_blur.png';
  }

  // Wrapper classes
  const imgClasses = classNames(
    styles['profile-img'],
    {
      [styles['loading']]: !(isImageLoadCompleteBG || isImageLoadCompleteContent),
      [styles['loaded-from-cache']]: loadedFromCache,
      [styles['hover-github']]: windowWidth >= 800 && hoverGithub,
      [styles['hover-resume']]: windowWidth >= 800 && hoverResume,
    }
  );

  // Mouse enter
  const isLoadCompleteProfileImage = useSelector(state => state.loadCompleteProfileImage);
  const mouseEnterPulse = useCallback(() => {
    if(isLoadCompleteProfileImage && !isFirefox && scaleAnimationsEnabled()) {
      borderControls.start('reset')
        .then(() => borderControls.start('mouseEnterPulse'))
        .then(() => borderControls.start('fadeInAndBreathe'))
        .then(() => borderControls.start('breathe'));
    }
  }, [isLoadCompleteProfileImage, windowWidth]);

  // Animations
  const backgroundTranslateY = useSelector(state => state.backgroundTranslateY);

  const imgVariants = {
    scaled: {
      scale: 1.7,
      translateY: '40%',
      transition: {
        duration: 0.01,
      }
    },
    imgPulse: {
      scale: 1,
      translateY: 0,
      transition: {
        duration: 1,
        ease: [[.71,-0.37,.46,.99]],
      }
    }
  };

  const borderVariants = {
    breathe: {
      scale: [1.04, 1.10, 1.07, 1.11, 1.05, 1.09, 1.04],
      transition: {
        yoyo: Infinity,
        duration: 16,
      }
    },
    fadeIn: {
      opacity: 1,
    },
    fadeInAndBreathe: {
      scale: [1.04, 1.07, 1.10, 1.07, 1.11, 1.05, 1.09, 1.04],
      opacity: [0, 1, 1, 1, 1, 1, 1, 1],
      transition: {
        duration: 16,
        times: [0, .0833, .1667, .3333, .5, .6667, .8333, 1]
      }
    },
    fadeOut: {
      opacity: 0,
    },
    mouseEnterPulse: {
      scale: 3,
      opacity: 0,
      transition: {
        duration: 0.6,
      }
    },
    pulse: {
      scale: 3,
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
    reset: {
      opacity: 1,
      scale: 1.04,
      transition: {
        duration: 0,
      }
    },
    resetScale: {
      scale: 1.06,
      transition: {
        duration: 0,
      }
    },
  };

  // Loading indicator
  const loadingIndicator = (
    <motion.div
      key="loading"
      className={styles['loading-indicator']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles['loading-spinner']}>
        <div className={styles['loading-dot1']} />
        <div className={styles['loading-dot2']} />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      key="profile-img"
      className={imgClasses}
      variants={imgVariants}
      style={{ scale: imgScale }}
      animate={imgControls}
    >
      <AnimatePresence>
        {!(isImageLoadCompleteBG || isImageLoadCompleteContent) && loadingIndicator}
        <motion.img
          ref={imgRef}
          key={imgSrc}
          src={imgSrc}
          alt="Profile picture"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseEnter={mouseEnterPulse}
        />
        <svg
          key="profile-img-border"
          className={styles['profile-img-border']}
        >
          <defs>
            <pattern
              key="profile-fill-pattern"
              id="profileBorderFill"
              patternUnits="userSpaceOnUse"
              width={absoluteUnits['100vw']}
              height={absoluteUnits['300vh']}
              x={`-${borderStrokeWidth}px`}
              y={`-${borderStrokeWidth}px`}
              patternTransform={`scale(${1/(borderScale.get() * imgScale.get())})`}
            >
              <image
                className={styles['profile-fill']}
                x={borderFillX}
                y={borderFillY}
                width={absoluteUnits['100vw']}
                height={absoluteUnits['300vh']}
                preserveAspectRatio="xMinYMin slice"
                href="/images/bg_postits_blur.png"
                style={{ transform: `translateY(${backgroundTranslateY})` }}
              />
            </pattern>
          </defs>
          <motion.circle
            key="profile-img-border-circle"
            ref={borderRef}
            className={styles['profile-img-border-circle']}
            cx="50%"
            cy="50%"
            r="50%"
            stroke={isImageLoadCompleteBG ? 'url(#profileBorderFill)' : 'black'}
            strokeWidth={borderStrokeWidth}
            fill="none"
            opacity="1"
            variants={borderVariants}
            animate={borderControls}
            style={{ scale: borderScale }}
          />
        </svg>
        {windowWidth >= 800 && hoverGithub && (<Overlay
          className="profile-img-github"
          overlayText="GITHUB"
          items={["Portfolio", "Projects"]} />
        )}
        {windowWidth >= 800 && hoverResume && (<Overlay
          className="profile-img-resume"
          overlayText="RESUME"
          items={["Contact", "Skills", "Experience"]} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProfileImg;
