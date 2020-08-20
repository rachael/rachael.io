import Head from 'next/head'

function Header({ title }) {
  return (
    <Head>
      <title>rachael.io{ title && ` :: ${title}` }</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" href="/fonts/Montserrat-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/Rowdies-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/Sacramento.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/profile_sm.png" as="image" />
      <link rel="preload" href="/bg_postits_blur.png" as="image" media="(min-width: 800px)" />
    </Head>
  )
}

export default Header
