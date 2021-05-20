import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds } from './'

export function newLine(points, customLine = false) {
  return {
    id: v1(),
    kind: customLine ? shapeKinds.CustomLine : shapeKinds.Line,

    points: [0, 0].concat(points.slice(2).map((p, i) => p - (i % 2 === 0 ? points[0] : points[1]))),
    x: points[0],
    y: points[1],

    strokeWidth: 4,
    stroke: Konva.Util.getRandomColor(),
    lineCap: 'round',
    lineJoin: 'round',
  }
}
export function MyLine({ shapeProps, isSelected, onSelect, onChange }) {
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
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={e => {
          let
            dx = e.target.x(),
            dy = e.target.y()

          onChange({
            ...shapeProps,
            x: dx,
            y: dy
          })
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          let
            node = shapeRef.current,
            sx = node.scaleX(),
            sy = node.scaleY()
          // ro = node.getAbsoluteRotation()

          onChange({
            ...shapeProps,
            points: shapeProps.points.map((p, i) =>
              p * (i % 2 === 0 ? sx : sy)),
          })

          node.scaleX(1)
          node.scaleY(1)
        }}
      />
      {isSelected &&
        <Transformer
          ref={trRef} />}
    </>
  )
}