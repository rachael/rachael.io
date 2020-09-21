import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { imageLoadCompleteBG, reverseBackgroundDirection, setBackgroundTranslateY, wiggle } from 'redux/actions';
import initialState from 'redux/initialState';

import styles from 'styles/page/Layout.module.scss';

import { Dots, Footer, Header } from '.';

function Layout({
  title,
   ...props
}) {
  const dispatch = useDispatch();

  // Must detect Firefox because animations are too laggy in Firefox to run
  // All browser detection credit goes to https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
  const isFirefox = typeof InstallTrigger !== 'undefined';

  // wiggle demo: controls whether dots are rendered or not
  const wiggleEnabled = useSelector(state => state.wiggle);
  const wiggleCB = useCallback(() => dispatch(wiggle(!wiggleEnabled)));

  // track window width/height for mobile detection
  const [[windowWidth, windowHeight], setWindowSize] = useState([0, 0]);

  const updateWindowSize = () => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }

  useEffect(() => {
    updateWindowSize();
  }, []);

  // image load
  const bgRef = useRef();
  const isImageLoadCompleteBG = useSelector(state => state.imageLoadCompleteBG);
  const setLoadCompleteCB = useCallback(() => {
    if(!isImageLoadCompleteBG) dispatch(imageLoadCompleteBG());
  }, [isImageLoadCompleteBG, dispatch]);

  useEffect(() => {
    if(!isImageLoadCompleteBG && bgRef.current.complete) dispatch(imageLoadCompleteBG());
  });

  // background scroll effect
  const [mouseOverBackground, setMouseOverBackground] = useState();
  const [initialScrollStarted, setInitialScrollStarted] = useState();
  const loadCompleteContent = useSelector(state => state.loadCompleteContent);
  const backgroundDirection = useSelector(state => state.backgroundDirection);
  const backgroundTranslateY = useMotionValue('-120vh');
  const bgControls = useAnimation();
  const [backgroundInitialStarted, setBackgroundInitialStarted] = useState();
  const [backgroundInitialDone, setBackgroundInitialDone] = useState();

  useEffect(() => {
    const unsubscribeBackgroundTranslateY = backgroundTranslateY.onChange(
      (translateY) => dispatch(setBackgroundTranslateY(translateY))
    );
    return () => {
      unsubscribeBackgroundTranslateY();
    }
  });

  useEffect(() => {
    if(!backgroundInitialStarted && isImageLoadCompleteBG) {
      bgControls.start('visible').then(() => setBackgroundInitialDone(true));
      setBackgroundInitialStarted(true);
    }
  }, [isImageLoadCompleteBG]);

  const bgStartScroll = useCallback(() => {
    if(!loadCompleteContent) setMouseOverBackground(true);
    if(loadCompleteContent && backgroundInitialDone && !isFirefox) {
      bgControls.start('scrollToEnd').then(() => {
        dispatch(reverseBackgroundDirection());
        bgControls.start('scroll');
      });
    }
  }, [loadCompleteContent, backgroundInitialDone]);

  const bgStopScroll = useCallback(() => {
    setMouseOverBackground(false);
    if(backgroundInitialDone) {
      bgControls.stop();
    }
  }, [backgroundInitialDone]);

  useEffect(() => {
    if(loadCompleteContent && backgroundInitialDone && mouseOverBackground && !initialScrollStarted && !isFirefox) {
      bgControls.start('scroll');
      setInitialScrollStarted(true);
    }
  }, [loadCompleteContent, backgroundInitialDone]);

  // content appear animation
  const bgVariants = {
    scroll: ([y, dir]) => ({
      translateY: dir === 'reverse' ? ['0vh', '-120vh'] : ['-120vh', '0vh'],
      transition: {
        yoyo: Infinity,
        duration: 120,
        times: [0, 1],
      }
    }),
    scrollToEnd: ([y, dir]) => ({
      translateY: dir === 'reverse' ? [null, '-120vh'] : [null, '0vh'],
      transition: {
        duration: dir === 'reverse' ? (120 - Math.abs(parseFloat(y))) : Math.abs(parseFloat(y)),
      }
    }),
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
      }
    },
    hidden: {
      opacity: 0,
    }
  };
  const layoutVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0,
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0,
      }
    }
  };
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      }
    }
  };
  const contentVariants = {
    visible: {
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

  return (
    <motion.div
      key="layout"
      className={styles.layout}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={layoutVariants}
    >
      <Header title={title} />
      <img
        className={styles['background-loader']}
        src="/images/bg_postits_blur.png"
        alt=""
        ref={bgRef}
        onLoad={setLoadCompleteCB}
      />
      <AnimatePresence>
        {windowWidth >= 800 && isImageLoadCompleteBG && <motion.div
          key="bg"
          className={styles['background-image']}
          variants={bgVariants}
          animate={bgControls}
          onMouseEnter={bgStartScroll}
          onMouseLeave={bgStopScroll}
          custom={[backgroundTranslateY.get(), backgroundDirection]}
          style={{ translateY: backgroundTranslateY }}
        />}
      </AnimatePresence>
      <motion.div
        key="container"
        className={styles.container}
        variants={containerVariants}
      >
        <motion.div
          key="content"
          className={styles.content}
          variants={contentVariants}
        >
          {props.children}
        </motion.div>
        <Footer key="footer">
          <a className="link"
             href="#"
             onClick={wiggleCB}>
            wiggle
          </a>
        </Footer>
      </motion.div>
      <Dots renderDots={wiggleEnabled} />
    </motion.div>
  );
}

export function getStaticProps() {
  return {
    props: {
      initialReduxState: initialState,
    },
  }
}

export default Layout;
