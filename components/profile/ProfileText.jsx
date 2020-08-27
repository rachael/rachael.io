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
      nameY: '2.8rem',
      nameTextLength: '270px',
      descriptionLine1DY: '1.9rem',
      descriptionLine2DY: '1.6rem',
      descriptionLine1DX: '-3rem',
      descriptionLine2DX: '2.5rem',
    },
    '300': {
      nameY: '15vw',
      nameTextLength: '90vw',
      descriptionLine1DY: '2rem',
      descriptionLine2DY: '2rem',
      descriptionLine1DX: '-3rem',
      descriptionLine2DX: '2rem',
    },
    '500': {
      nameY: '4.6rem',
      nameTextLength: '450px',
      descriptionLine1DY: '2.5rem',
      descriptionLine2DY: '2rem',
      descriptionLine1DX: '-3rem',
      descriptionLine2DX: '2.5rem',
    },
    '800': {
      nameY: '12vh',
      nameTextLength: '500px',
      descriptionLine1DY: '6vh',
      descriptionLine2DY: '5vh',
      descriptionLine1DX: '-7vh',
      descriptionLine2DX: '6vh',
    },
    '1060': {
      nameY: '12vh',
      nameTextLength: '500px',
      descriptionLine1DY: '2.5rem',
      descriptionLine2DY: '2rem',
      descriptionLine1DX: '-3rem',
      descriptionLine2DX: '2.5rem',
    },
  };

  const [currentPosition, updatePosition] = useState();
  const [nameY, setNameY] = useState();
  const [nameTextLength, setNameTextLength] = useState();
  const [descriptionLine1DY, setDescriptionLine1DY] = useState();
  const [descriptionLine1DX, setDescriptionLine1DX] = useState();
  const [descriptionLine2DY, setDescriptionLine2DY] = useState();
  const [descriptionLine2DX, setDescriptionLine2DX] = useState();

  const setPosition = (position) => {
    console.log('set position', position);
    updatePosition(position);
    setNameY(positions[position]['nameY']);
    setNameTextLength(positions[position]['nameTextLength']);
    setDescriptionLine1DY(positions[position]['descriptionLine1DY']);
    setDescriptionLine2DY(positions[position]['descriptionLine2DY']);
    setDescriptionLine1DX(positions[position]['descriptionLine1DX']);
    setDescriptionLine2DX(positions[position]['descriptionLine2DX']);
  };

  useEffect(() => {
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

    const mql800 = window.matchMedia('(min-width: 800px)');
    const screenTest800 = (e) => {
      if(e.matches) {
        if(currentPosition !== '800' && e.matches) setPosition('800');
      }
    }
    mql800.addListener(screenTest800);
    screenTest800(mql800);
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
          y={nameY}
          textLength={nameTextLength}
          variants={profileNameVariants}
          layout
        >
          Rachael Passov
        </motion.tspan>
        <motion.tspan
          className={styles['profile-description-line1']}
          x="50%"
          dx={descriptionLine1DX}
          dy={descriptionLine1DY}
          variants={profileDescriptionVariants}
          layout
        >
            UX Designer /
        </motion.tspan>
        <motion.tspan
          className={styles['profile-description-line2']}
          x="50%"
          dx={descriptionLine2DX}
          dy={descriptionLine2DY}
          variants={profileDescriptionVariants}
          layout
        >
            Frontend Engineer
        </motion.tspan>
      </text>
    </motion.svg>
    // {/* <motion.div
    //   className={styles['profile-description']}
    //   variants={profileItemVariants}
    // >
    //   <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
    //   <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
    // </motion.div>
    // <motion.div
    //   variants={buttonVariants}
    // >
    //   <Button
    //     href='/Rachael Passov - Resume.pdf'
    //     onMouseEnter={() => dispatch(setHoverResume(true))}
    //     onMouseLeave={() => dispatch(setHoverResume(false))}
    //   >
    //       Resume
    //   </Button>
    //   <Button
    //     href='https://github.rachael.io'
    //     onMouseEnter={() => dispatch(setHoverGithub(true))}
    //     onMouseLeave={() => dispatch(setHoverGithub(false))}
    //   >
    //       Github
    //   </Button>
    // </motion.div> */}
  );
}

export default ProfileText;
