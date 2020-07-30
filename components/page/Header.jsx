import Head from 'next/head'

function Header({ title }) {
  return (
    <Head>
      <title>rachael.io{ title && ` :: ${title}` }</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default Header
