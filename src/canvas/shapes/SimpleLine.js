import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '../'
import { everyShapeProps } from '../abstract'

export function newSimpleLine(points) {
  let shape = new Konva.Line({
    kind: shapeKinds.StraghtLine,
    ...everyShapeProps(),
    
    points,
    lineCap: 'round',
    lineJoin: 'round',
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
  })

return shape
}