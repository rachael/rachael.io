import { CSSTransition } from 'react-transition-group';

import styles from 'styles/page/Dots.module.scss'

// minimum and maximum number of dots on each side
const minDots = 6;
const maxDots = 12;
// number of dot colors in 'styles/_variables.scss'
const numDotColors = 8;
// number of dot widths possible, from Dots css module
const numDotWidthSteps = 6;

/**
 * Inclusive random integer
 * @param  {number} min the min
 * @param  {number} max the max
 * @return {number}     a random number between min and max, inclusive
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate one dot, either a 'dot-left' or a 'dot-right'
 * @param  {string} dotType either 'dot-left' or 'dot-right'
 * @param  {number} seed    step number of dot generation loop
 * @return {element}        a Dot element
 */
function generateDot(dotType, seed) {
  const dotWidth = getRandomInt(1, numDotWidthSteps);
  return <div
    key={`${dotType} ${seed}`}
    className={`
      ${styles.dot}
      ${styles[dotType]}
      ${styles[`dot-color-${getRandomInt(1, numDotColors)}`]}
      ${styles[`dot-width-${dotWidth}`]}
    `}
    style={{
      top: `calc(${getRandomInt(0, 100)}vh - ${dotWidth}rem)`,
      transform: `translateX(${getRandomInt(-2, 2)}rem)`,
      transitionDelay: `${getRandomInt(400, 800)}ms`
    }}
  />
}

/**
 * Generate an array of Dot elements
 * @return {element[]} list of dots to display directly in the jsx
 */
function generateDots() {
  // generate between 6 and 12 dots on each side
  const numLeftDots = getRandomInt(minDots, maxDots);
  const numRightDots = getRandomInt(minDots, maxDots);

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

/**
 * Displays randomly generated decorative dots along the left and right edge of
 * the main container.
 */
function Dots() {
  return (
    <CSSTransition
      classNames={{
        appear: styles['dots-appear'],
        appearActive: styles['dots-appear-active'],
        appearDone: styles['dots-appear-done']
      }}
      in
      appear
    >
      <div className={styles.dots}>
        {generateDots()}
      </div>
    </CSSTransition>
  )
}

export default Dots
