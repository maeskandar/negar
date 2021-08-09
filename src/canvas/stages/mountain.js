import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '..'
import { everyShapeProps, addCommonEvents, closedLine } from '../abstract'

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

export function newMountain(options = { x: 0, y: 0, width: 200, height: 200 }) {
  let shape = new Konva.Line({
    kind: shapeKinds.Mountain,

    hypes: DEFAULT_HYPES,
    rotation: 0,

    fill: "#171037",
    stroke: "#46DCC3",
    strokeWidth: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    ...everyShapeProps(),
    ...closedLine(),
    ...options
  })


  shape.props = {
    
  }

  shape.points(genPoints(DEFAULT_HYPES, options.width, options.height))

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
      shape.attrs.hypes = hs
      shape.points(genPoints(hs, shape.attrs.width, shape.attrs.height))
    },
    addHype: (p) => {
      if (p === null) // add to the end
        p = [Math.max(...shape.attrs.hypes.map(h => h[0])) + 1, 0]

      shape.setters["hypes"](shape.attrs.hypes.concat([p]))
    }
  }

  addCommonEvents(shape, () => {
    applyScale(shape.scaleX(), shape.scaleY())
    shape.attrs.width *= shape.scaleX()
    shape.attrs.height *= shape.scaleY()
    shape.scaleX(1)
    shape.scaleY(1)
    shape.attrs.rotation = validDeg(shape.rotation())
  })

  return shape
}