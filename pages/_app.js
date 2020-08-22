import { Provider } from 'react-redux'
import { AnimatePresence } from 'framer-motion'

import { Layout } from 'components/page'
import { useStore } from 'redux/store'

import 'styles/globals.scss'

export default function App({ Component, pageProps, router }) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <Provider store={store}>
      <Layout>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </Provider>
  )
}
