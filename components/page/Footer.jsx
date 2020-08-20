import { motion } from 'framer-motion';

import styles from 'styles/page/Layout.module.scss'

function Footer({ ...props }) {
  // content appear animation
  const footerVariants = {
    visible: {
      opacity: [0, 0, 0, 1],
      height: ['0em', '3em', '3em', '3em'],
      transition: {
        timings: [0, 0.01, 0.9, 1],
        duration: 2,
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.4,
      }
    }
  };
  return (
    <motion.footer
      className={styles.footer}
      variants={footerVariants}
    >
      {props.children}
    </motion.footer>
  )
}

export default Footer
