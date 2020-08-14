import { Button } from 'components/global'

import styles from 'styles/home/Profile.module.scss'

function Profile() {
  return (
    <div className={styles.profile}>
      <h1 className={styles['profile-name']}>Rachael Passov</h1>
      <h2 className={styles['profile-description-line1']}>UX Designer /</h2>
      <h2 className={styles['profile-description-line2']}>Frontend Engineer</h2>
      <div>
        <Button href='/resume.pdf'>Resume</Button>
        <Button href='https://github.rachael.io'>Github</Button>
      </div>
    </div>
  )
}

export default Profile
