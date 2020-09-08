import classNames from 'classnames';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setHoverGithub, setHoverResume } from 'redux/actions';
import { ProfileButton } from '.';

import styles from 'styles/home/Profile.module.scss';

function ProfileText() {
  const dispatch = useDispatch();

  // Must detect Firefox because some animations are too laggy in Firefox to run
  // So, animation start timings for profile text is different in Firefox
  const isFirefox = typeof InstallTrigger !== 'undefined';

  // Absolute units for Firefox/Safari
  // Necessary because Firefox/Safari requires absolute units on svg elements,
  // so vw/vh cannot be used. Emulates vw/vh by updating on resize.
  // http://ronaldroe.com/psa-viewport-units-on-svg/
  const [[windowWidth, windowHeight], setWindowSize] = useState([0, 0]);
  const [absoluteUnits, setAbsoluteUnits] = useState({});
  const [positions, setPositions] = useState({});

  const updateWindowSize = () => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }

  const updateAbsoluteUnits = () => {
    setAbsoluteUnits({
      '-58vh': -windowHeight * 0.58,
      '100vh': windowHeight,
      '300vh': windowHeight * 3,
      '47.21435316vw': windowWidth * 0.4721435316,
      '90vw': windowWidth * 0.9,
      '100vw': windowWidth,
    });
  }

  const updatePositions = () => {
    setPositions({
      min: {
        nameTextLength: '270px',
        breakpoint: '(max-width: 299px)',
      },
      '300': {
        nameTextLength: absoluteUnits['90vw'],
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
        nameTextLength: absoluteUnits['47.21435316vw'],
        breakpoint: '(min-width: 1060px)',
      },
    });
  }

  useEffect(() => {
    updateWindowSize();
  }, []);

  useEffect(() => {
    updateAbsoluteUnits();
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    updatePositions();
  }, [JSON.stringify(absoluteUnits)]);

  // position & resize
  const [currentPosition, updatePosition] = useState();
  const [nameTextLength, setNameTextLength] = useState();

  // set position when hitting a media query breakpoint
  const setPosition = (position) => {
    setNameTextLength(positions[position].nameTextLength);
    updatePosition(position);
  };

  const [mediaQueries, setMediaQueries] = useState({});

  const setupMediaQueries = () => {
    const mediaQueries = {};
    for(let position in positions) {
      if(!positions[position].nameTextLength) break;
      mediaQueries[position] = {};
      const mql = window.matchMedia(positions[position].breakpoint);
      const screenTest = (e) => { if(e.matches) setPosition(position) };
      mql.addListener(screenTest);
      screenTest(mql);
      mediaQueries[position].mql = mql;
      mediaQueries[position].screenTest = screenTest;
    }
    setMediaQueries(mediaQueries);
  };

  useEffect(() => {
    setupMediaQueries();
  }, [JSON.stringify(positions)]);

  const testMediaQuery = () => {
    mediaQueries[currentPosition].screenTest(mediaQueries[currentPosition].mql);
  }

  // expand <svg> heights to fit inner text so vertical alignment works
  const [textSVGHeight, setTextSVGHeight] = useState();
  const textRef = useRef();

  const setTextHeight = () => {
    const textPos = textRef.current.getBoundingClientRect();
    // extra 20px is for buttons
    setTextSVGHeight(textPos.height + 20); // TODO: buttonHeight variable based on font size
  }

  // helps with quick resizing where js can't keep up by fixing height again
  // shortly after resize event
  const [textHeightAdjustTimeoutID, setTextHeightAdjustTimeoutID] = useState();
  const setTextHeightFireTwice = () => {
    setTextHeight();
    clearTimeout(textHeightAdjustTimeoutID);
    const timeoutID = setTimeout(setTextHeight, 400);
    setTextHeightAdjustTimeoutID(timeoutID);
  }

  // only load after profile image is finished loading
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  const loadCompleteProfileImage = useSelector(state => state.loadCompleteProfileImage);
  useEffect(() => {
    let timeoutID;
    if(!loaded && loadCompleteProfileImage) {
      setTextHeight();
      controls.start('load');
      setLoaded(true);
    }
    return () => {
      clearTimeout(timeoutID);
    }
  }, [loadCompleteProfileImage]);

  // Window resize listener
  // Updates all absolutely set positions on resize for Firefox/Safari
  useEffect(() => {
    const onResize = () => {
      updateWindowSize();
      updateAbsoluteUnits();
      updatePositions();
      testMediaQuery();
      setTextHeightFireTwice();
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(textHeightAdjustTimeoutID);
    }
  })

  // animations
  const backgroundTranslateY = useSelector(state => state.backgroundTranslateY);

  const profileVariants = {
    load: {
      opacity: 1,
      transition: {
        delay: 0.4,
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

  const profileNameClass = classNames(
    styles['profile-name'],
    { [styles['is-firefox']]: isFirefox }
  )

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
            <pattern
              id="profileFill"
              patternUnits="userSpaceOnUse"
              width={absoluteUnits['100vw']}
              height={absoluteUnits['100vh']}
            >
              <image
                className={styles['profile-fill']}
                y={absoluteUnits['-58vh']}
                width={absoluteUnits['100vw']}
                height={absoluteUnits['300vh']}
                preserveAspectRatio="xMinYMin slice"
                href="/images/bg_postits_blur.png"
                style={{ transform: `translateY(${backgroundTranslateY})` }}
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
              className={profileNameClass}
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
