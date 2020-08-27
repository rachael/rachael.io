import { motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/global';
import { setHoverGithub, setHoverResume } from 'redux/actions';

import styles from 'styles/home/Profile.module.scss';

function ProfileText() {
  const dispatch = useDispatch();

  // only load after profile image is finished loading
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
    controls.start('load');
    setLoaded(true);
  }

  // position & resize
  const positions = {
    min: {
      nameTextLength: '270px',
    },
    '300': {
      nameTextLength: '90vw',
    },
    '500': {
      nameTextLength: '450px',
    },
    '800': {
      nameTextLength: '500px',
    },
    '1060': {
      nameTextLength: '47.21435316vw',
    },
  };

  const [currentPosition, updatePosition] = useState();
  const [nameTextLength, setNameTextLength] = useState();

  const setPosition = (position) => {
    console.log('set position', position);
    updatePosition(position);
    setNameTextLength(positions[position]['nameTextLength']);
  };

  const setupMediaQueries = () => {
    const mqlMin = window.matchMedia('(max-width: 299px)');
    const screenTestMin = (e) => {
      if(currentPosition !== 'min' && e.matches) setPosition('min');
    };
    mqlMin.addListener(screenTestMin);
    screenTestMin(mqlMin);

    const mql300 = window.matchMedia('(min-width: 300px) and (max-width: 499px)');
    const screenTest300 = (e) => {
      if(currentPosition !== '300' && e.matches) setPosition('300');
    };
    mql300.addListener(screenTest300);
    screenTest300(mql300);

    const mql500 = window.matchMedia('(min-width: 500px) and (max-width: 799px)');
    const screenTest500 = (e) => {
      if(currentPosition !== '500' && e.matches) setPosition('500');
    };
    mql500.addListener(screenTest500);
    screenTest500(mql500);

    const mql800 = window.matchMedia('(min-width: 800px) and (max-width: 1059px)');
    const screenTest800 = (e) => {
      if(e.matches) {
        if(currentPosition !== '800' && e.matches) setPosition('800');
      }
    }
    mql800.addListener(screenTest800);
    screenTest800(mql800);

    const mql1060 = window.matchMedia('(min-width: 1060px)');
    const screenTest1060 = (e) => {
      if(e.matches) {
        if(currentPosition !== '1060' && e.matches) setPosition('1060');
      }
    }
    mql1060.addListener(screenTest1060);
    screenTest1060(mql1060);
  };

  useEffect(() => {
    setupMediaQueries();
  });

  // content appear animation
  const profileVariants = {
    load: {
      opacity: 1,
      transition: {
        delay: 1.6,
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.4,
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
  const profileNameVariants = {
    load: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.4,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  const profileDescriptionVariants = {
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
    <>
      <motion.svg
        className={styles.profile}
        variants={profileVariants}
        animate={controls}
      >
        <pattern id="profileFill" patternUnits="userSpaceOnUse" width="100vw" height="100vh">
          <image
            className={styles['profile-fill']}
            y="-58vh"
            width="100vw"
            height="300vh"
            preserveAspectRatio="xMinYMin slice"
            href="/images/bg_postits_blur.png"
          >
          </image>
        </pattern>
        <text
          fontFamily="Indie Flower"
          textAnchor="middle"
          fill="url(#profileFill)"
        >
          <motion.tspan
            className={styles['profile-name']}
            x="50%"
            y="1em"
            textLength={nameTextLength}
            variants={profileNameVariants}
            layout
          >
            Rachael Passov
          </motion.tspan>
          <motion.tspan
            className={styles['profile-description-line1']}
            x="50%"
            dx="-2em"
            dy="1.2em"
            variants={profileDescriptionVariants}
            layout
          >
              UX Designer /
          </motion.tspan>
          <motion.tspan
            className={styles['profile-description-line2']}
            x="50%"
            dx="1.3em"
            dy="1em"
            variants={profileDescriptionVariants}
            layout
          >
              Frontend Engineer
          </motion.tspan>
        </text>
      </motion.svg>
      {/* <motion.div
        className={styles['profile-description']}
        variants={profileItemVariants}
      >
        <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
        <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
      </motion.div> */}
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
    </>
  );
}

export default ProfileText;
