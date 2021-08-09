import Konva from "konva"

import { shapeKinds } from '../'
import { addCommonEvents, everyShapeProps, basicShape, everyShapeAttrs, applyPropsToShape, applyDefaultSetters } from '../abstract'
import { updateShape } from "../manager"

export function newImage(src, options = {}) {
  var imageObj = new Image()
  imageObj.src = src

  let shape = new Konva.Image(everyShapeAttrs())

  shape.props = {
    ...everyShapeProps(),

    kind: shapeKinds.Image,
    image: imageObj,
    opacity: 1,

    ...basicShape(0, 0, 100, 100, 0),
    ...options,
  }

  shape.setters = {}
  applyDefaultSetters(shape, shape.setters, [
    "x",
    "y",
    "width",
    "height",
    "opacity",
    "rotation",
    "image",
    "draggable",
  ])

  imageObj.onerror = () => {
    shape.fill('#aa3333')
  }
  imageObj.onload = () => {
    updateShape(shape, {
      width: imageObj.naturalWidth,
      height: imageObj.naturalHeight,
    }, true)
  }

  applyPropsToShape(shape.props, shape.setters)
  addCommonEvents(shape)

  return shape
}
