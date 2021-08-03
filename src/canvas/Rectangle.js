import Konva from "konva"
import v1 from 'uuid/dist/v1'

import { resetTransform, onDragEndCommon, shapeKinds, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_COLOR } from './'

export function newRectangle() {
  let shape = new Konva.Rect({
    id: v1(),
    kind: shapeKinds.Reactangle,

    x: 50,
    y: 50,
    width: 100,
    height: 100,
    rotation: 0,

    opacity: 1,
    fill: Konva.Util.getRandomColor(),
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,

    draggable: false, // TODO add default abstract shape and spread it in every object [ on top ]
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