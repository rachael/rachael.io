import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import { wiggle } from 'redux/actions';
import initialState from 'redux/initialState';

import styles from 'styles/page/Layout.module.scss';

import { Dots, Footer, Header } from '.';

function Layout({
  title,
   ...props
}) {
  // wiggle demo: controls whether dots are rendered or not
  const dispatch = useDispatch();
  const wiggleEnabled = useSelector(state => state.wiggle);
  // background scroll effect
  const backgroundScroll = useSelector(state => state.backgroundScroll);
  const backgroundClass = classNames(
    styles['background-image'],
    { [styles['background-scroll']]: backgroundScroll }
  );
  // content animating: hides overflow and expands container during animations.
  // must set to false inside content to enable scroll.
  const contentAnimating = useSelector(state => state.contentAnimating);
  const contentClasses = classNames(
    styles.content,
    { [styles['content-animating']]: contentAnimating }
  )
  // content appear animation
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
      className={styles.layout}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={layoutVariants}
    >
      <Header title={title} />
      <div className={backgroundClass} />
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
          <a className='link' href='#' onClick={() => dispatch(wiggle(!wiggleEnabled))}>wiggle</a>
        </Footer>
      </motion.div>
      <Dots renderDots={wiggleEnabled} />
    </motion.div>
  );
}

export function getStaticProps() {
  // Note that in this case we're returning the state directly, without creating
  // the store first (like in /pages/ssr.js), this approach can be better and easier
  return {
    props: {
      initialReduxState: initialState,
    },
  }
}

export default Layout;
