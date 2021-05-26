import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

import { oddIndexes, evenIndexes, apply2DScale } from '../utils/array'
import { minMaxDistance } from '../utils/math'

const
  ORIGIN_POINTS = [
    [0, 0],
    [50, 50],
    [50, 20],
    [150, 20],
    [150, -20],
    [50, -20],
    [50, -50],
  ].map(p2 => [p2[0], p2[1] + 50]).flat(), // to make coordiantes from (0, 0)
  
  ORIGIN_WIDTH = minMaxDistance(evenIndexes(ORIGIN_POINTS)),
  ORIGIN_HEIGHT = minMaxDistance(oddIndexes(ORIGIN_POINTS))

export function newArrow(x = 50, y = 50) {
  return {
    id: v1(),
    kind: shapeKinds.CustomShape,

    x, y,
    points: ORIGIN_POINTS,
    width: ORIGIN_WIDTH,   // cutsom porperty
    height: ORIGIN_HEIGHT, // cutsom porperty
    rotation: 0,

    fill: Konva.Util.getRandomColor(),
    opacity: 1,
    stroke: DEFAULT_STROKE_COLOR,
    
    strokeWidth: DEFAULT_STROKE_WIDTH,
    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
  }
}

export function Arrow({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  shapeProps.points = apply2DScale(ORIGIN_POINTS,
    shapeProps.width / ORIGIN_WIDTH,
    shapeProps.height / ORIGIN_HEIGHT)


  return (
    <>
      <Line
        ref={shapeRef}
        {...shapeProps}

        offsetX={shapeProps.width / 2}
        offsetY={shapeProps.height / 2}
        draggable={isSelected}

        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
          onChange({
            ...shapeProps,
            rotation,
            width: shapeProps.width * scale.x,
            height: shapeProps.height * scale.y,
          })
        })}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}