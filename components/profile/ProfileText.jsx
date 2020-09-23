import classNames from 'classnames';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadCompleteContent, setHoverGithub, setHoverResume } from 'redux/actions';
import { ProfileButton } from '.';

import styles from 'styles/home/Profile.module.scss';

function ProfileText() {
  const dispatch = useDispatch();

  // Must detect Firefox because some animations are too laggy in Firefox to run
  // So, animation start timings for profile text is different in Firefox
  // All browser detection credit goes to https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
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

  // vh/vw to absolute units hash.
  // Quickest way I could think of to do lookups for the absolute equivalents
  // to the vw/vh units I wanted, and preserve a nicely formatted version of the
  // original value where it's used, without doing expensive/unnecessary string
  // conversions and math every time.
  const updateAbsoluteUnits = () => {
    setAbsoluteUnits({
      '-58vh': -windowHeight * 0.58,
      '12vh': windowHeight * 0.12,
      '17vh': windowHeight * 0.17,
      '28vh': windowHeight * 0.28,
      '100vh': windowHeight,
      '300vh': windowHeight * 3,
      '7.5vw': windowWidth * 0.075,
      '10.8vw': windowWidth * 0.108,
      '15vw': windowWidth * 0.15,
      '17.8vw': windowWidth * 0.178,
      '47.21435316vw': windowWidth * 0.4721435316,
      '90vw': windowWidth * 0.9,
      '100vw': windowWidth,
    });
  }

  // Breakpoints and rules to update for each media query in the CSS.
  // nameTextLength: keeps name justified with translucent container edges. +3 on large screens to justify right edge
  // descriptionLine1Y: set to the font-size of .profile-name
  // descriptionLine2Y: set to the font-size of .profile-name + the font-size of .profile-description-line1
  // buttonsY: set to the sum of the font-size of all text elements, * 1.5 for the description
  const updatePositions = () => {
    setPositions({
      min: {
        nameTextLength: 270,
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
        nameTextLength: 450,
        descriptionLine1Y: '4.6rem',
        descriptionLine2Y: '6.5rem',
        buttonsY: '10.3rem',
        breakpoint: '(min-width: 500px) and (max-width: 799px)',
      },
      '800portrait': {
        nameTextLength: 503,
        descriptionLine1Y: absoluteUnits['7.5vw'],
        descriptionLine2Y: absoluteUnits['10.8vw'],
        buttonsY: absoluteUnits['17.8vw'],
        breakpoint: '(min-width: 800px) and (max-width: 1059px) and (max-aspect-ratio: 3/2)',
      },
      '800landscape': {
        nameTextLength: 503,
        descriptionLine1Y: absoluteUnits['12vh'],
        descriptionLine2Y: absoluteUnits['17vh'],
        buttonsY: absoluteUnits['28vh'],
        breakpoint: '(min-width: 800px) and (max-width: 1059px) and (min-aspect-ratio: 3/2)',
      },
      '1060portrait': {
        nameTextLength: absoluteUnits['47.21435316vw'] + 3,
        descriptionLine1Y: absoluteUnits['7.5vw'],
        descriptionLine2Y: absoluteUnits['10.8vw'],
        buttonsY: absoluteUnits['17.8vw'],
        breakpoint: '(min-width: 1060px) and (max-aspect-ratio: 3/2)',
      },
      '1060landscape': {
        nameTextLength: absoluteUnits['47.21435316vw'] + 3,
        descriptionLine1Y: absoluteUnits['12vh'],
        descriptionLine2Y: absoluteUnits['17vh'],
        buttonsY: absoluteUnits['28vh'],
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
  const [nameTextLengthScale, setNameTextLengthScale] = useState();
  const [descriptionLine1Y, setDescriptionLine1Y] = useState();
  const [descriptionLine2Y, setDescriptionLine2Y] = useState();
  const [descriptionLine1TextLength, setDescriptionLine1TextLength] = useState();
  const [descriptionLine2TextLength, setDescriptionLine2TextLength] = useState();
  const [buttonsY, setButtonsY] = useState();
  const nameRef = useRef();
  const descriptionLine1Ref = useRef();
  const descriptionLine2Ref = useRef();

  const setPosition = (position) => {
    setDescriptionLine1Y(positions[position].descriptionLine1Y);
    setDescriptionLine2Y(positions[position].descriptionLine2Y);
    setButtonsY(positions[position].buttonsY);

    // scale description textLength by same amount as name so text spacing stays
    // constant
    setNameTextLength(undefined);
    const namePos = nameRef.current.getBoundingClientRect();
    const nameScale = (positions[position].nameTextLength)/namePos.width;
    setNameTextLength(positions[position].nameTextLength);
    setNameTextLengthScale(nameScale);

    setDescriptionLine1TextLength(undefined);
    setDescriptionLine2TextLength(undefined);
    const descriptionLine1Pos = descriptionLine1Ref.current.getBoundingClientRect();
    const descriptionLine2Pos = descriptionLine2Ref.current.getBoundingClientRect();
    setDescriptionLine1TextLength(descriptionLine1Pos.width * nameScale);
    setDescriptionLine2TextLength(descriptionLine2Pos.width * nameScale);

    updatePosition(position);
  }

  const [mediaQueries, setMediaQueries] = useState({});

  // sets up media queries and tests each one, setting the position if it matches
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
  }

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
      controls.start('load').then(() => dispatch(loadCompleteContent()));
      setLoaded(true);
    }
  }, [loadCompleteProfileImage]);

  // Track profile's offsetY to pass to buttons to help position underline
  // Set height of SVG to include buttons, otherwise buttons are uninteractable
  // in Safari
  const [profileOffsetY, setProfileOffsetY] = useState();
  const [profileHeight, setProfileHeight] = useState();
  const buttonsRef = useRef();
  const profileRef = useRef();

  const updateProfileHeight = () => {
    const buttonsPos = buttonsRef.current.getBoundingClientRect();
    const profilePos = profileRef.current.getBoundingClientRect();
    setProfileHeight(buttonsPos.bottom - profilePos.top);
    setProfileOffsetY(profilePos.y);
  }

  useEffect(() => {
    updateProfileHeight();
  })

  // Window resize listener
  // Updates all absolutely set positions on resize for Firefox/Safari
  useEffect(() => {
    const onResize = () => {
      updateWindowSize();
      updateAbsoluteUnits();
      updatePositions();
      testMediaQuery();
      updateProfileHeight();
    }
    // detect orientation change (works for iOS -- and first 'resize' is required)
    if ("onorientationchange" in window) window.addEventListener('resize orientationchange', onResize);
    else window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('resize orientataionchange', onResize);
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
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  // Firefox adjustments -- no staggerChildren and shorter duration to hide lag
  if(!isFirefox) {
    profileVariants.load.transition.staggerChildren = 0.4;
  } else {
    profileVariants.load.transition.duration = 0.2;
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

  const profileNameClass = classNames(
    styles['profile-name'],
    { [styles['is-firefox']]: isFirefox }
  )

  return (
    <>
      <motion.svg
        ref={profileRef}
        className={styles.profile}
        height={profileHeight}
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
            ref={nameRef}
            className={profileNameClass}
            x="50%"
            y="1em"
            dx="1" // font is slightly out of alignment, this fixes it
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
            ref={descriptionLine1Ref}
            className={styles['profile-description-line1']}
            x="50%"
            y={descriptionLine1Y}
            dx="-2em"
            dy="1.5em"
            textLength={descriptionLine1TextLength}
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
            ref={descriptionLine2Ref}
            className={styles['profile-description-line2']}
            x="50%"
            y={descriptionLine2Y}
            dx="1.3em"
            dy="1.5em"
            textLength={descriptionLine2TextLength}
            fontFamily="Indie Flower"
            textAnchor="middle"
            fill="url(#profileFill)"
          >
            Frontend Engineer
          </text>
        </motion.svg>
        <motion.svg
          key="buttons-svg"
          ref={buttonsRef}
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
            profileOffsetY={profileOffsetY}
            textLengthScale={nameTextLengthScale}
          >
              Resume
          </ProfileButton>
          <ProfileButton
            href="https://github.rachael.io"
            onMouseEnter={() => dispatch(setHoverGithub(true))}
            onMouseLeave={() => dispatch(setHoverGithub(false))}
            position="right"
            y={buttonsY}
            profileOffsetY={profileOffsetY}
            textLengthScale={nameTextLengthScale}
          >
              Github
          </ProfileButton>
        </motion.svg>
      </motion.svg>
    </>
  );
}

export default ProfileText;
