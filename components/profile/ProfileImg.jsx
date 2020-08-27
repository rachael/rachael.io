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
  const profileBorderStrokeWidth = 3;
  const [profileFillX, setProfileFillX] = useState(0);
  const [profileFillY, setProfileFillY] = useState(0);

  const setProfileFill = () => {
    const profileImgPos = imgRef.current.getBoundingClientRect();
    setProfileFillX(`${-profileImgPos.x + profileBorderStrokeWidth}px`);
    setProfileFillY(`${-profileImgPos.y + profileBorderStrokeWidth}px`);
  };

  useEffect(() => {
    setProfileFill();
  });

  // Send off pulse when animating in.
  // Pulse animation is controlled by CSS.
  const [visiblePulseNow, setVisiblePulseNow] = useState();
  const scale = useMotionValue(1.7);

  useEffect(() => {
    let timeout;
    const unsubscribePulseOnScale = scale.onChange(activatePulse);
    function activatePulse() {
      unsubscribePulseOnScale();
      setVisiblePulseNow(true);
      timeout = setTimeout(() => {
        setVisiblePulseNow(false);
        dispatch(setContentAnimating(false));
      }, 1600);
    }
    const unsubscribeSetProfileFillOnScale = scale.onChange(setProfileFill);
    return () => {
      clearTimeout(timeout);
      unsubscribePulseOnScale();
      unsubscribeSetProfileFillOnScale();
    }
  });

  // Image load
  const imgRef = useRef();
  const controls = useAnimation();
  const [loaded, setLoaded] = useState();
  const [loadedFromCache, setLoadedFromCache] = useState();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  const setLoadCompleteCB = useCallback(() => {
    if(!isLoadCompleteContent) {
      dispatch(loadCompleteContent());
    }
  }, [isLoadCompleteContent, dispatch]);

  if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
    controls.start('pulse');
    setLoaded(true);
  }

  useEffect(() => {
    if(!isLoadCompleteContent && imgRef.current && imgRef.current.complete) {
      dispatch(loadCompleteContent());
      setLoadedFromCache(true);
    }
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
      [styles['pulse']]: visiblePulseNow,
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
    hidden: {
      opacity: 0,
      scale: 1.7,
      translateY: '40%',
    },
    visible: {
      opacity: 1,
      scale: 1.7,
      translateY: '40%',
    },
    pulse: {
      opacity: [1, 1],
      scale: [1.7, 1],
      translateY: ['40%', 0],
      transition: {
        duration: 2,
        times: [0.5, 1],
        ease: [[.71,-0.37,.46,.99]],
      }
    },
  };

  return (
    <motion.div
      key="profile-img"
      className={imgClasses}
      variants={imgVariants}
      style={{ scale }}
      animate={controls}
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
          >
            <image
              className={styles['profile-fill']}
              y={profileFillY}
              x={profileFillX}
              width="100vw"
              height="300vh"
              preserveAspectRatio="xMinYMin slice"
              href="/images/bg_postits_blur.png"
            >
            </image>
          </pattern>
          <circle
            className={styles['profile-img-border-circle']}
            cx="50%"
            cy="50%"
            r="50%"
            stroke="url(#profileImgFill)"
            strokeWidth={profileBorderStrokeWidth}
            fill="none"
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
