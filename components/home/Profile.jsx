import { motion, useAnimation } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/global';
import { setHoverGithub, setHoverResume } from 'redux/actions';

import styles from 'styles/home/Profile.module.scss';

function Profile() {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
    controls.start('load');
    setLoaded(true);
  }

  // content appear animation
  const profileVariants = {
    load: {
      opacity: 1,
      transition: {
        delay: 1.6,
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  const buttonVariants = {
    load: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  }
  const profileItemVariants = {
    load: {
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      key="profile"
      className={styles.profile}
      variants={profileVariants}
      animate={controls}
    >
      <motion.h1
        className={styles['profile-name']}
        variants={profileItemVariants}
      >
          Rachael Passov
      </motion.h1>
      <motion.div
        className={styles['profile-description']}
        variants={profileItemVariants}
      >
        <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
        <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
      </motion.div>
      <motion.div
        variants={buttonVariants}
      >
        <Button
          href='/Rachael Passov - Resume.pdf'
          onMouseEnter={() => dispatch(setHoverResume(true))}
          onMouseLeave={() => dispatch(setHoverResume(false))}
        >
            Resume
        </Button>
        <Button
          href='https://github.rachael.io'
          onMouseEnter={() => dispatch(setHoverGithub(true))}
          onMouseLeave={() => dispatch(setHoverGithub(false))}
        >
            Github
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
