import styles from 'styles/page/Dots.module.scss'

// inclusive random integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDot(dotType, seed) {
  const numDotColors = 8;
  const numDotWidthSteps = 6;
  const dotWidth = getRandomInt(1, numDotWidthSteps);
  return <div
    className={`
      ${styles.dot}
      ${styles[dotType]}
      ${styles[`dot-color-${getRandomInt(1, numDotColors)}`]}
      ${styles[`dot-width-${dotWidth}`]}
    `}
    style={{
      top: `calc(${getRandomInt(0, 100)}vh - ${dotWidth}rem)`,
      transform: `translateX(${getRandomInt(-2, 2)}rem)`
    }}
  />
}

function generateDots() {
  // generate between 6 and 12 dots on each side
  const numLeftDots = getRandomInt(6, 12);
  const numRightDots = getRandomInt(6, 12);

  const dots = [];

  // generate left dots
  for(let i = 1; i <= numLeftDots; i++) {
    dots.push(generateDot('dot-left', i));
  }

  // generate right dots
  for(let i = 1; i <= numRightDots; i++) {
    dots.push(generateDot('dot-right', i));
  }

  return dots;
}

function Dots({ text }) {
  return (
    <div className={styles.dots}>
      {generateDots()}
    </div>
  )
}

export default Dots
