import classNames from 'classnames';
import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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

  const imgClasses = classNames(
    styles['profile-img'],
    { [styles['pulse']]: visiblePulseNow }
  );

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
  return (
    <motion.div
      className={imgClasses}
      variants={imgVariants}
      style={{ scale }}
    >
      <img src="/profile_sm.png" alt="Profile picture" />
    </motion.div>
  );
}

export default ProfileImg;
