import Konva from "konva"

const convasWrapperID = "container"

export var
    board = {},
    mainLayer = null,
    bgLayer = null,
    data = {}


export function initCanvas() {
    let wrapper = document.getElementById(convasWrapperID)

    board = new Konva.Stage({
        container: convasWrapperID,
        width: window.innerWidth,
        height: window.innerHeight
    })

    mainLayer = new Konva.Layer()
    bgLayer = new Konva.Layer()

    board.add(bgLayer, mainLayer)
}

export function drawSample() {
    var circle = new Konva.Circle({
        x: board.width() / 2,
        y: board.height() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    })

    // add the shape to the layer
    mainLayer.add(circle)
    mainLayer.draw()
}

window.addEventListener('canvas', e => {
    let
        type = e.detail.type,
        shape = e.detail.shape,
        id = shape.attrs.id

    if (type === "create") {
        board[id] = shape
        mainLayer.add(shape)
    }
    else if (type === "update") {
    }
    else if (type === "delete") {
        board[id].destroy()
        delete board[id]
    }
    else throw new Error(`undefined canvas event '${type}'`)

    mainLayer.draw()
})

function triggerCanvas(eventType, shapeObject) {
    let e = new CustomEvent('canvas',{detail: {
        type: eventType,
        shape: shapeObject
    }})
    window.dispatchEvent(e)
}

export function addShape(shapeObject) {
    triggerCanvas('create', shapeObject)
}
export function updateShape(shapeObject) {
    triggerCanvas('update', shapeObject)
}
export function removeShape(shapeObject) {
    triggerCanvas('delete', shapeObject)
}