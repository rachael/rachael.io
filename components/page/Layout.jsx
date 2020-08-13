import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Dots, Footer, Header } from '.';

import styles from 'styles/page/Layout.module.scss';

function Layout({
  title,
  footer,
   ...props
}) {
  // wiggle demo -- controls whether dots are rendered or not
  const wiggle = useSelector(state => state.wiggle);
  // background scroll effect
  const backgroundScroll = useSelector(state => state.backgroundScroll);
  const backgroundClass = classNames(
    `${styles['background-image']}`,
    { [styles['background-scroll']]: backgroundScroll }
  );
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
          <div className={backgroundClass} />
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
                <>
                  <div className={styles.content}>
                    {props.children}
                  </div>
                  <Footer>{footer}</Footer>
                </>
              </CSSTransition>
            </main>
          </div>
          <Dots renderDots={wiggle} />
        </div>
      </CSSTransition>
    </>
  );
}

export default Layout;
