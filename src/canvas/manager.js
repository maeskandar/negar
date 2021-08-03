import Konva from "konva"

const canvasWrapperID = "container"

export var
    board = null,
    mainLayer = null,
    bgLayer = null,
    shapes = {},
    transformer = null


export function initCanvas({ onClick, onMouseDown, onMouseMove, onMouseUp }) {
    board = new Konva.Stage({
        container: canvasWrapperID,
        width: window.innerWidth,
        height: window.innerHeight
    })

    mainLayer = new Konva.Layer()
    bgLayer = new Konva.Layer()

    transformer = new Konva.Transformer()
    transformer.nodes([])
    transformer.hide()

    mainLayer.add(transformer)
    board.add(bgLayer, mainLayer)

    board.on('click', onClick)
    board.on('mousedown', onMouseDown)
    board.on('mousemove', onMouseMove)
    board.on('mouseup', onMouseUp)
}

window.addEventListener('canvas', e => {
    let
        type = e.detail.type,
        shape = e.detail.shape

    if (type === "create") {
        mainLayer.add(shape)
        mainLayer.draw()
    }
    else if (type === "update") {
    }
    else if (type === "delete") {
        mainLayer.draw()
    }
    else
        throw new Error(`undefined canvas event '${type}'`)
})

function triggerCanvas(eventType, shapeObject) {
    let e = new CustomEvent('canvas', {
        detail: {
            type: eventType,
            shape: shapeObject
        }
    })
    window.dispatchEvent(e)
}

export function addShape(shapeObject) {
    shapes[shapeObject.attrs.id] = shapeObject
    triggerCanvas('create', shapeObject)
}
export function updateShape(shape, newAttrs) {
    for (let prop in newAttrs) {
        let val = newAttrs[prop]

        if (prop === 'width')
            shape.size({ width: val, height: shape.attrs.height })
        else if (prop === 'height')
            shape.size({ width: shape.attrs.width, height: val })
        else
            shape[prop](val)

        shape.attrs[prop] = val
    }


    triggerCanvas('update', shape)
}
export function removeShape(shapeObject) {
    delete shapes[shapeObject.attrs.id]
    triggerCanvas('delete', shapeObject)
}