import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadCompleteContent, setContentAnimating } from 'redux/actions';
import { OverlayText } from './overlays';

import styles from 'styles/home/Profile.module.scss';

function ProfileImg() {
  const dispatch = useDispatch();

  // Send off pulse when animating in.
  // Pulse animation is controlled by CSS.
  const [visiblePulseNow, setVisiblePulseNow] = useState();
  const scale = useMotionValue(1.7);

  useEffect(() => {
    let timeout;
    const unsubscribeScale = scale.onChange(activatePulse);
    function activatePulse() {
      unsubscribeScale();
      setVisiblePulseNow(true);
      timeout = setTimeout(() => {
        setVisiblePulseNow(false);
        dispatch(setContentAnimating(false));
      }, 1600);
    }
    return () => {
      clearTimeout(timeout);
      unsubscribeScale();
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
  });
  useEffect(() => {
    if(!isLoadCompleteContent && imgRef.current && imgRef.current.complete) {
      dispatch(loadCompleteContent());
      setLoadedFromCache(true);
    }
  });
  if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
    controls.start('pulse');
    setLoaded(true);
  }

  // Button hover states -- add overlay to profile image
  const hoverGithub = useSelector(state => state.hoverGithub);
  const hoverResume = useSelector(state => state.hoverResume);

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

  let imgSrc = '/images/profile_sm.png';
  if (hoverGithub || hoverResume) {
    imgSrc = '/images/profile_sm_blur.png';
  }

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
  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.4,
      },
    },
  };
  const overlayItemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const profileImgGithub = (
    <motion.div
      key="profile-img-github"
      className={styles['profile-img-github']}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <OverlayText>GITHUB</OverlayText>
      <motion.p
        key="Portfolio"
        variants={overlayItemVariants}
      >
        Portfolio
      </motion.p>
      <motion.p
        key="Projects"
        variants={overlayItemVariants}
      >
        Projects
      </motion.p>
    </motion.div>
  );

  const profileImgResume = (
    <motion.div
      key="profile-img-resume"
      className={styles['profile-img-resume']}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <OverlayText>RESUME</OverlayText>
      <motion.p
        key="Contact"
        variants={overlayItemVariants}
      >
        Contact
      </motion.p>
      <motion.p
        key="Skills"
        variants={overlayItemVariants}
      >
        Skills
      </motion.p>
      <motion.p
        key="Experience"
        variants={overlayItemVariants}
      >
        Experience
      </motion.p>
    </motion.div>
  );

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
        {hoverGithub && profileImgGithub}
        {hoverResume && profileImgResume}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProfileImg;
