import styles from 'styles/page/Layout.module.scss'

function Footer({ text }) {
  return (
    <footer className={styles.footer}>
      {text}
    </footer>
  )
}

export default Footer
