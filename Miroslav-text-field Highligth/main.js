//Same as: import {tween, styler} from 'popmotion'
const { tween, easing, styler, spring, value, transform, listen, valueTypes } = window.popmotion;
const { blendColor, clamp, interpolate, pipe } = transform;

// Select which elements to use
const input = document.querySelector('.input-container input');
const counter = document.querySelector('.input-container label');

// Setup styler and scale `value`
const counterStyler = styler(counter);
const counterScale = value(1, counterStyler.set('scale'));

//Experiment with the spring-function
/*const divStyler = styler(document.querySelector('.char'));*/

//Gets the input field's max length, 10
const charLimit = parseInt(counter.innerHTML);

//Function for the counter to make it "springy"
function fireSpring() {
  spring({
    // Start the animation from the current scale:
    from: counterScale.get(),

    // spring to rest on 1
    to: 1,
    velocity: Math.max(counterScale.getVelocity(), 200),

    // Stiffness and damping controls the spring motion
    stiffness: 700,
    damping: 80
  }).start(counterScale);
}

  const convertCharCountToColor = pipe(
    clamp(charLimit * 0.5, charLimit),
    
    // Map character count to a 0-1 range. Value 0.5 gives a color change at 6th character.
    interpolate([charLimit * 0.5, charLimit], [0, 1]),
    
    // Blend black and green
    blendColor(counterStyler.get('color'), '#21c90e')
  );

  //Function to vibrate character counter
 /* function springy(){
  tween({
    from: 0,
    to: { x: 1 },
    duration: 500,
    ease: easing.backOut,
    flip: Infinity,
    elapsed: 500,
  }).start(divStyler.set);
}
springy();
*/

  const updateRemainingCharsCounter = (val) => {
    // Measure character count
    const charCount = val.length;
  
    // Set remaining characters
    counter.innerHTML = charLimit - charCount;
  
    // Set counter color
    counterStyler.set('color', convertCharCountToColor(charCount));
  };
  
  //Listener for when user press down on key
  listen(input, 'keydown')
    .filter(({ target }) => target.value.length === charLimit)
    .start(fireSpring);
  
  //Using pipe to pick up the latest value from the event before passing it
  listen(input, 'keyup')
    .pipe(({ target }) => target.value)
    .start(updateRemainingCharsCounter);

