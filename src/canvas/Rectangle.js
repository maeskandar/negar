import React from "react"
import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newRectangle({x, y, onSelect}) {
  let shape = new Konva.Rect({
    id: v1(),
    kind: shapeKinds.Reactangle,
    
    x, y,
    width: 100,
    height: 100,
    rotation: 0,
    
    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    
    strokeWidth: DEFAULT_STROKE_WIDTH,

    isSelected: false,
  })

  shape.on('click', e => {
    console.log("yyyyyyyyyyyyyyyyyyyyaayaya")
  })

  return shape
}

// function Rectangle({ shapeProps, isSelected, onSelect, onChange }) {
//   return (
//     <>
//       <Rect
//         {...shapeProps}

//         offsetX={shapeProps.width / 2}
//         offsetY={shapeProps.height / 2}
//         draggable={isSelected}

//         onClick={onSelect}
//         onDragEnd={onDragEndCommon(shapeProps, onChange)}
//         onTransformEnd={resetTransform(shapeRef, (ev, scale, rotation) => {
//           onChange({
//             ...shapeProps,
//             rotation: rotation,
//             width: shapeProps.width * scale.x,
//             height: shapeProps.height * scale.y,
//           })
//         })}
//       />
//       {isSelected && <Transformer ref={trRef} />}
//     </>
//   )
// }