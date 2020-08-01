import { Dots, Footer, Header } from '.'
import styles from 'styles/page/Layout.module.scss'

function Layout({
  title,
  footerText,
   ...props
  }) {
  return (
    <>
      <div className={styles['background-image']} />
      <div className={styles.container}>
        <Header title={title} />

        <main className={styles.main}>
          {props.children}
        </main>

        <Footer footerText={footerText} />
      </div>
      <Dots />
    </>
  )
}

export default Layout
