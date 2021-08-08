import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents,
  everyShapeProps, basicShape, closedLine
} from "../abstract"

import { oddIndexes, evenIndexes, apply2DScale } from '../../utils/array'
import { minMaxDistance, validDeg } from '../../utils/math'

const
  BASE_ORIGIN_POINTS = [
    [20, 0],
    [0, 0],
    [0, 200],
    [20, 200],
  ].map(p => [p[0], p[1]]).flat(), // to make coordiantes from (0, 0)

  FLAG_ORIGIN_POINTS = [
    [20, 0],
    [300, 0],
    [250, 50],
    [300, 100],
    [20, 100],
  ].map(p => [p[0], p[1]]).flat(), // to make coordiantes from (0, 0)

  ORIGIN_FLAG_WIDTH = minMaxDistance(evenIndexes(FLAG_ORIGIN_POINTS)),
  ORIGIN_FLAG_HEIGHT = minMaxDistance(oddIndexes(FLAG_ORIGIN_POINTS)),

  ORIGIN_BASE_WIDTH = minMaxDistance(evenIndexes(BASE_ORIGIN_POINTS)),
  ORIGIN_BASE_HEIGHT = minMaxDistance(oddIndexes(BASE_ORIGIN_POINTS))

export function newFlag() {
  let
    base = new Konva.Line({
      isMain: false,
      fill: Konva.Util.getRandomColor(),
      ...basicShape(0, 0, ORIGIN_BASE_WIDTH, ORIGIN_BASE_HEIGHT, 0),
      ...closedLine(BASE_ORIGIN_POINTS),
    }),

    flag = new Konva.Line({
      isMain: false,
      fill: Konva.Util.getRandomColor(),
      ...basicShape(0, 0, ORIGIN_FLAG_WIDTH, ORIGIN_FLAG_HEIGHT, 0), // custom property
      ...closedLine(FLAG_ORIGIN_POINTS)
    }),

    group = new Konva.Group({
      kind: shapeKinds.Flag,
      flagFill: flag.attrs.fill,
      baseFill: base.attrs.fill,
      ...everyShapeProps(),
      ...basicShape(0, 0, ORIGIN_FLAG_WIDTH + ORIGIN_BASE_WIDTH, ORIGIN_BASE_HEIGHT, 0),
    })

  group.shapes = {
    'flag': flag,
    'base': base
  }

  function scaleGroup(sx, sy) {
    group.shapes['flag'].points(apply2DScale(group.shapes['flag'].points(), sx, sy))
    group.shapes['base'].points(apply2DScale(group.shapes['base'].points(), sx, sy))
  }

  addCommonEvents(group, (tr) => {
    scaleGroup(group.scaleX(), group.scaleY())

    group.attrs.width *= group.scaleX()
    group.attrs.height *= group.scaleY()

    group.scaleX(1)
    group.scaleY(1)
    group.attrs.rotation = validDeg(group.rotation())
    tr.forceUpdate() // https://konvajs.org/docs/select_and_transform/Force_Update.html
  })

  group.setters = {
    width: (w) => scaleGroup(w / group.attrs.width, 1),
    height: (h) => scaleGroup(1, h / group.attrs.height),
  }

  group.add(flag, base)
  return group
}