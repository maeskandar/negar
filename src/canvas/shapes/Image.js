import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, commonShapeProps, basicCoordinate, basicSize } from '../abstract'

export function newImage(src, w, h) {
  var imageObj = new Image()
  imageObj.onload = () => {
    shape.width(w || imageObj.naturalWidth)
    shape.height(h || imageObj.naturalHeight)
  }
  imageObj.onerror = () => {
    shape.fill('#aa3333')
  }
  
  let shape = new Konva.Image({
    kind: shapeKinds.Image,
    ...commonShapeProps(),

    image: imageObj,

    ...basicCoordinate(),
    ...basicSize(),
    opacity: 1,
  })

  imageObj.src = src

  addCommonEvents(shape)
  return shape
}
