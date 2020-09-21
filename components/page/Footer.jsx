import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import styles from 'styles/page/Layout.module.scss';

function Footer({ ...props }) {
  // only appear after content has loaded
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);

  // content appear animation
  const footerVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.4,
      }
    }
  };
  return (isLoadCompleteContent &&
    <motion.footer
      className={styles.footer}
      variants={footerVariants}
    >
      {props.children}
    </motion.footer>
  );
}

export default Footer;
