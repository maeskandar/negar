import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { shapeKinds } from './'

export function newLine(points) {
  return {
    id: v1(),
    kind: shapeKinds.Line,
    points,
    stroke: 'red',
    strokeWidth: 11,
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
        draggable = {isSelected}
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const
            node = shapeRef.current,
            scaleX = node.scaleX(),
            scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            points: shapeProps.points.map((p, i) => p * (i % 2 === 0 ? scaleX : scaleY)),
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}