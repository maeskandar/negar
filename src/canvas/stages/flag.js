import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents,
  commonShapeProps, closedShapeProps, basicCoordinate, basicSize
} from "../abstract"

import { oddIndexes, evenIndexes, apply2DScale } from '../../utils/array'
import { minMaxDistance, validDeg } from '../../utils/math'
import { transformer } from "../manager"

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

      ...basicSize(ORIGIN_BASE_WIDTH, ORIGIN_BASE_HEIGHT), // custom property
      fill: Konva.Util.getRandomColor(),

      points: BASE_ORIGIN_POINTS,
      lineCap: 'round',
      lineJoin: 'round',
      closed: true,
    }),

    flag = new Konva.Line({
      isMain: false,
      ...basicSize(ORIGIN_FLAG_WIDTH, ORIGIN_FLAG_HEIGHT), // custom property

      fill: Konva.Util.getRandomColor(),
      points: FLAG_ORIGIN_POINTS,
      lineCap: 'round',
      lineJoin: 'round',
      closed: true,
    }),

    group = new Konva.Group({
      ...commonShapeProps(),
      kind: shapeKinds.Flag,
      x: 0,
      y: 0,
      width: ORIGIN_FLAG_WIDTH + ORIGIN_BASE_WIDTH,
      height: ORIGIN_BASE_HEIGHT,
      rotation: 0,
      opacity: 1,

      flagFill: flag.attrs.fill,
      baseFill: base.attrs.fill,
    })

  group.shapes = {
    'flag': flag,
    'base': base
  }


  function scaleGroup(sx, sy) {
    group.shapes['flag'].points(apply2DScale(group.shapes['flag'].points(), sx, sy))
    group.shapes['base'].points(apply2DScale(group.shapes['base'].points(), sx, sy))
    transformer.forceUpdate() // https://konvajs.org/docs/select_and_transform/Force_Update.html
  }

  addCommonEvents(group, () => {
    let
      sx = group.scaleX(),
      sy = group.scaleY()

    group.scaleX(1)
    group.scaleY(1)

    scaleGroup(sx, sy)

    group.attrs.width *= sx
    group.attrs.height *= sy

    group.attrs.rotation = validDeg(group.rotation())
  })

  group.setters = {
    width: (w) => {
      scaleGroup(w / group.attrs.width, 1)
    },
    height: (h) => {
      scaleGroup(1, h / group.attrs.height)
    }
  }

  group.add(flag, base)
  return group
}