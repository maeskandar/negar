import Konva from "konva"

import { DEFAULT_STROKE_WIDTH, shapeKinds } from '..'
import {
  addCommonEvents, applyPropsToShape,
  everyShapeProps, everyShapeAttrs, applyDefaultSetters
} from "../abstract"

import { newCircle, newRectangle } from "../shapes"

export function newStage(options = {}) {
  let group = new Konva.Group({ ...everyShapeAttrs() })
  group.props = {
    ...everyShapeProps(),
    kind: shapeKinds.EmptyStage,

    x: 0,
    y: 0,
    width: 100,
    height: 100,

    rotation: 0,
    borderSize: DEFAULT_STROKE_WIDTH,
    borderColor: "#21C0AD",

    ...options,
  }

  let overly = newRectangle({
    fill: 'transparent',
    dash: [20, 20],
  }, false)

  group.parts = { overly }
  group.setters = {
    width: w => overly.setters.width(w),
    height: h => overly.setters.height(h),
  }
  applyDefaultSetters(overly, group.setters, [
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
  ])
  applyDefaultSetters(group, group.setters, [
    'x', 'y',
    'draggable',
    'rotation',
  ])

  addCommonEvents(group)
  applyPropsToShape(group.props, group.setters)

  group.add(overly)
  return group
}