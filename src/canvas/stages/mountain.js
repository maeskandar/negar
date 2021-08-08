import Konva from "konva"

import { shapeKinds, DEFAULT_STROKE_WIDTH } from '..'
import { everyShapeProps, addCommonEvents } from '../abstract'

import { minMaxDistance, validDeg } from "../../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../../utils/array"

const
  DEFAULT_HYPES = [
    [0, 0],
    [1, 2],
    [2, 1],
    [3, 4],
    [4, 0]
  ],

  ORIGIN_WIDTH = 200,
  ORIGIN_HEIGHT = 200

function genPoints(hypes, w, h) {
  let
    mxHypeHeight = Math.max(...hypes.map(p => p[1])),
    mxHypeWidth = Math.max(...hypes.map(p => p[0]))

  return hypes.map(p => [p[0] / mxHypeWidth * w, -p[1] / mxHypeHeight * h]).flat()
}

export function newMountain() {
  let shape = new Konva.Line({
    kind: shapeKinds.Mountain,
    ...everyShapeProps(),

    hypes: DEFAULT_HYPES,
    points: genPoints(DEFAULT_HYPES, ORIGIN_WIDTH, ORIGIN_HEIGHT),
    x: ORIGIN_WIDTH,
    y: ORIGIN_HEIGHT,

    width: ORIGIN_WIDTH,
    height: ORIGIN_HEIGHT,
    rotation: 0,

    // fill: Konva.Util.getRandomColor(),
    // stroke: Konva.Util.getRandomColor(),
    fill: "#171037",
    stroke: "#46DCC3",
    strokeWidth: DEFAULT_STROKE_WIDTH,
    opacity: 1,

    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
  })

  // TODO we can add little bit more abstraction by the way
  addCommonEvents(shape, () => {
    let
      sx = shape.scaleX(),
      sy = shape.scaleY()

    shape.scaleX(1)
    shape.scaleY(1)

    let newPoints = apply2DScale(shape.attrs.points, sx, sy)

    shape.attrs.width *= sx
    shape.attrs.height *= sy
    shape.points(newPoints)
    shape.attrs.rotation = validDeg(shape.rotation())
  })


  shape.setters = {
    width: (w) => {
      let newp = apply2DScale(shape.attrs.points, w / shape.attrs.width, 1)
      shape.points(newp)
    },
    height: (h) => {
      let newp = apply2DScale(shape.attrs.points, 1, h / shape.attrs.height)
      shape.points(newp)
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

  return shape
}