import { motion } from 'framer-motion';
import Link from 'next/link';

import styles from 'styles/global/Button.module.scss';

function ProfileButton({
  text,
  href = '#',
  as,
  position,
  y = 0, // y must be passed to each item individually to preserve position of fill
  ...props
}) {
  let dx;
  if (position === 'left') dx = '-3em';
  else dx = '3em';

  const button = (
    <a
      className={styles.button}
      href={href}
      xlinkHref={href}
      {...props}
    >
      <text
        x="50%"
        y={y}
        dx={dx}
        dy="1.5em"
        fontFamily="Montserrat"
        textAnchor="middle"
        fill="url(#profileFill)"
      >
        {props.children}
      </text>
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
