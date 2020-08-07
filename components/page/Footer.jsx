import styles from 'styles/page/Layout.module.scss'

function Footer({ ...props }) {
  return (
    <footer className={styles.footer}>
      {props.children}
    </footer>
  )
}

export default Footer
