import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import styles from 'styles/home/Profile.module.scss';

function ProfileButton({
  text,
  href = '#',
  as,
  position,
  y = 0, // y must be passed to each item individually to preserve position of fill
  profileOffsetY = 0,
  ...props
}) {
  const textRef = useRef();
  const [textLeft, setTextLeft] = useState(0);
  const [textBottom, setTextBottom] = useState(0);
  const [textRight, setTextRight] = useState(0);

  const [windowWidth, setWindowWidth] = useState(0);

  // track window width, for mobile style
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  }

  // set underline position using text position
  const setUnderlinePosition = () => {
    const textPos = textRef.current.getBoundingClientRect();
    setTextLeft(textPos.left);
    setTextBottom(textPos.bottom);
    setTextRight(textPos.right);
  }

  useEffect(() => {
    const onResize = () => {
      updateWindowWidth();
      setUnderlinePosition();
    }
    onResize();
    // detect orientation change (works for iOS -- and first 'resize' is required)
    if ("onorientationchange" in window) window.addEventListener('resize orientationchange', setUnderlinePosition);
    else window.addEventListener('resize', setUnderlinePosition);
    return () => {
      window.removeEventListener('resize', setUnderlinePosition);
      window.removeEventListener('resize orientataionchange', setUnderlinePosition);
    }
  });

  const [isHover, setIsHover] = useState();

  let dx;
  if (position === 'left') dx = '-3em';
  else dx = '3em';

  const button = (
    <a
      className={styles['profile-button']}
      href={href}
      xlinkHref={href}
      {...props}
    >
      <text
        ref={textRef}
        x="50%"
        y={y}
        dx={dx}
        dy="1.5em"
        fontFamily="Montserrat"
        textAnchor="middle"
        fill="url(#profileFill)"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {props.children}
      </text>
      <AnimatePresence>
        {(isHover || windowWidth < 800) && <motion.path
          d={`M ${textLeft} ${textBottom - profileOffsetY + 3} H ${textRight}`}
          stroke="url(#profileFill)"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
        />}
      </AnimatePresence>
    </a>
  );

  if(href[0] === '/') {
    return (
      <Link href={href} as={href || as}>
        {button}
      </Link>
    )
  } else {
    return button;
  }

}

export default ProfileButton;
