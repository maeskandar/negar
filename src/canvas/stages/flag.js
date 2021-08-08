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
  ].flat(),

  FLAG_ORIGIN_POINTS = [
    [20, 0],
    [300, 0],
    [250, 50],
    [300, 100],
    [20, 100],
  ].flat(),

  ORIGIN_FLAG_WIDTH = minMaxDistance(evenIndexes(FLAG_ORIGIN_POINTS)),
  ORIGIN_FLAG_HEIGHT = minMaxDistance(oddIndexes(FLAG_ORIGIN_POINTS)),

  ORIGIN_BASE_WIDTH = minMaxDistance(evenIndexes(BASE_ORIGIN_POINTS)),
  ORIGIN_BASE_HEIGHT = minMaxDistance(oddIndexes(BASE_ORIGIN_POINTS)),

  ORIGIN_GROUP_WIDTH = ORIGIN_FLAG_WIDTH + ORIGIN_BASE_WIDTH,
  ORIGIN_GROUP_HEIGHT = ORIGIN_BASE_HEIGHT,

  FLAG_WIDTH_RATIO = ORIGIN_FLAG_WIDTH / ORIGIN_GROUP_WIDTH,
  FLAG_HEIGHT_RATIO = ORIGIN_FLAG_HEIGHT / ORIGIN_GROUP_HEIGHT,
  BASE_WIDTH_RATIO = 1 - FLAG_WIDTH_RATIO,
  BASE_HEIGHT_RATIO = 1

export function newFlag(options = { x: 0, y: 0, width: 200, height: 200, rotation: 0 }) {
  let
    base = new Konva.Line({
      isMain: false,
      fill: Konva.Util.getRandomColor(),
      ...closedLine(apply2DScale(BASE_ORIGIN_POINTS,
        (options.width * BASE_WIDTH_RATIO) / ORIGIN_BASE_WIDTH,
        (options.height * BASE_HEIGHT_RATIO) / ORIGIN_BASE_HEIGHT,
      )),
      ...basicShape(0, 0, ORIGIN_BASE_WIDTH, ORIGIN_BASE_HEIGHT, 0),
    }),

    flag = new Konva.Line({
      isMain: false,
      fill: Konva.Util.getRandomColor(),
      ...closedLine(apply2DScale(FLAG_ORIGIN_POINTS,
        (options.width * FLAG_WIDTH_RATIO) / ORIGIN_FLAG_WIDTH,
        (options.height * FLAG_HEIGHT_RATIO) / ORIGIN_FLAG_HEIGHT,
      )),
      ...basicShape(0, 0, ORIGIN_FLAG_WIDTH, ORIGIN_FLAG_HEIGHT, 0), // custom property
    }),

    group = new Konva.Group({
      kind: shapeKinds.Flag,
      flagFill: flag.attrs.fill,
      baseFill: base.attrs.fill,
      ...everyShapeProps(),
      ...options
    })

  group.shapes = {
    'flag': flag,
    'base': base
  }

  function scaleGroup(sx, sy) {
    for (let childName of ['flag', 'base'])
      group.shapes[childName].points(apply2DScale(group.shapes[childName].points(), sx, sy))
  }

  addCommonEvents(group, () => {
    scaleGroup(group.scaleX(), group.scaleY())

    group.attrs.width *= group.scaleX()
    group.attrs.height *= group.scaleY()

    group.scaleX(1)
    group.scaleY(1)
    group.attrs.rotation = validDeg(group.rotation())
    return true // rerender transformer
  })

  group.setters = {
    width: (w) => scaleGroup(w / group.attrs.width, 1),
    height: (h) => scaleGroup(1, h / group.attrs.height),
  }

  group.add(flag, base)
  return group
}