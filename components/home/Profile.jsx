import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/global';
import { setHoverGithub, setHoverResume } from 'redux/actions';

import styles from 'styles/home/Profile.module.scss';

function Profile() {
  const dispatch = useDispatch();

  // The following line fixes a framer-motion bug where the Profile never
  // animates in after adding a useEffect to the Layout.
  // Bug is nonsensical; Profile animates if pasted into Layout directly but not
  // if composed using props.children.
  // This is a strange fix but I'm not going to complain that it works.
  const isLoadCompleteBG = useSelector(state => state.loadCompleteBG);
  const isLoadCompleteContent = useSelector(state => state.loadCompleteContent);

  // content appear animation
  const profileVariants = {
    visible: {
      opacity: 1,
      transition: {
        delay: 1.6,
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
  const buttonVariants = {
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
  }
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
    <motion.div
      key="profile"
      className={styles.profile}
      variants={profileVariants}
    >
      <motion.h1
        className={styles['profile-name']}
        variants={profileItemVariants}
      >
          Rachael Passov
      </motion.h1>
      <motion.div
        className={styles['profile-description']}
        variants={profileItemVariants}
      >
        <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
        <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
      </motion.div>
      <motion.div
        variants={buttonVariants}
      >
        <Button
          href='/Rachael Passov - Resume.pdf'
          onMouseEnter={() => dispatch(setHoverResume(true))}
          onMouseLeave={() => dispatch(setHoverResume(false))}
        >
            Resume
        </Button>
        <Button
          href='https://github.rachael.io'
          onMouseEnter={() => dispatch(setHoverGithub(true))}
          onMouseLeave={() => dispatch(setHoverGithub(false))}
        >
            Github
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
