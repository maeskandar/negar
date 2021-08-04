import Konva from "konva"

import { shapeKinds } from './'
import { addCommonEvents, fillableProps, commonShapeProps, basicCoordinate, basicSize } from './abstract'

export function newImage(content) { // FIXME image load
  let shape = new Konva.Image({
    kind: shapeKinds.Image,
    content,
    ...commonShapeProps(),

    ...basicCoordinate(),
    ...basicSize(),
    ...fillableProps(),
  })

  addCommonEvents(shape)
  return shape
}
