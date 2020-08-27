import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadCompleteBG, wiggle } from 'redux/actions';
import initialState from 'redux/initialState';

import styles from 'styles/page/Layout.module.scss';

import { Dots, Footer, Header } from '.';

function Layout({
  title,
   ...props
}) {
  const dispatch = useDispatch();

  // wiggle demo: controls whether dots are rendered or not
  const wiggleEnabled = useSelector(state => state.wiggle);
  const wiggleCB = useCallback(() => dispatch(wiggle(!wiggleEnabled)));

  // background scroll effect
  const backgroundScroll = useSelector(state => state.backgroundScroll);
  const backgroundClass = classNames(
    styles['background-image'],
    { [styles['background-scroll']]: backgroundScroll }
  );

  // content animating: hides overflow and expands container during animations.
  // optimistically assumes content will animate -- must set to false inside
  // content to reenable scrolling.
  const contentAnimating = useSelector(state => state.contentAnimating);
  const contentClasses = classNames(
    styles.content,
    { ['content-animating']: contentAnimating }
  );

  // image load
  const bgRef = useRef();
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const setLoadCompleteCB = useCallback(() => {
    if(!isLoadCompleteBG) dispatch(loadCompleteBG());
  }, [isLoadCompleteBG, dispatch]);
  useEffect(() => {
    if(!isLoadCompleteBG && bgRef.current.complete) dispatch(loadCompleteBG());
  });
  const layoutClasses = classNames(
    styles.layout,
    { [styles['bg-loading']]: !isLoadCompleteBG }
  );

  // content appear animation
  const bgVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
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
        duration: 0.4,
      }
    },
    hidden: {
      opacity: 0,
    }
  };
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.4,
        staggerChildren: 2,
      }
    },
    hidden: {
      opacity: 0,
    }
  };
  const contentVariants = {
    visible: {
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

  return (
    <motion.div
      key="layout"
      className={layoutClasses}
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
      <svg width="100%" height="0">
        <defs>
          <pattern id="backgroundFill" patternUnits="userSpaceOnUse" width="100vw" height="100vh">
            <image
              className={styles['background-fill']}
              x="0"
              y="0"
              width="100vw"
              height="300vh"
              preserveAspectRatio="xMinYMin slice"
              href="/images/bg_postits_blur.png"
            >
            </image>
          </pattern>
        </defs>
      </svg>
      <AnimatePresence>
        {isLoadCompleteBG && <motion.div
          key="bg"
          className={backgroundClass}
          variants={bgVariants}
        />}
      </AnimatePresence>
      <motion.div
        key="container"
        className={styles.container}
        variants={containerVariants}
      >
        <motion.div
          key="content"
          className={contentClasses}
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
