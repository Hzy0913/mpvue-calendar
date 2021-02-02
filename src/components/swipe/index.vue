<template>
  <div
    style='margin:0 auto'
    :class="[useSwipe ? 'vc-calendar-swipe': 'vc-calendar-timetable-container']"
    ref="swipeRef"
  >
    <div
      :class="[useSwipe ? 'swipe-wrap': 'vc-calendar-timetable-wrapper']"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, onMounted } from 'vue';
  import { offloadFn } from '../utils';
  import { hasTransitions } from './utils';
  import { SwipeInterface, startType, deltaType } from './declare';
  import './style.less';

  export default {
    props: {
      initialSlide: {
        type: Number,
        default: 0
      },
      auto: {
        type: Number,
        default: 3000
      },
      speed: {
        type: Number,
        default: 300
      },
      loop: {
        type: Boolean,
        default: false
      },
      useSwipe: {
        type: Boolean,
      },
    },
    emits: ['swiperChange', 'swiperChangeEnd', 'start', 'containerChange'],
    setup(props: SwipeInterface, { emit }: any) {
      let isTransitionEnd = true;
      const { initialSlide, auto, speed, loop, useSwipe } = props;  // eslint-disable-line

      if (!useSwipe) return;

      const options = {
        initialSlide,
        auto,
        speed,
        loop,
        disableScroll: false,
        stopPropagation: false,
        callback(index: number, element: HTMLElement) {
          emit('swiperChange', index, element);
        },
        transitionEnd(index: number, element: HTMLElement) {
          emit('swiperChangeEnd', index, element);

          setTimeout(() => {
            isTransitionEnd = true;
          });
        },
      };
      const swipeRef = ref(null);
      const browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch,
        transitions: hasTransitions(),
      };

      let index: number = options.initialSlide || 0;
      let container: HTMLElement;
      let element: any;
      let slides: any;
      let slidePos: any;
      let width: number;
      options.loop = options.loop ?? true;

      function setup() {
        if (!container) return;
        setTimeout(() => emit('containerChange', container));

        element = container.children[0];
        // cache slides
        slides = element.children;

        // set loop to false if only one slide
        if (slides.length < 2) options.loop = false;

        //special case if two slides
        if (browser.transitions && options.loop && slides.length < 3) {
          element.appendChild(slides[0].cloneNode(true));
          element.appendChild(element.children[1].cloneNode(true));
          slides = element.children;
        }

        // create an array to store current positions of each slide
        slidePos = new Array(slides.length);

        // determine width of each slide
        width = container.getBoundingClientRect().width || container.offsetWidth;

        element.style.width = `${slides.length * width}px`;

        // stack elements

        let pos = slides.length;
        while (pos--) {
          const slideDom = slides[pos];

          slideDom.style.width = `${width}px`;
          slideDom.setAttribute('data-index', pos);

          if (browser.transitions) {
            slideDom.style.left = `${pos * -width}px`;
            move(pos, index > pos ? -width : (index < pos ? width : 0), 0); // eslint-disable-line
          }
        }

        // reposition elements before and after index
        if (options.loop && browser.transitions) {
          move(circle(index - 1), -width, 0);
          move(circle(index + 1), width, 0);
        }

        if (!browser.transitions) {
          element.style.left = `${index * -width}px`;
        }

        container.style.visibility = 'visible';
      }

      function prev() {
        if (options.loop) {
          slide(index - 1);
        } else if (index) {
          slide(index - 1);
        }
      }

      function next() {
        if (options.loop) {
          slide(index + 1);
        } else if (index < slides.length - 1) {
          slide(index + 1);
        }
      }

      function slide(to: number, slideSpeed?: number) {
        // do nothing if already on requested slide
        if (index === to) return;

        if (browser.transitions) {
          let direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

          // get the actual position of the slide
          if (options.loop) {
            const naturalDirection = direction;
            direction = -slidePos[circle(to)] / width;

            // if going forward but to < index, use to = slides.length + to
            // if going backward but to > index, use to = -slides.length + to
            if (direction !== naturalDirection) {
              to = -direction * slides.length + to;
            }
          }

          let diff = Math.abs(index - to) - 1;

          // move all the slides between index and to in the right direction
          while (diff--) {
            move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
          }

          to = circle(to);

          move(index, width * direction, slideSpeed ?? speed);
          move(to, 0, slideSpeed ?? speed);

          if (options.loop) { // we need to get the next in place
            move(circle(to - direction), -(width * direction), 0);
          }
        } else {
          to = circle(to);
          animate(index * -width, to * -width, slideSpeed || speed as number);
          //no fallback for a circular loop if the browser does not accept transitions
        }

        index = to;
        offloadFn(options.callback && options.callback(index, slides[index]));
      }

      function circle(circleIndex: number) {
        // a simple positive modulo using slides.length
        return (slides.length + (circleIndex % slides.length)) % slides.length;
      }

      function move(moveIndex: number, dist: any, moveSpeed: number) {
        translate(moveIndex, dist, moveSpeed);
        slidePos[moveIndex] = dist;
      }

      function translate(translateIndex: number, dist: any, translateSpeed: number) {
        const slideDom = slides[translateIndex];
        const style = slideDom && slideDom.style;

        if (!style) return;

        const duration = `${translateSpeed}ms`;
        style.webkitTransitionDuration = duration;
        style.MozTransitionDuration = duration;
        style.msTransitionDuration = duration;
        style.OTransitionDuration = duration;
        style.transitionDuration = duration;

        style.webkitTransform = `translate(${dist}px, 0)translateZ(0)`;
        style.msTransform = style.MozTransform = style.OTransform = `translateX(${dist}px)`; // eslint-disable-line
      }

      function animate(from: any, to: any, animateSpeed: number) {
        // if not an animation, just reposition
        if (!animateSpeed) {
          element.style.left = `${to}px`;
          return;
        }

        const start = +new Date();
        const timer = setInterval(() => {
          const timeElap = +new Date() - start;

          if (timeElap > animateSpeed) {
            element.style.left = `${to}px`;
            options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
            clearInterval(timer);
            return;
          }

          element.style.left = (( (to - from) * (Math.floor((timeElap / animateSpeed) * 100) / 100) ) + from) + 'px'; // eslint-disable-line
        }, 4);
      }

      // setup initial vars
      let start = {} as startType;
      let delta = {} as deltaType;
      let isScrolling: boolean | undefined;

      // setup event capturing
      const events = {
        handleEvent(event: any) {
          switch (event.type) {
            case 'touchstart':
              this.start(event);
              break;
            case 'touchmove':
              this.move(event);
              break;
            case 'touchend':
              offloadFn(this.end(event));
              break;
            case 'webkitTransitionEnd':
            case 'msTransitionEnd':
            case 'oTransitionEnd':
            case 'otransitionend':
            case 'transitionend':
              offloadFn(this.transitionEnd(event));
              break;
            case 'resize':
              offloadFn(setup);
              break;
          }

          if (options.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
          }
        },
        start(event: any) {
          emit('start');

          if (!isTransitionEnd) {
            return setTimeout(() => {
              isTransitionEnd = true;
            });
          }

          const touches = event.touches[0];
          // measure start values
          start = {
            // get initial touch coords
            x: touches.pageX,
            y: touches.pageY,
            time: +new Date() // store time to determine touch duration
          };

          // used for testing first move event
          isScrolling = undefined;

          // reset delta and end measurements
          delta = {
            x: 0,
            y: 0,
          };

          // attach touchmove and touchend listeners
          element.addEventListener('touchmove', this, false);
          element.addEventListener('touchend', this, false);
        },
        move(event: any) {
          // ensure swiping with one touch and not pinching
          if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

          if (options.disableScroll) event.preventDefault();

          const touches = event.touches[0];

          // measure change in x and y
          delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
          };

          // determine if scrolling test has run - one time test
          if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
          }

          // if user is not trying to scroll vertically
          if (!isScrolling) {
            // prevent native scrolling
            event.preventDefault();

            // stop slideshow
            stop();

            // increase resistance if first or last slide
            if (options.loop) { // we don't add resistance at the end
              translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
              translate(index, delta.x + slidePos[index], 0);
              translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
            } else {
              /* eslint-disable */
              delta.x =
                delta.x /
                ( (!index && delta.x > 0               // if first slide and sliding left
                  || index == slides.length - 1        // or if last slide and sliding right
                  && delta.x < 0                       // and if sliding at all
                ) ?
                  ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                  : 1 );                                 // no resistance if false
              /* eslint-disable */

              // translate 1:1
              translate(index - 1, delta.x + slidePos[index - 1], 0);
              translate(index, delta.x + slidePos[index], 0);
              translate(index + 1, delta.x + slidePos[index + 1], 0);
            }
          }
        },
        end(event: any) {
          isTransitionEnd = false;
          // measure duration
          const duration = +new Date - start.time;

          // determine if slide attempt triggers next/prev slide
          const isValidSlide =
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width / 2;      // or if slide amt is greater than half the width

          // determine if slide attempt is past start and end
          let isPastBounds =
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

          if (options.loop) {
            isPastBounds = false;
          }

          // determine direction of swipe (true:right, false:left)
          const direction = delta.x < 0;

          // if not scrolling vertically
          if (!isScrolling) {
            if (isValidSlide && !isPastBounds) {
              if (direction) {
                if (options.loop) { // we need to get the next in this direction in place
                  move(circle(index - 1), -width, 0);
                  move(circle(index + 2), width, 0);
                } else {
                  move(index - 1, -width, 0);
                }

                move(index, slidePos[index] - width, speed);
                move(circle(index + 1), slidePos[circle(index + 1)]-width, speed);
                index = circle(index + 1);
              } else {
                if (options.loop) { // we need to get the next in this direction in place
                  move(circle(index + 1), width, 0);
                  move(circle(index - 2), -width, 0);
                } else {
                  move(index + 1, width, 0);
                }

                move(index, slidePos[index]+width, speed);
                move(circle(index - 1), slidePos[circle(index - 1)]+width, speed);
                index = circle(index - 1);
              }

              options.callback && options.callback(index, slides[index]);
            } else {
              if (options.loop) {
                move(circle(index - 1), -width, speed);
                move(index, 0, speed);
                move(circle(index + 1), width, speed);
              } else {
                move(index - 1, -width, speed);
                move(index, 0, speed);
                move(index + 1, width, speed);
              }
            }
          }

          // kill touchmove and touchend event listeners until touchstart called again
          element.removeEventListener('touchmove', events, false)
          element.removeEventListener('touchend', events, false)
        },
        transitionEnd(event: any) {
          if (parseInt(event.target.getAttribute('data-index'), 10) === index) {
            options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
          }
        }
      }

      onMounted(() => {
        container = swipeRef.value as any;
        setup();

        if (browser.addEventListener) {
          // set touchstart event on element
          if (browser.touch) {
            element.addEventListener('touchstart', events, false);
          }

          if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
          }

          // set resize event on window
          window.addEventListener('resize', events, false);
        }
      });

      return {
        swipeRef,
        slide,
        useSwipe,
        prev,
        next,
      }
    }
  }
</script>
