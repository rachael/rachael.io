import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import { wiggle } from 'redux/actions';
import initialState from 'redux/initialState';

import styles from 'styles/page/Layout.module.scss';

import { Dots, Footer, Header } from '.';

function Layout({
  title,
  footer,
   ...props
}) {
  // wiggle demo -- controls whether dots are rendered or not
  const dispatch = useDispatch();
  const wiggleEnabled = useSelector(state => state.wiggle);
  // background scroll effect
  const backgroundScroll = useSelector(state => state.backgroundScroll);
  const backgroundClass = classNames(
    `${styles['background-image']}`,
    { [styles['background-scroll']]: backgroundScroll }
  );
  return (
    <motion.div
      key="layout"
      className={styles.layout}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: .4}}
    >
      <Header title={title} />
      <div className={backgroundClass} />
      <motion.div
        key="container"
        className={styles.container}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: .4, delay: .3}}
      >
        <motion.div
          key="content"
          className={styles.content}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: .4, delay: .8}}
        >
          {props.children}
        </motion.div>
        <Footer>
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
