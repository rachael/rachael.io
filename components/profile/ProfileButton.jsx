import { motion } from 'framer-motion';
import Link from 'next/link';

import styles from 'styles/global/Button.module.scss';

function ProfileButton({
  text,
  href = '#',
  as,
  position,
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
        y="100%"
        dx={dx}
        dy="1em"
        fontFamily="Indie Flower"
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
