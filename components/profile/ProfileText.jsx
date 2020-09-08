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
  // Note: also cannot use <tspan> due to Firefox not supporting textLength on
  // <tspan>, so y positions of all elements must be manually set based on size.
  // http://ronaldroe.com/psa-viewport-units-on-svg/
  // https://stackoverflow.com/questions/47801804/using-textlength-attribute
  const [[windowWidth, windowHeight], setWindowSize] = useState([0, 0]);
  const [absoluteUnits, setAbsoluteUnits] = useState({});
  const [positions, setPositions] = useState({});

  // track window height and width, used to simulate vh/vw
  const updateWindowSize = () => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }

  // vh/vw to absolute units hash
  const updateAbsoluteUnits = () => {
    setAbsoluteUnits({
      '-58vh': -windowHeight * 0.58,
      '12vh': windowHeight * 0.12,
      '17vh': windowHeight * 0.17,
      '27vh': windowHeight * 0.27,
      '100vh': windowHeight,
      '300vh': windowHeight * 3,
      '7.5vw': windowWidth * 0.075,
      '10.8vw': windowWidth * 0.108,
      '15vw': windowWidth * 0.15,
      '17.4vw': windowWidth * 0.174,
      '47.21435316vw': windowWidth * 0.4721435316,
      '90vw': windowWidth * 0.9,
      '100vw': windowWidth,
    });
  }

  // Breakpoints and rules to update for each media query in the CSS.
  // nameTextLength: keeps name justified with translucent container edges.
  // descriptionLine1Y: set to the font-size of .profile-name
  // descriptionLine2Y: set to the font-size of .profile-name + the font-size of .profile-description-line1
  // buttonsY: set to the sum of the font-size of all text elements, * 1.5 for the description
  const updatePositions = () => {
    setPositions({
      min: {
        nameTextLength: '270px',
        descriptionLine1Y: '2.8rem',
        descriptionLine2Y: '4.2rem',
        buttonsY: '7rem',
        breakpoint: '(max-width: 299px)',
      },
      '300': {
        nameTextLength: absoluteUnits['90vw'],
        descriptionLine1Y: absoluteUnits['15vw'],
        descriptionLine2Y: absoluteUnits['15vw'] + (1.7 * 16),
        buttonsY: absoluteUnits['15vw'] + (1.7 * 16 * 2 * 1.5),
        breakpoint: '(min-width: 300px) and (max-width: 499px)',
      },
      '500': {
        nameTextLength: '450px',
        descriptionLine1Y: '4.6rem',
        descriptionLine2Y: '6.5rem',
        buttonsY: '10.3rem',
        breakpoint: '(min-width: 500px) and (max-width: 799px)',
      },
      '800portrait': {
        nameTextLength: '500px',
        descriptionLine1Y: absoluteUnits['7.5vw'],
        descriptionLine2Y: absoluteUnits['10.8vw'],
        buttonsY: absoluteUnits['17.4vw'],
        breakpoint: '(min-width: 800px) and (max-width: 1059px) and (max-aspect-ratio: 3/2)',
      },
      '800landscape': {
        nameTextLength: '500px',
        descriptionLine1Y: absoluteUnits['12vh'],
        descriptionLine2Y: absoluteUnits['17vh'],
        buttonsY: absoluteUnits['27vh'],
        breakpoint: '(min-width: 800px) and (max-width: 1059px) and (min-aspect-ratio: 3/2)',
      },
      '1060portrait': {
        nameTextLength: absoluteUnits['47.21435316vw'],
        descriptionLine1Y: absoluteUnits['7.5vw'],
        descriptionLine2Y: absoluteUnits['10.8vw'],
        buttonsY: absoluteUnits['17.4vw'],
        breakpoint: '(min-width: 1060px) and (max-aspect-ratio: 3/2)',
      },
      '1060landscape': {
        nameTextLength: absoluteUnits['47.21435316vw'],
        descriptionLine1Y: absoluteUnits['12vh'],
        descriptionLine2Y: absoluteUnits['17vh'],
        buttonsY: absoluteUnits['27vh'],
        breakpoint: '(min-width: 1060px) and (min-aspect-ratio: 3/2)',
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

  // set position when hitting a media query breakpoint
  const [currentPosition, updatePosition] = useState();
  const [nameTextLength, setNameTextLength] = useState();
  const [descriptionLine1Y, setDescriptionLine1Y] = useState();
  const [descriptionLine2Y, setDescriptionLine2Y] = useState();
  const [buttonsY, setButtonsY] = useState();

  const setPosition = (position) => {
    setNameTextLength(positions[position].nameTextLength);
    setDescriptionLine1Y(positions[position].descriptionLine1Y);
    setDescriptionLine2Y(positions[position].descriptionLine2Y);
    setButtonsY(positions[position].buttonsY);
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

  // only load after profile image is finished loading
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  const loadCompleteProfileImage = useSelector(state => state.loadCompleteProfileImage);
  useEffect(() => {
    if(!loaded && loadCompleteProfileImage) {
      controls.start('load');
      setLoaded(true);
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
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
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
        variants={profileVariants}
        animate={controls}
      >
        <svg className={styles['profile-fill-svg']}>
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
        </svg>
        <motion.svg
          key="name-svg"
          className={styles['profile-name-svg']}
          variants={profileItemVariants}
          layout
        >
          <text
            className={profileNameClass}
            x="50%"
            y="1em"
            textLength={nameTextLength}
            fontFamily="Indie Flower"
            textAnchor="middle"
            fill="url(#profileFill)"
          >
            Rachael Passov
          </text>
        </motion.svg>
        <motion.svg
          key="description-line1-svg"
          className={styles['profile-description-line1-svg']}
          variants={profileItemVariants}
          layout
        >
          <text
            className={styles['profile-description-line1']}
            x="50%"
            y={descriptionLine1Y}
            dx="-2em"
            dy="1.5em"
            fontFamily="Indie Flower"
            textAnchor="middle"
            fill="url(#profileFill)"
          >
            UX Designer /
          </text>
        </motion.svg>
        <motion.svg
          key="description-line2-svg"
          className={styles['profile-description-line2-svg']}
          variants={profileItemVariants}
          layout
        >
          <text
            className={styles['profile-description-line2']}
            x="50%"
            y={descriptionLine2Y}
            dx="1.3em"
            dy="1.5em"
            fontFamily="Indie Flower"
            textAnchor="middle"
            fill="url(#profileFill)"
          >
            Frontend Engineer
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
            y={buttonsY}
          >
              Resume
          </ProfileButton>
          <ProfileButton
            href="https://github.rachael.io"
            onMouseEnter={() => dispatch(setHoverGithub(true))}
            onMouseLeave={() => dispatch(setHoverGithub(false))}
            position="right"
            y={buttonsY}
          >
              Github
          </ProfileButton>
        </motion.svg>
      </motion.svg>
    </>
  );
}

export default ProfileText;
