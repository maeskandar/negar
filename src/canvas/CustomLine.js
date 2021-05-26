import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH } from '.'

import { minMaxDistance } from "../utils/math"
import { oddIndexes, evenIndexes, apply2DScale } from "../utils/array"

export function newCustomLine(points) {
  let
    originPoints = [0, 0,
      ...points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))],

    originWidth = minMaxDistance(evenIndexes(originPoints)),
    originHeight = minMaxDistance(oddIndexes(originPoints))

  return {
    id: v1(),
    kind: shapeKinds.CustomLine,

    originPoints, originWidth, originHeight, // keep the original values to apply tranformation correctly
    points: originPoints,
    x: points[0],
    y: points[1],

    width: originWidth,
    height: originHeight,
    opacity: 1,

    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: Konva.Util.getRandomColor(),
    lineCap: 'round',
    lineJoin: 'round',
  }
}
export function CustomLine({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  shapeProps.points = apply2DScale(shapeProps.originPoints,
    shapeProps.width / shapeProps.originWidth,
    shapeProps.height / shapeProps.originHeight)

  return (
    <>
      <Line
        ref={shapeRef}

        onClick={onSelect}
        {...shapeProps}

        draggable={isSelected}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={e => {
          let
            node = shapeRef.current,
            sx = node.scaleX(),
            sy = node.scaleY()
          // ro = node.getAbsoluteRotation()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            points: shapeProps.points.map((p, i) => p * (i % 2 === 0 ? sx : sy)),
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}