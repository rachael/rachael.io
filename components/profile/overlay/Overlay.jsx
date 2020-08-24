import classNames from 'classnames';
import { AnimatePresence, motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { OverlayText } from '.';

import styles from 'styles/home/Profile.module.scss';

function Overlay({
  overlayText,
  className,
  items,
}) {
  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.4,
      },
    },
  };
  const overlayItemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  return (
    <motion.div
      key={className}
      className={styles[className]}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <OverlayText>{overlayText}</OverlayText>
      {
        items.map(item =>
          <motion.p
            key={item}
            variants={overlayItemVariants}
          >
            {item}
          </motion.p>
        )
      }
    </motion.div>
  );
}

export default Overlay;
