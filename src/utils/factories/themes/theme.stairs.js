const HEIGHT_INITIAL = 40;
const DEFAULT_STEP = [0, 0,
    0, HEIGHT_INITIAL]

export class ThemeStairs {

    createStairsPoints(STEP = 0, HEIGHT = HEIGHT_INITIAL) {
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

    handle() {
        const stairs = parseInt(prompt("چند پله را پیاده سازی کنیم"));
        return "http://localhost:3000/images/stairs6.png"
    }
}