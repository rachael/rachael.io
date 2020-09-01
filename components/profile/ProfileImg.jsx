import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadCompleteContent, setContentAnimating } from 'redux/actions';
import { Overlay } from './overlay';

import styles from 'styles/home/Profile.module.scss';

function ProfileImg() {
  const dispatch = useDispatch();

  const imgRef = useRef();
  const borderRef = useRef();

  const imgControls = useAnimation();
  const borderControls = useAnimation();
  const imgScale = useMotionValue(1.7);
  const borderScale = useMotionValue(1.04);

  const borderStrokeWidth = 4; // TODO: set to 5 on very large screens

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
    const unsubscribeSetPositionOnScale = borderScale.onChange(setBorderFillPosition);
    return () => {
      unsubscribeSetPositionOnScale();
    }
  });

  // Image load
  // breatheStarted: true if initial breathe animation has been started
  const [breatheStarted, setBreatheStarted] = useState();
  // loaded: true if image has finished loading and started its 'pulse' animation.
  // ensures pulse is only fired off once.
  const [loaded, setLoaded] = useState();
  // loadedFromCache: hides the loading indicator to prevent flash
  const [loadedFromCache, setLoadedFromCache] = useState();
  // loadComplete store variables
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  // timeout ID for pulse on load, safeguards that the ID does not get destroyed
  // by render cycle before timeout can be cleared
  const [loadTimeoutID, setLoadTimeoutID] = useState();
  // callback on img load complete
  const setLoadCompleteCB = useCallback(() => {
    if(!isLoadCompleteContent) {
      dispatch(loadCompleteContent());
    }
  }, [isLoadCompleteContent, dispatch]);

  useEffect(() => {
    // start breathe once
    if (!breatheStarted) {
      borderControls.start('breathe');
      setBreatheStarted(true);
    }

    // image has been loaded from cache
    if(!isLoadCompleteContent && imgRef.current && imgRef.current.complete) {
      dispatch(loadCompleteContent());
      setLoadedFromCache(true);
    }

    // once loaded, wait 1.6 seconds to show enlarged profile img and then pulse
    if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
      setLoaded(true);
      const timeoutID = setTimeout(() => {
        imgControls.start('pulse');
        borderControls.start('pulse')
          .then(() => {
            dispatch(setContentAnimating(false));
            borderControls.start('fadeInAndBreathe');
          })
          .then(() => borderControls.start('breathe'));
      }, 1600);
      setLoadTimeoutID(timeoutID);
    }
    return () => {
      clearTimeout(loadTimeoutID);
    };
  }, [
    breatheStarted,
    loaded,
    isLoadCompleteBG,
    isLoadCompleteContent
  ]);

  // Button hover states -- add overlay to profile image
  const hoverGithub = useSelector(state => state.hoverGithub);
  const hoverResume = useSelector(state => state.hoverResume);

  let imgSrc = '/images/profile_sm.png';
  if (hoverGithub || hoverResume) {
    imgSrc = '/images/profile_sm_blur.png';
  }

  // Wrapper classes
  const imgClasses = classNames(
    styles['profile-img'],
    {
      [styles['loading']]: !(isLoadCompleteBG || isLoadCompleteContent),
      [styles['loaded-from-cache']]: loadedFromCache,
      [styles['hover-github']]: hoverGithub,
      [styles['hover-resume']]: hoverResume,
    }
  );

  // Mouse enter
  const contentAnimating = useSelector(state => state.contentAnimating);
  const mouseEnterPulse = useCallback(() => {
    if(!contentAnimating) {
      borderControls.start('reset')
        .then(() => borderControls.start('mouseEnterPulse'))
        .then(() => borderControls.start('fadeInAndBreathe'))
        .then(() => borderControls.start('breathe'));
    }
  }, [contentAnimating]);

  // Animations
  const backgroundTranslateY = useSelector(state => state.backgroundTranslateY);

  const imgVariants = {
    visible: {
      scale: 1.7,
      translateY: '40%',
    },
    pulse: {
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
    fadeInAndBreathe: {
      scale: [1.04, 1.07, 1.10, 1.07, 1.11, 1.05, 1.09, 1.04],
      opacity: [0, 1, 1, 1, 1, 1, 1, 1],
      transition: {
        duration: 16,
        times: [0, .0833, .1667, .3333, .5, .6667, .8333, 1]
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
    mouseEnterPulse: {
      scale: 3,
      opacity: 0,
      transition: {
        duration: 0.6,
      }
    }
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
      initial="visible"
      animate={imgControls}
      onMouseEnter={mouseEnterPulse}
    >
      <AnimatePresence>
        {!(isLoadCompleteBG || isLoadCompleteContent) && loadingIndicator}
        <motion.img
          ref={imgRef}
          key={imgSrc}
          src={imgSrc}
          alt="Profile picture"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <svg
          key="profile-img-border"
          className={styles['profile-img-border']}
        >
          <pattern
            key="profile-fill-pattern"
            id="profileBorderFill"
            patternUnits="userSpaceOnUse"
            width="100vw"
            height="300vh"
            x={`-${borderStrokeWidth}px`}
            y={`-${borderStrokeWidth}px`}
            patternTransform={`scale(${1/(borderScale.get() * imgScale.get())})`}
          >
            <image
              className={styles['profile-fill']}
              x={borderFillX}
              y={borderFillY}
              width="100vw"
              height="300vh"
              preserveAspectRatio="xMinYMin slice"
              href="/images/bg_postits_blur.png"
              style={{ transform: `translateY(${backgroundTranslateY})` }}
            />
          </pattern>
          <motion.circle
            key="profile-img-border-circle"
            ref={borderRef}
            className={styles['profile-img-border-circle']}
            cx="50%"
            cy="50%"
            r="50%"
            stroke={isLoadCompleteBG ? 'url(#profileBorderFill)' : 'black'}
            strokeWidth={borderStrokeWidth}
            fill="none"
            opacity="1"
            variants={borderVariants}
            animate={borderControls}
            style={{ scale: borderScale }}
          />
        </svg>
        {hoverGithub && (<Overlay
          className="profile-img-github"
          overlayText="GITHUB"
          items={["Portfolio", "Projects"]} />
        )}
        {hoverResume && (<Overlay
          className="profile-img-resume"
          overlayText="RESUME"
          items={["Contact", "Skills", "Experience"]} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProfileImg;
