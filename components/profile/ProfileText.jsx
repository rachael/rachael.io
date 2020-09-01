import { motion, useAnimation } from 'framer-motion';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setHoverGithub, setHoverResume } from 'redux/actions';
import { ProfileButton } from '.';

import styles from 'styles/home/Profile.module.scss';

function ProfileText() {
  const dispatch = useDispatch();

  // position & resize
  const positions = {
    min: {
      nameTextLength: '270px',
      breakpoint: '(max-width: 299px)',
    },
    '300': {
      nameTextLength: '90vw',
      breakpoint: '(min-width: 300px) and (max-width: 499px)',
    },
    '500': {
      nameTextLength: '450px',
      breakpoint: '(min-width: 500px) and (max-width: 799px)',
    },
    '800': {
      nameTextLength: '500px',
      breakpoint: '(min-width: 800px) and (max-width: 1059px)',
    },
    '1060': {
      nameTextLength: '47.21435316vw',
      breakpoint: '(min-width: 1060px)',
    },
  };

  const [currentPosition, updatePosition] = useState();
  const [nameTextLength, setNameTextLength] = useState();

  // set position when hitting a media query breakpoint
  const setPosition = (position) => {
    updatePosition(position);
    setNameTextLength(positions[position].nameTextLength);
  };

  const setupMediaQueries = () => {
    for(let position in positions) {
      positions[position].mql = window.matchMedia(positions[position].breakpoint);
      positions[position].screenTest = (e) => {
        if(currentPosition !== position && e.matches) setPosition(position);
      };
      positions[position].mql.addListener(positions[position].screenTest);
      positions[position].screenTest(positions[position].mql);
    }
  };

  useLayoutEffect(() => {
    setupMediaQueries();
  });

  // expand <svg> heights to fit inner text so vertical alignment works
  const [textSVGHeight, setTextSVGHeight] = useState();
  const textRef = useRef();

  const setTextHeight = () => {
    const textPos = textRef.current.getBoundingClientRect();
    setTextSVGHeight(textPos.height);
  }

  // helps with quick resizing where js can't keep up by fixing height again
  // shortly after resize event
  const [textHeightAdjustTimeoutID, setTextHeightAdjustTimeoutID] = useState();
  const setTextHeightFireTwice = () => {
    setTextHeight();
    setTextHeightAdjustTimeoutID(setTimeout(setTextHeight, 400));
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', setTextHeightFireTwice);
    return () => {
      window.removeEventListener('resize', setTextHeightFireTwice);
      clearTimeout(textHeightAdjustTimeoutID);
    }
  });

  // only load after profile image is finished loading
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);
  if(!loaded && isLoadCompleteBG && isLoadCompleteContent) {
    controls.start('load');
    setLoaded(true);
    // fixes height being slightly short if set on mount without the timeout
    // (bug caused by framer-motion animation)
    setTimeout(setTextHeight, 400);
  }

  // content appear animation
  const profileVariants = {
    load: {
      opacity: 1,
      transition: {
        delay: 2.6,
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
    <>
      <motion.svg
        className={styles.profile}
        height={textSVGHeight}
        variants={profileVariants}
        animate={controls}
      >
        <motion.svg
          key="text-svg"
          className={styles['profile-text-svg']}
          height={textSVGHeight}
          layout
        >
          <defs>
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
          </defs>
          <text
            ref={textRef}
            fontFamily="Indie Flower"
            textAnchor="middle"
            fill="url(#profileFill)"
          >
            <motion.tspan
              className={styles['profile-name']}
              x="50%"
              y="1em"
              textLength={nameTextLength}
              variants={profileItemVariants}
              layout
            >
              Rachael Passov
            </motion.tspan>
            <motion.tspan
              className={styles['profile-description-line1']}
              x="50%"
              dx="-2em"
              dy="1.2em"
              variants={profileItemVariants}
              layout
            >
                UX Designer /
            </motion.tspan>
            <motion.tspan
              className={styles['profile-description-line2']}
              x="50%"
              dx="1.3em"
              dy="1em"
              variants={profileItemVariants}
              layout
            >
                Frontend Engineer
            </motion.tspan>
          </text>
        </motion.svg>
        <motion.svg
          key="buttons-svg"
          className={styles['profile-buttons-svg']}
          variants={profileItemVariants}
          layout
        >
          <ProfileButton
            href="/Rachael Passov - Resume.pdf"
            onMouseEnter={() => dispatch(setHoverResume(true))}
            onMouseLeave={() => dispatch(setHoverResume(false))}
            position="left"
          >
              Resume
          </ProfileButton>
          <ProfileButton
            href="https://github.rachael.io"
            onMouseEnter={() => dispatch(setHoverGithub(true))}
            onMouseLeave={() => dispatch(setHoverGithub(false))}
            position="right"
          >
              Github
          </ProfileButton>
        </motion.svg>
      </motion.svg>
    </>
  );
}

export default ProfileText;
