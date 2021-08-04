import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { commonShapeProps } from './abstract'

export function newSimpleLine(points) {
  let shape = new Konva.Line({
    kind: shapeKinds.StraghtLine,
    ...commonShapeProps(),
    
    points,
    lineCap: 'round',
    lineJoin: 'round',
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
  })

  return shape
}