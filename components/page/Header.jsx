import Head from 'next/head'

function Header({ title }) {
  return (
    <Head>
      <title>rachael.io{ title && ` :: ${title}` }</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" href="/fonts/Montserrat-Regular.woff2" as="font" crossorigin="anonymous" />
      <link rel="preload" href="/fonts/Rowdies-Regular.woff2" as="font" crossorigin="anonymous" />
    </Head>
  )
}

export default Header
