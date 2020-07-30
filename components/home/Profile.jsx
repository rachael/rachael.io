import styles from 'styles/home/Profile.module.scss'

function ProfileImg() {
  return (
    <div className={styles.profile}>
      <h1 className={styles['profile-name']}>Rachael Passov</h1>
      <h2 className={styles['profile-description']}>UX Designer / Frontend Engineer</h2>
    </div>
  )
}

export default ProfileImg
