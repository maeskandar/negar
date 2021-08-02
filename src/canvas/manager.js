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
        width: wrapper.clientWidth,
        height: wrapper.clientHeight
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
        type = e.type,
        shape = e.shape,
        id = shape.id

    if (type == "create"){
        board[id] = shape
        mainLayer.add(shape)
    }
    else if (type == "update"){
    }
    else if(type == "delete"){
        board[id].destroy()
        delete board[id]
    }
    else throw new Error(`undefined canvas event '${type}'`)

    mainLayer.draw()
})

export function triggerCanvas(eventName, shapeObject) {
    let e = new Event(eventName)
    e.shape = shapeObject
    window.dispatchEvent(e)
}

export function addShape(
    shapeObj,
    onClick,
    onMove,
) {
    
}
export function updateShape() {
}
export function removeShape() {
}