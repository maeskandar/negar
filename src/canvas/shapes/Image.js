import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, everyShapeProps, basicShape } from '../abstract'

export function newImage(src, w, h) {
  var imageObj = new Image()
  imageObj.src = src
  imageObj.onload = () => {
    shape.width(w || imageObj.naturalWidth)
    shape.height(h || imageObj.naturalHeight)
  }
  imageObj.onerror = () => {
    shape.fill('#aa3333')
  }
  
  let shape = new Konva.Image({
    kind: shapeKinds.Image,
    image: imageObj,
    opacity: 1,
    
    ...everyShapeProps(),
    ...basicShape(),
  })

  addCommonEvents(shape)
  return shape
}
