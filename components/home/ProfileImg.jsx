import classNames from 'classnames';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setContentAnimating } from 'redux/actions';

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

  const hoverGithub = useSelector(state => state.hoverGithub);
  const hoverResume = useSelector(state => state.hoverResume);

  const imgClasses = classNames(
    styles['profile-img'],
    {
      [styles['pulse']]: visiblePulseNow,
      [styles['hover-github']]: hoverGithub,
      [styles['hover-resume']]: hoverResume,
    }
  );

  let imgSrc = '/profile_sm.png';
  if (hoverGithub || hoverResume) {
    imgSrc = '/profile_sm_blur.png';
  }

  // content appear animation
  const imgVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: [0, 1, 1],
      scale: [1.7, 1.7, 1],
      translateY: ['40%', '40%', 0],
      transition: {
        duration: 2,
        times: [0, 0.5, 1],
        ease: ['linear', [.71,-0.37,.46,.99]],
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
    >
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
    >
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

  return (
    <motion.div
      key="profile-img"
      className={imgClasses}
      variants={imgVariants}
      style={{ scale }}
    >
      <AnimatePresence>
        <motion.img
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
