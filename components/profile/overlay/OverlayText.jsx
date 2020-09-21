import React, { useEffect, useState } from 'react';

import styles from 'styles/home/Profile.module.scss';

/**
 * Knockout text that appears behind text overlay on the profile image.
 */
function OverlayText(props) {
  // In Firefox knockout text does not work; need to disable fill
  const isFirefox = typeof InstallTrigger !== 'undefined';

  // Also need to disable in Safari
  // All browser detection credit goes to https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
  const isSafari = () => {
    return /constructor/i.test(window.HTMLElement) || (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  };

  const [overlayFillDisabled, setOverlayFillDisabled] = useState();

  useEffect(() => {
    setOverlayFillDisabled(isFirefox || isSafari());
  });

  return (
    <svg className={styles['overlay-knockout-text']}>
      <defs>
        <pattern
          id="overlayfill"
          patternUnits="userSpaceOnUse"
          width="100%"
          height="100%"
        >
          <image
            width="100%"
            height="100%"
            href="/images/profile_sm_overlayfill.png"
          />
        </pattern>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={overlayFillDisabled ? 'rgba(14, 11, 19, 0.2)' : 'url(#overlayfill)'}
        fontFamily="Montserrat"
        fontWeight="900"
        textLength="100%"
        lengthAdjust="spacingAndGlyphs"
      >
        {props.children}
      </text>
    </svg>
  );
}

export default OverlayText;
