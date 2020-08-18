import { motion } from 'framer-motion';

import styles from 'styles/home/Profile.module.scss';

function ProfileImg() {
  // content appear animation
  const profileImgVariants = {
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
    <motion.div className={styles['profile-img']} variants={profileImgVariants}>
      <img src="/profile_sm.png" alt="Profile picture" />
    </motion.div>
  );
}

export default ProfileImg;
