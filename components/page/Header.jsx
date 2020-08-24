import Head from 'next/head'

function Header({ title }) {
  return (
    <Head>
      <title>rachael.io{ title && ` :: ${title}` }</title>
      // icons
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="theme-color" content="#ffffff" />
      // preload/prefetch
      <link rel="preload" href="/fonts/Montserrat-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/Rowdies-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/Sacramento.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/images/profile_sm.png" as="image" />
      <link rel="preload" href="/images/bg_postits_blur.png" as="image" media="(min-width: 800px)" />
      <link rel="prefetch" href="/images/profile_sm_blur.png" as="image" />
    </Head>
  )
}

export default Header
