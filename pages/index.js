import { Profile, ProfileImg } from 'components/home'
import { Layout } from 'components/page'

export default function Home() {
  const footer = (
    <>
      {/* <a>scroll</a> */}
    </>
  );

  return (
    <Layout footer={footer}>
      <ProfileImg />
      <Profile />
    </Layout>
  )
}
