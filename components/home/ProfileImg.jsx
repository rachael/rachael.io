import styles from 'styles/home/Profile.module.scss'

function ProfileImg() {
  return (
    <div className={styles['profile-img']}>
      <img src="/profile_sm.png" alt="Profile picture" />
    </div>
  )
}

export default ProfileImg
