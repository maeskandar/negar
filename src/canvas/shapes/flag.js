import Konva from "konva"

import { shapeKinds } from '..'
import {
  addCommonEvents, applyPropsToShape,
  everyShapeProps, basicShape, closedLine, everyShapeAttrs, applyDefaultSetters
} from "../abstract"

import { oddIndexes, evenIndexes, apply2DScale } from '../../utils/array'
import {  minMaxDistance, pointsDistance, validDeg } from '../../utils/math'

import { newStage } from "../stage"

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

export function newFlag(options = {}) {
  let
    props = {
      ...everyShapeProps(),
      kind: `shapeKinds`.Flag,
      width: 100,
      height: 100,
      rotation: 0,
      flagFill: Konva.Util.getRandomColor(),
      baseFill: Konva.Util.getRandomColor(),

      ...options,
      x: 0,
      y: 0,
    },
    base = new Konva.Line({
      isMain: false,
      fill: props.baseFill,
      ...closedLine(apply2DScale(BASE_ORIGIN_POINTS,
        (props.width * BASE_WIDTH_RATIO) / ORIGIN_BASE_WIDTH,
        (props.height * BASE_HEIGHT_RATIO) / ORIGIN_BASE_HEIGHT,
      )),
      ...basicShape(0, 0, ORIGIN_BASE_WIDTH, ORIGIN_BASE_HEIGHT, 0),
    }),
    flag = new Konva.Line({
      isMain: false,
      fill: props.flagFill,
      ...closedLine(apply2DScale(FLAG_ORIGIN_POINTS,
        (props.width * FLAG_WIDTH_RATIO) / ORIGIN_FLAG_WIDTH,
        (props.height * FLAG_HEIGHT_RATIO) / ORIGIN_FLAG_HEIGHT,
      )),
      ...basicShape(0, 0, ORIGIN_FLAG_WIDTH, ORIGIN_FLAG_HEIGHT, 0),
    }),
    group = new Konva.Group({
      ...everyShapeAttrs(),
      kind: shapeKinds.Flag
    })

  group.props = props
  group.parts = {
    'flag': flag,
    'base': base
  }
  group.setters = {
    width: (w) => scaleGroup(w / group.props.width, 1),
    height: (h) => scaleGroup(1, h / group.props.height),
  }
  function scaleGroup(sx, sy) {
    for (let childName of ['flag', 'base'])
      group.parts[childName].points(
        apply2DScale(group.parts[childName].points(), sx, sy))
  }
  applyDefaultSetters(group, group.setters, [
    "x",
    "y",
    "rotation",
    "draggable",
  ])
  addCommonEvents(group, () => {
    scaleGroup(group.scaleX(), group.scaleY())

    group.props.width *= group.scaleX()
    group.props.height *= group.scaleY()

    group.scaleX(1)
    group.scaleY(1)
    group.props.rotation = validDeg(group.rotation())

    return true // rerender transformer
  })
  applyPropsToShape(group.props, group.setters)

  group.add(flag, base)
  return newStage(options, [group], {
    dragmove: () => {
      // TODO pass route
      let
        mypos = { x: group.parent.x(), y: group.parent.y() },
        currentStage = group.parent.parent // it's not current stage always ...

      if (currentStage.mainNode && currentStage.mainNode.props.kind === shapeKinds.Mountain) {
        let
          mountainPos = { x: currentStage.mainNode.props.x, y: currentStage.mainNode.props.y },
          mountainHypesPos = currentStage.mainNode.cached.hypesPos

        for (let p of mountainHypesPos) {
          p = {
            x: p[0] + mountainPos.x,
            y: p[1] + mountainPos.y - group.props.height
          }
          if (pointsDistance(p, mypos) < 30) {
            group.parent.setters.position(p)
            group.parent.props.x = p.x
            group.parent.props.y = p.y
            break
          }
        }
      }
    },
  })
}