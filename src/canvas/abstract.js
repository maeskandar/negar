import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "./"
import { updateShape, transformer } from "./manager"
import { validDeg } from "../utils/math"

// common shape events --------------------------
export function resetTransformGen(shape, customFunc) {
  if (customFunc) {
    return () => {
      if (customFunc()) transformer.forceUpdate()
      updateShape(shape)
    }
  }
  else {
    return () => {
      let rotation = shape.getAbsoluteRotation()

      updateShape(shape, {
        width: shape.props.width * shape.scaleX(),
        height: shape.props.height * shape.scaleY(),
        rotation: validDeg(rotation),
      })
      
      shape.scaleX(1)
      shape.scaleY(1)
    }
  }
}
export function onDragEndGen(shape, fn) {
  if (fn) 
    return fn

  return () => {
    updateShape(shape, {
      x: shape.x(),
      y: shape.y(),
    }, true)
  }
}
export function addCommonEvents(shape, ...customFns) {
  shape.on('transformend', resetTransformGen(shape, customFns[0]))
  shape.on('dragend', onDragEndGen(shape, customFns[1]))
}

export function applyDefaultSetters(shape, setters, defaultSetters) {
  for (let ds of defaultSetters) {
    if (Array.isArray(ds))
      setters[ds[0]] = (...param) => shape[ds[1]](...param)
    else
      setters[ds] = (...param) => shape[ds](...param)
  }
}

export function applyPropsToShape(props, setters) {
  for (let key in props) {
    if (key in setters)
      setters[key](props[key])
  }
}

// common shape props --------------------------
export function everyShapeProps() {
  return {
    id: v1(),
  }
}
export function everyShapeAttrs() {
  return {
    draggable: false
  }
}
export function closedShapeProps() {
  return {
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
  }
}
export function basicShape(x, y, w, h, rotation = 0) {
  return {
    x, y,
    width: w,
    height: h,
    rotation,
  }
}
export function closedLine(points) {
  return {
    points,
    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
  }
}