import { CSSTransition } from 'react-transition-group';
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
          <CSSTransition
            classNames={{
              appear: styles['content-appear'],
              appearActive: styles['content-appear-active'],
              appearDone: styles['content-appear-done']
            }}
            in
            appear
          >
            <div className={styles.content}>
              {props.children}
            </div>
          </CSSTransition>
        </main>

        <Footer footerText={footerText} />
      </div>
      <Dots />
    </>
  )
}

export default Layout
