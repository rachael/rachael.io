import { Footer, Header } from '.'
import styles from 'styles/page/Layout.module.scss'

function Layout({
  title,
  footerText,
   ...props
  }) {
  return (
    <div className={styles.container}>
      <Header title={title} />

      <main className={styles.main}>
        {props.children}
      </main>

      <Footer footerText={footerText} />
    </div>
  )
}

export default Layout
