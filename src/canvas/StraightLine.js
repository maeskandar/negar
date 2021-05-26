import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH } from '.'

export function newStraghtLine(points) {
  return {
    id: v1(),
    kind: shapeKinds.Line,

    x: points[0],
    y: points[1],
    points: [0, 0, points[2] - points[0], points[3] - points[1]],

    width: 100,
    height: 100,
    opacity: 1,

    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: Konva.Util.getRandomColor(),
    lineCap: 'round',
    lineJoin: 'round',
  }
}
export function StraghtLine({ shapeProps, isSelected, onSelect, onChange }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

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