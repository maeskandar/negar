import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH } from './'

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
    x: points[0] + originWidth / 2,  // to fill offset
    y: points[1] + originHeight / 2, // to fill offset
    points: originPoints,

    width: originWidth,
    height: originHeight,
    rotation: 0,
    
    opacity: 1,
    stroke: Konva.Util.getRandomColor(),
    strokeWidth: DEFAULT_STROKE_WIDTH,
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