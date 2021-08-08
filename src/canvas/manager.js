import Konva from "konva"
import { newRectangle } from "./shapes"

const canvasWrapperID = "container"

export var
    board = null,
    bgLayer = null,
    mainLayer = null,
    drawingLayer = null,
    transformer = null,
    shapes = {},
    tempShapes = [],
    bgShape = null

// primary functions
export function initCanvas({ onClick, onMouseDown, onMouseMove, onMouseUp }) {
    board = new Konva.Stage({
        container: canvasWrapperID,
        width: window.innerWidth,
        height: window.innerHeight
    })

    bgLayer = new Konva.Layer()
    mainLayer = new Konva.Layer()
    drawingLayer = new Konva.Layer()

    transformer = new Konva.Transformer()
    transformer.nodes([])
    transformer.hide()

    mainLayer.add(transformer)
    board.add(bgLayer, mainLayer, drawingLayer)

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

export function triggerShapeEvent(shape, event, ...data) {
    if (shape.events && event in shape.events)
        shape.events[event](...data)
}

export function addShape(shapeObject) {
    shapes[shapeObject.attrs.id] = shapeObject
    triggerCanvas('create', shapeObject)
}
export function updateShape(shape, newAttrs, mode) {
    for (let prop in newAttrs) {
        let val = newAttrs[prop]

        if ('setters' in shape && prop in shape.setters)
            shape.setters[prop](val, mode)
        else if (prop === 'width')
            shape.size({ width: val, height: shape.attrs.height })
        else if (prop === 'height')
            shape.size({ width: shape.attrs.width, height: val })
        else
            shape[prop](val)

        shape.attrs[prop] = val
    }


    triggerCanvas('update', shape)
}

export function removeShape(shape) {
    shape.destroy()
    mainLayer.draw()
    triggerCanvas('delete', shape)
    delete shapes[shape.attrs.id]
}

// other functions
export function prepareDrawingLayer() {
    bgShape = newRectangle({
        width: board.width(),
        height: board.height(),
        listening: false,
        fill: "#111",
        strokeWidth: 0,
        opacity: 0.7
    })

    drawingLayer.add(bgShape)
}

export function disableDrawingLayer() {
    for (let shape of drawingLayer.children)
        shape.remove()

    if (bgShape)
        bgShape.destroy()
}

export function addTempShape(shape) {
    tempShapes.push(shape)
    drawingLayer.add(shape)
}
export function removeTempShape(shape) {
    let i = tempShapes.findIndex(it => it === shape)
    tempShapes.splice(i, 1)
    shape.destroy()
    drawingLayer.draw()
}
export function resetTempPage(shapeList = []) {
    drawingLayer.destroyChildren()
    tempShapes = shapeList

    if (tempShapes.length) {
        for (let shape of tempShapes)
            drawingLayer.add(shape)

        drawingLayer.draw()
    }
}

export function setBackgroundColor(color) {
    let shape = newRectangle({ width: board.width(), height: board.height(), fill: color, strokeWidth: 0 })
    shape.listening(false) // disvale events
    bgLayer.destroyChildren()
    bgLayer.add(shape)
    bgLayer.draw()
}

export function activateTransformer(...shapes) {
    transformer.show()
    transformer.nodes(shapes)
    transformer.moveToTop()
}
export function disableTransformer() {
    transformer.nodes([])
    transformer.hide()
}