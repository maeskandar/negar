import Konva from "konva"

const canvasWrapperID = "container"

export var
    board = null,
    mainLayer = null,
    bgLayer = null,
    shapes = {}


export function initCanvas({onClick, onMouseDown, onMouseMove, onMouseUp}) {
    board = new Konva.Stage({
        container: canvasWrapperID,
        width: window.innerWidth,
        height: window.innerHeight
    })

    mainLayer = new Konva.Layer()
    bgLayer = new Konva.Layer()

    board.add(bgLayer, mainLayer)

    board.on('click', onClick)
    board.on('mousedown', onMouseDown)
    board.on('mousemove', onMouseMove)
    board.on('mouseup', onMouseUp)
}

window.addEventListener('canvas', e => {
    let
        type = e.detail.type,
        shape = e.detail.shape,
        id = shape.attrs.id

    if (type === "create") {
        mainLayer.add(shape)
    }
    else if (type === "update") {
    }
    else if (type === "delete") {
    }
    else throw new Error(`undefined canvas event '${type}'`)

    mainLayer.draw()
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
    shapes[shapeObject.id] = shapeObject
    triggerCanvas('create', shapeObject)
}
export function updateShape(shapeObject) {
    triggerCanvas('update', shapeObject)
}
export function removeShape(shapeObject) {
    delete shapes[shapeObject.id]
    triggerCanvas('delete', shapeObject)
}