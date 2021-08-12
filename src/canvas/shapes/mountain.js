import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from '..'
import { everyShapeProps, addCommonEvents, closedLine, everyShapeAttrs, applyPropsToShape, applyDefaultSetters } from '../abstract'

import { validDeg } from "../../utils/math"
import { apply2DScale } from "../../utils/array"
import { newStage } from "../stage"

const
  DEFAULT_HYPES = [
    [0, 0],
    [1, 2],
    [2, 1],
    [3, 4],
    [4, 0]
  ]

function genPoints(hypes, w, h) {
  let
    mxHypeHeight = Math.max(...hypes.map(p => p[1])),
    mxHypeWidth = Math.max(...hypes.map(p => p[0]))

  return hypes.map(p => [p[0] / mxHypeWidth * w, (-p[1] / mxHypeHeight * h) + h]).flat()
}

export function newMountain(options = {}) {
  let shape = new Konva.Line({
    ...closedLine(),
    ...everyShapeAttrs(),
  })
  
  shape.props = {
    ...everyShapeProps(),
    kind: shapeKinds.Mountain,
    hypes: DEFAULT_HYPES,
    
    width: 100,
    height: 100,
    rotation: 0, 
    
    fill: Konva.Util.getRandomColor(),
    borderColor: DEFAULT_STROKE_COLOR,
    borderSize: DEFAULT_STROKE_WIDTH,

    ...options,

    x: 0,
    y: 0,
  }

  function applyScale(sx, sy) {
    shape.points(apply2DScale(shape.points(), sx, sy))
  }

  shape.setters = {
    width: (w) => {
      applyScale(w / shape.props.width, 1)
    },
    height: (h) => {
      applyScale(1, h / shape.props.height)
    },
    hypes: (hs) => {
      shape.props.hypes = hs
      shape.points(genPoints(hs, shape.props.width, shape.props.height))
    },
    addHype: (p) => {
      if (p === null) // add to the end
        p = [Math.max(...shape.props.hypes.map(h => h[0])) + 1, 0]

      shape.setters.hypes(shape.props.hypes.concat([p]))
    },
  }

  applyDefaultSetters(shape, shape.setters, [
    "x",
    "y",
    "fill",
    "rotation",
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
    "draggable",
  ])

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())
    shape.props.width *= shape.scaleX()
    shape.props.height *= shape.scaleY()
    shape.scaleX(1)
    shape.scaleY(1)
    shape.props.rotation = validDeg(shape.rotation())
  })

  applyPropsToShape(shape.props, shape.setters)

  return newStage(options, [shape])
}