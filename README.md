```
GENERATE ROADWAY
<Line
  x={20}
  y={200}
  points={[0, 0, 100, 80 , 200 , 84 , 300 , 0]}
  // tension={0.5}
  closed
  stroke="black"
  fillLinearGradientStartPoint={{ x: 0, y: 200 }}
  fillLinearGradientEndPoint={{ x: 50, y: 50 }}
  fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
/>

```

```
GENERATE STEPS

const HEIGHT_INITIAL = 40;
const DEFAULT_STEP = [0, 0,
  0, HEIGHT_INITIAL]
function getStepArray(STEP = 0, HEIGHT = HEIGHT_INITIAL) {
  STEP = Math.ceil(STEP);
  const END_RADIUS = [STEP * 100, HEIGHT]
  const END_TOP_RADIUS = [STEP * 100, -HEIGHT * STEP]

  function getStep(STEP, prevData = []) {
    const STEP_LENGTH = (STEP - 1) * 100;
    const data = [
      ...prevData,
      STEP_LENGTH, -(HEIGHT * STEP),
      STEP_LENGTH, -(HEIGHT * (STEP - 1)),
    ]

    if (STEP !== 1) return getStep(STEP - 1, data)
    return data
  }

  return [
    ...DEFAULT_STEP,
    ...END_RADIUS,
    ...END_TOP_RADIUS,
    ...getStep(STEP)
  ]
}


```
