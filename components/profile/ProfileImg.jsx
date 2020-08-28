import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadCompleteContent, setContentAnimating } from 'redux/actions';
import { Overlay } from './overlay';

import styles from 'styles/home/Profile.module.scss';

function ProfileImg() {
  const dispatch = useDispatch();

  // Set position of profile border background image so pattern acts as a mask
  const profileBorderStrokeWidth = 4;
  const [profileFillX, setProfileFillX] = useState(0);
  const [profileFillY, setProfileFillY] = useState(0);

  const setProfileFillPosition = () => {
    const profileImgPos = imgRef.current.getBoundingClientRect();
    setProfileFillX(`${-profileImgPos.x + profileBorderStrokeWidth}px`);
    setProfileFillY(`${-profileImgPos.y + profileBorderStrokeWidth}px`);
  };

  useEffect(() => {
    setProfileFillPosition();
  });

  // Send off pulse when animating in.
  const scale = useMotionValue(1.7);
  const borderScale = useMotionValue(1.04);

  useEffect(() => {
    const unsubscribeBorderBackgroundScale = scale.onChange(setProfileFillPosition);
    return () => {
      unsubscribeBorderBackgroundScale();
    }
  });

  // Image load
  const imgRef = useRef();
  const borderControls = useAnimation();
  const imgControls = useAnimation();
  const [loaded, setLoaded] = useState();
  const [loadedFromCache, setLoadedFromCache] = useState();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  const setLoadCompleteCB = useCallback(() => {
    if(!isLoadCompleteContent) {
      dispatch(loadCompleteContent());
    }
  }, [isLoadCompleteContent, dispatch]);

  useEffect(() => {
    if(!isLoadCompleteContent && imgRef.current && imgRef.current.complete) {
      dispatch(loadCompleteContent());
      setLoadedFromCache(true);
    }

    // once loaded, wait 1.6 seconds to show enlarged profile img and then pulse
    const timeout = setTimeout(() => {
      // if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
      //   imgControls.start('pulse');
      //   borderControls.start('pulse')
      //     .then(() => borderControls.start('fadeInAndBreathe'))
      //     .then(() => borderControls.start('breathe'));
      //   setLoaded(true);
      // }
    }, 1600);

    return () => {
      clearTimeout(timeout);
    };
  });

  // Button hover states -- add overlay to profile image
  const hoverGithub = useSelector(state => state.hoverGithub);
  const hoverResume = useSelector(state => state.hoverResume);

  let imgSrc = '/images/profile_sm.png';
  if (hoverGithub || hoverResume) {
    imgSrc = '/images/profile_sm_blur.png';
  }

  const imgClasses = classNames(
    styles['profile-img'],
    {
      [styles['loading']]: !(isLoadCompleteBG || isLoadCompleteContent),
      [styles['loaded-from-cache']]: loadedFromCache,
      [styles['hover-github']]: hoverGithub,
      [styles['hover-resume']]: hoverResume,
    }
  );

  // loading indicator
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

  // content appear animation
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
      scale: [1.04, 1.10, 1.07, 1.11, 1.05, 1.09, 1.04],
      opacity: [0, 1, 1, 1, 1, 1, 1],
      transition: {
        duration: 16,
        delay: 0.4,
      }
    },
    fadeIn: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
      },
    },
    pulse: {
      scale: [null, 3, 1.04],
      opacity: [1, 0, 0],
      transition: {
        duration: 1,
        times: [0, 0.8, 1],
      },
    },
  };

  const profileFillVariants = {
    hidden: {
      scale: 1/1.7,
    },
    visible: {
      scale: 1/1.7,
    },
    pulse: {
      scale: [1/1.7, 1],
      transition: {
        duration: 2,
        times: [0.5, 1],
        ease: [[.71,-0.37,.46,.99]],
      }
    }
  };

  return (
    <motion.div
      key="profile-img"
      className={imgClasses}
      variants={imgVariants}
      style={{ scale }}
      initial="visible"
      animate={imgControls}
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
            id="profileImgFill"
            patternUnits="userSpaceOnUse"
            width="100vw"
            height="300vh"
            x={`-${profileBorderStrokeWidth}px`}
            y={`-${profileBorderStrokeWidth}px`}
            patternTransform={`scale(${1/(borderScale.get() * scale.get())})`}
          >
            <image
              className={styles['profile-fill']}
              y={profileFillY}
              x={profileFillX}
              width="100vw"
              height="300vh"
              preserveAspectRatio="xMinYMin slice"
              href="/images/bg_postits_blur.png"
            />
          </pattern>
          <motion.circle
            className={styles['profile-img-border-circle']}
            cx="50%"
            cy="50%"
            r="50%"
            stroke="url(#profileImgFill)"
            strokeWidth={profileBorderStrokeWidth}
            fill="none"
            opacity="1"
            variants={borderVariants}
            initial="breathe"
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
