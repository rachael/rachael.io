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
      <Header title={title} />
      <CSSTransition
        classNames={{
          appear: styles['layout-appear'],
          appearActive: styles['layout-appear-active'],
          appearDone: styles['layout-appear-done'],
        }}
        in
        appear
        timeout={400}
      >
        <div className={styles.layout}>
          <div className={styles['background-image']} />
          <div className={styles.container}>
            <main className={styles.main}>
              <CSSTransition
                classNames={{
                  appear: styles['content-appear'],
                  appearActive: styles['content-appear-active'],
                  appearDone: styles['content-appear-done'],
                }}
                in
                appear
                timeout={400}
              >
                <div className={styles.content}>
                  {props.children}
                </div>
              </CSSTransition>
            </main>
            <Footer footerText={footerText} />
          </div>
          <Dots />
        </div>
      </CSSTransition>
    </>
  )
}

export default Layout
