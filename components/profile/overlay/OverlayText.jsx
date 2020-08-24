import styles from 'styles/home/Profile.module.scss';

/**
 * Knockout text that appears behind text overlay on the profile image.
 */
function OverlayText(props) {
  return (
    <svg className={styles['knockout-text']}>
      <pattern id="pattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
        <image width="100%" height="100%" href="/images/profile_sm_overlayfill.png"></image>
      </pattern>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="url(#pattern)"
        fontFamily="Montserrat"
        fontWeight="900"
        textLength="100%"
        lengthAdjust="spacingAndGlyphs"
      >
        {props.children}
      </text>
    </svg>
  );
}

export default OverlayText;
