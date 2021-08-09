import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '..'
import { everyShapeProps, addCommonEvents, closedLine, everyShapeAttrs } from '../abstract'

import { validDeg } from "../../utils/math"
import { apply2DScale } from "../../utils/array"

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

export function newMountain(options = { x: 0, y: 0, width: 200, height: 200, rotation: 0}) {
  let shape = new Konva.Line({
    x: options.x,
    y: options.y,

    rotation: 0,
    fill: "#171037",
    stroke: "#46DCC3",
    strokeWidth: DEFAULT_STROKE_WIDTH,

    ...closedLine(),
    ...everyShapeAttrs(),
  })


  shape.props = {
    kind: shapeKinds.Mountain,
    hypes: DEFAULT_HYPES,
    
    x: shape.attrs.x,
    y: shape.attrs.y,
    width: options.width,
    height: options.height,
    rotation: 0, 
    
    fill: shape.attrs.fill,
    borderColor: shape.attrs.stroke,
    borderSize: shape.attrs.strokeWidth,

    ...options
  }

  shape.points(genPoints(DEFAULT_HYPES, shape.props.width, shape.props.height))

  function applyScale(sx, sy) {
    shape.points(apply2DScale(shape.points(), sx, sy))
  }


  shape.setters = {
    width: (w) => {
      applyScale(w / shape.attrs.width, 1)
    },
    height: (h) => {
      applyScale(1, h / shape.attrs.height)
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
    fill: shape.fill
  }

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())
    shape.props.width *= shape.scaleX()
    shape.props.height *= shape.scaleY()
    shape.scaleX(1)
    shape.scaleY(1)
    shape.props.rotation = validDeg(shape.rotation())
  })

  return shape
}