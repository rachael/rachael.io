import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Dot } from '.';

import { getRandomInt } from 'lib/math';

import styles from 'styles/page/Dots.module.scss'

/**
 * Displays randomly generated decorative dots along the left and right edge of
 * the main container.
 *
 * Dots are a random size and position, and appear with a randomized transition
 * delay on resize from small screens.
 *
 * Dots do not appear on small screens.
 */
class Dots extends Component {
  constructor(props) {
    super(props);
    // minimum and maximum number of dots on each side
    this.minDots = 6;
    this.maxDots = 12;

    // contains refs to all currently generated dots
    this.dotRefs = [];

    // initial values are set in componentDidMount to avoid next.js mismatch
    // between client & server
    this.state = {
      numLeftDots: 0,
      numRightDots: 0,
    }
  }

  componentDidMount() {
    this.setState({
      numLeftDots: getRandomInt(this.minDots, this.maxDots),
      numRightDots: getRandomInt(this.minDots, this.maxDots),
    });
  }

  /**
   * Generate one dot, either a 'dot-left' or a 'dot-right', wrapped in a
   * CSSTransition that will animate entering and leaving
   * @param  {ref} ref        React ref for ref forwarding
   * @param  {string} dotType either 'dot-left' or 'dot-right'
   * @param  {number} seed    step number of dot generation loop
   * @return {element}        a Dot element
   */
  generateDot(ref, dotType, seed) {
    return <CSSTransition
      key={`${dotType}-${seed}`}
      classNames={{
        enterActive: styles['dot-enter-active'],
        enterDone: styles['dot-enter-done'],
        exit: styles['dot-exit'],
        exitActive: styles['dot-exit-active'],
        exitDone: styles['dot-exit-done'],
      }}
      timeout={800}
    >
      <Dot
        ref={ref}
        dotType={dotType}
        seed={seed}
      />
    </CSSTransition>
  }

  /**
   * Generate a list of Dot elements
   * @return {element[]} list of dots to display directly in the jsx
   */
  generateDots() {
    const dots = [];
    this.dotRefs = [];

    // generate left dots
    for(let i = 1; i <= this.state.numLeftDots; i++) {
      let ref = React.createRef();
      dots.push(this.generateDot(ref, 'dot-left', i));
      this.dotRefs.push(ref);
    }

    // generate right dots
    for(let i = 1; i <= this.state.numRightDots; i++) {
      let ref = React.createRef();
      dots.push(this.generateDot(ref, 'dot-right', i));
      this.dotRefs.push(ref);
    }

    return dots;
  }

  /**
   * Call dotRun directly on overlapped dots. Mousemove events on overlapped
   * dots are blocked so dotRun must be called to animate.
   */
  passMouseMoveToDots = (e) => {
    const dots = [];

    let foundAllDots = false;
    while(!foundAllDots) {
      let elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem.classList.contains(styles.dot)) {
        dots.push(elem);
        elem.style.pointerEvents = 'none';
      } else {
        foundAllDots = true;
      }
    }

    if(dots.length > 0) for(let dot of dots) {
      dot.style.pointerEvents = '';
      const event = new MouseEvent('mousemove', {
        view: document.window,
        clientX: e.clientX,
        clientY: e.clientY,
      });
      // Does not work because events on overlapped dots are still blocked:
      // dot.dispatchEvent(event);
      for(let dotRef of this.dotRefs) {
        if(dotRef.current && dotRef.current.ref.current === dot) {
          dotRef.current.dotRun(event, dot);
        }
      }
    }
  }

  render() {
    const dots = this.props.renderDots ? this.generateDots() : (
      <CSSTransition
        key='dots-empty'
        timeout={0}
      >
        <></>
      </CSSTransition>
    );
    return (
      <TransitionGroup
        key='dots'
        className={styles.dots}
        onMouseMove={this.passMouseMoveToDots}
      >
        {dots}
      </TransitionGroup>
    )
  }
}

export default Dots
