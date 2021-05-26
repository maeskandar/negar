import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR, onDragEndCommon } from './'
import { oddIndexes, evenIndexes } from '../utils/array'
import { minMaxDistance } from '../utils/math'

const
  ORIGIN_POINTS = [
    0, 0,
    50, 50,
    50, 20,
    150, 20,
    150, -20,
    50, -20,
    50, -50,
  ],
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

    fill: Konva.Util.getRandomColor(),
    opacity: 1,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE_COLOR,
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

  shapeProps.points = ORIGIN_POINTS.map((p, i) =>
    p * (i % 2 === 0 ? shapeProps.width / ORIGIN_WIDTH : shapeProps.height / ORIGIN_HEIGHT))

  return (
    <>
      <Line
        ref={shapeRef}
        
        onClick={onSelect}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={e => {
          const
            node = shapeRef.current,
            sx = node.scaleX(),
            sy = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            width: shapeProps.width * sx,
            height: shapeProps.height * sy,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}