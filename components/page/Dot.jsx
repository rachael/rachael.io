import React, { Component } from 'react';

import { distanceFromCircle, getRandomInt, normalizeVector } from 'lib/math';

import styles from 'styles/page/Dots.module.scss'

/**
 * A decorative Dot, created by Dots which generates a random number of Dots
 * along the left and right edge of the screen.
 */
class Dot extends Component {
  constructor(props) {
    super(props);
    // offset of the circle's centerpoint, calculated in componentDidMount
    this.baseOffsetY = 0;
    this.baseOffsetX = 0;
    // circle width, set in componentDidMount
    this.width = 0;
    // extra width, in rem, added by transparent "halo" so dotRun animation
    // begins when mouse is still outside Dot.
    this.haloWidth = 4;

    this.ref = React.createRef();

    // initial values are set in componentDidMount to avoid next.js mismatch
    // between client & server
    this.state = {
      baseTransformX: 0,
      baseTransitionDelay: 0,
      dotWidth: 0,
      dotColor: 0,
      dotPositionY: 0,
      runningX: 0,
      runningY: 0,
    }
  }

  /**
   * componentDidMount - set initial values for randomized variables and set
   * internal values for Dot position and size
   */
  componentDidMount() {
    // number of dot colors in 'styles/_variables.scss'
    const numDotColors = 8;
    // number of dot widths possible, from Dots css module
    const numDotWidthSteps = 6;

    this.setState({
      // Randomly translateX each dot to vary dot position along edge, in rem
      baseTransformX: getRandomInt(-2, 2),
      // Transition delay makes dots appear randomly on resize sm -> md
      baseTransitionDelay: getRandomInt(400, 800),
      // dot width and color, controlled by Dots css module
      dotWidth: getRandomInt(1, numDotWidthSteps),
      dotColor: getRandomInt(1, numDotColors),
      // random position from 0 to 100vh
      dotPositionY: getRandomInt(0, 100),
    }, () => {
      this.baseOffsetY = this.ref.current.offsetTop + this.ref.current.offsetHeight/2;
      this.baseOffsetX = this.ref.current.offsetLeft + this.ref.current.offsetWidth/2 + (this.state.baseTransformX * 16);
      // width: offset width + halo width + (1px blur radius * 2)
      this.width = this.ref.current.offsetWidth + (this.haloWidth * 16) + 2;
    });
  }

  /**
   * Dots ever so slightly "run" away from the mouse on mouseover.
   *
   * @param  {event} e A mousemove event
   */
  dotRun = (e) => {
    let vectorX = this.baseOffsetX - e.clientX;
    let vectorY = this.baseOffsetY - e.clientY;
    // normalize vector
    [vectorX, vectorY] = normalizeVector(vectorX, vectorY);
    // scale vector as a function of mouse distance from dot edge:
    // mouse closer to dot center => dot "runs" further away
    // mouse further from dot center => dot "runs" away less
    const distance = distanceFromCircle(e.clientX, e.clientY, this.baseOffsetX, this.baseOffsetY, this.width/2);
    const force = distance * 0.2;
    vectorX *= force;
    vectorY *= force;
    // only animate if vector changes
    if (vectorX === this.state.runningX && vectorY === this.state.runningY) return;
    this.setState({
      runningX: vectorX,
      runningY: vectorY,
    });
  }

  render() {
      const classNames = `
        ${styles.dot}
        ${styles[this.props.dotType]}
        ${styles[`dot-color-${this.state.dotColor}`]}
        ${styles[`dot-width-${this.state.dotWidth}`]}
      `;

      // Style if dot is not "running"
      const style = {
        top: `calc(${this.state.dotPositionY}vh - ${this.state.dotWidth + 6}rem)`,
        transform: `translateX(${this.state.baseTransformX}rem)`,
        transitionDelay: `${this.state.baseTransitionDelay}ms`,
      };

      // Style if dot is "running"
      if(this.state.runningX || this.state.runningY) {
        style.transform = `translate(
                            calc(${this.state.baseTransformX}rem + ${this.state.runningX}px),
                            ${this.state.runningY}px
                          )`;
        style.transitionDelay = '0ms';
      }

      return (
        <div
          ref={this.ref}
          className={classNames}
          style={style}
          onMouseEnter={this.dotRun}
          onMouseMove={this.dotRun}
        />
      );
  }
}

export default Dot;
