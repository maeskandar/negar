import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"

import v1 from 'uuid/dist/v1'

export function newArrow() {
  return {
    points: [
      [0, 0],
      [50, 50],
      [50, 20],
      [150, 20],
      [150, -20],
      [50, -20],
      [50, -50],
    ].map(it => [it[0] + 50, it[1] + 50]).flat(),

    stroke: 'black',
    fill: '#00D2FF',
    strokeWidth: 6,
    lineCap: 'round',
    lineJoin: 'round',
    closed: true,
    id: v1()
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


  return (
    <>
      <Line
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
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