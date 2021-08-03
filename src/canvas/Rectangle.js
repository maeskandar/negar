import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { resetTransformGen, onDragMoveGen, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newRectangle() {
  let shape = new Konva.Rect({
    id: v1(),
    kind: shapeKinds.Reactangle,

    x: 50,
    y: 50,
    width: 100,
    height: 100,
    rotation: 0,

    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,

    draggable: false, // TODO add default abstract shape and spread it in every object [ on top ]
  })

  shape.on('transformend', resetTransformGen(shape))
  shape.on('dragmove', onDragMoveGen(shape))
  return shape
}
