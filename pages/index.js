import { Profile, ProfileImg } from 'components/home'
import { Layout } from 'components/page'

import styles from 'styles/page/Layout.module.scss'

export default function Home() {
  return (
    <Layout>
      <ProfileImg />
      <Profile />
    </Layout>
  )
}
