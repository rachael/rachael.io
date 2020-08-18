import { motion } from 'framer-motion';

import { Button } from 'components/global';

import styles from 'styles/home/Profile.module.scss';

function Profile() {
  // content appear animation
  const profileVariants = {
    visible: {
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
  };
  const profileItemVariants = {
    visible: {
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
    <motion.div className={styles.profile} variants={profileVariants}>
      <motion.h1 className={styles['profile-name']} variants={profileItemVariants}>Rachael Passov</motion.h1>
      <motion.div className={styles['profile-description']} variants={profileItemVariants}>
        <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
        <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
      </motion.div>
      <motion.div variants={profileVariants}>
        <Button href='/resume.pdf' variants={profileItemVariants}>Resume</Button>
        <Button href='https://github.rachael.io' variants={profileItemVariants}>Github</Button>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
