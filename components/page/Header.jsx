import Head from 'next/head'

function Header({ title }) {
  return (
    <Head>
      <title>rachael.io{ title && ` :: ${title}` }</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" href="/fonts/Montserrat-Regular.woff2" />
      <link rel="preload" href="/fonts/Rowdies-Bold.woff2" />
    </Head>
  )
}

export default Header
