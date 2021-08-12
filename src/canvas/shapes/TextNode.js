import Konva from 'konva'
import { shapeKinds } from '../'
import { addCommonEvents, everyShapeProps, basicShape, applyPropsToShape, everyShapeAttrs, applyDefaultSetters } from '../abstract'

export function newTextNode(options = {}) {
  let shape = new Konva.Text({ ...everyShapeAttrs() })

  shape.props = {
    ...everyShapeProps(),
    kind: shapeKinds.Text,

    text: "salam",
    fontSize: 30,
    fontFamily: "Shabnam",
    lineHeight: 1,
    align: 'right',

    ...basicShape(20, 20, 200, 100, 0),
    fill: Konva.Util.getRandomColor(),

    ...options,
  }

  shape.setters = {}
  applyDefaultSetters(shape, shape.setters, [
    "x",
    "y",
    "width",
    "height",
    "text",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "align",
    "fill",
    "rotation",
    "draggable"
  ])

  addCommonEvents(shape)
  applyPropsToShape(shape.props, shape.setters)

return shape
}