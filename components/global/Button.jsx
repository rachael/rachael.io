import Link from 'next/link';

import styles from 'styles/global/Button.module.scss';

function Button({
  text,
  href = '#',
  as,
  ...props
}) {
  const button = (
    <a className={styles.button} href={href} {...props}>{props.children}</a>
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

export default Button;
