import Konva from "konva"
import React, { useEffect } from "react"
import { Line, Transformer } from "react-konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH } from './'
import { apply2DScale } from '../utils/array'

export function newStraghtLine(points) {
  let
    deltax = points[2] - points[0],
    deltay = points[3] - points[1]

  return {
    id: v1(),
    kind: shapeKinds.StraghtLine,

    x: points[0] + deltax / 2,
    y: points[1] + deltay / 2,
    points: [0, 0, deltax, deltay],
    rotation: 0,

    opacity: 1,
    stroke: Konva.Util.getRandomColor(),

    strokeWidth: DEFAULT_STROKE_WIDTH,
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
        {...shapeProps}

        offsetX={shapeProps.points[2] / 2}
        offsetY={shapeProps.points[3] / 2}
        draggable={isSelected}

        onClick={onSelect}
        onDragEnd={onDragEndCommon(shapeProps, onChange)}
        onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
          onChange({
            ...shapeProps,
            rotation,
            points: apply2DScale(shapeProps.points, scale.x, scale.y),
          })
        })}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}