import React from "react"
import { Image, Transformer } from "react-konva"
import useImage from "use-image"
import v1 from 'uuid/dist/v1'

import { shapeKinds, onDragEndCommon } from './'

export function newImage(content) {
  return {
    id: v1(),
    kind: shapeKinds.Image,
    content,
    opacity: 1,
    x: 100,
    y: 100,
    width: 300,
    height: 300,
  }
}

export function MyImage({ shapeProps, isSelected, onSelect, onChange, imageUrl }) {
  const
    shapeRef = React.useRef(),
    trRef = React.useRef(),
    [image] = useImage(imageUrl)

  React.useEffect(() => {
    if (isSelected) { // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current)
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  // set for the first time
  if (shapeProps.width == null && image) {
    shapeProps.width = image.width
    shapeProps.height = image.height
  }

  return (
    <>
      <Image
        ref={shapeRef}
        
        onClick={onSelect}
        image={image}
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
            width: node.width() * sx,
            height: node.height() * sy,
          })
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}