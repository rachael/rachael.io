import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import styles from 'styles/home/Profile.module.scss';

function ProfileName() {
  const [textX, setTextX] = useState('0');
  const [textLength, setTextLength] = useState('100%');

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 800px)');
    const screenTest = (e) => {
      if(e.matches) {
        setTextX('0');
        setTextLength('47.21435316vw');
      } else {
        setTextX('0');
        setTextLength('100%');
      }
    }
    mql.addListener(screenTest);
    screenTest(mql);
  });

  return (
    <>
      <pattern id="profileNameFill" patternUnits="userSpaceOnUse" width="100vw" height="100vh">
        <image
          className={styles['profile-name-fill']}
          y="-50vh"
          width="100vw"
          height="300vh"
          preserveAspectRatio="xMinYMin slice"
          href="/images/bg_postits_blur.png"
        >
        </image>
      </pattern>
      <text
        className={styles['profile-name']}
        x="50%"
        y="100%"
        textAnchor="middle"
        fontFamily="Rowdies"
        textLength={textLength}
        fill="url(#profileNameFill)"
      >
          Rachael Passov
      </text>
      <text
        x="50%"
        y="100%"
        textAnchor="middle"
        fontFamily="Rowdies"
        textLength={textLength}
        fill="url(#profileNameFill)"
      >
          UX Designer /
      </text>
  </>
  );
}

export default ProfileName;
