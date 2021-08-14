import Konva from "konva"
import { newRectangle } from "./shapes"

const canvasWrapperID = "container"

export var
    board = null,
    bgLayer = null,
    bgShape = null,
    mainLayer = null,
    transformer = null,
    shapes = {},
    drawingLayer = null,
    tempShapes = [],
    cameraPosition = { x: 0, y: 0 }

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

    transformer = new Konva.Transformer({
        nodes: [],
        rotationSnaps: [0, 90, 180, 270],
    })
    transformer.hide()

    let root = new Konva.Group({})
    root.props = { id: 'root' }
    root.nodes = []

    shapes = { root }

    mainLayer.add(transformer, root)
    board.add(bgLayer, mainLayer, drawingLayer)

    board.on('click', onClick)
    board.on('mousedown', onMouseDown)
    board.on('mousemove', onMouseMove)
    board.on('mouseup', onMouseUp)
    board.on('contextmenu', e => e.evt.preventDefault())
}

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
export function addShapes(newShape, nodes, fatherId, trigger) {
    shapes[newShape.props.id] = newShape
    shapes[fatherId].nodes.push(newShape)
    shapes[fatherId].add(newShape)

    if (nodes)
        for (let n of nodes)
            shapes[n.props.id] = n

    if (trigger)
        triggerCanvas('create', newShape)
}
export function updateShape(shape, newProps, trigger = false) {
    for (let prop in newProps) {
        let val = newProps[prop]

        if (prop in shape.setters)
            shape.setters[prop](val)
        else
            throw new Error(`setter '${prop}' for shape kind '${shape.props.kind}' is not defined`)

        shape.props[prop] = val
    }

    if (trigger) triggerCanvas('update', shape)
}
export function removeShape(shape) {
    shape.destroy()
    mainLayer.draw()
    triggerCanvas('delete', shape)
    delete shapes[shape.props.id]
}

export function renderCanvas(currentPath, shapeid, relativeLevel = 0) {
    if (relativeLevel === 0) { }
    else {
        if (relativeLevel > 0) {
            let
                relativeRoot = (currentPath.length === 0) ?
                    shapes['root'] :
                    shapes[currentPath[currentPath.length - 1]],
                targetStage = shapes[shapeid]

            for (let n of relativeRoot.nodes)
                n.visible(false)

            targetStage.visible(true)
            targetStage.parts["overly"].listening(false)
        }
        else { // relativeLevel < 0
            let
                relativeRoot = currentPath.length === 1 ?
                    shapes['root'] :
                    shapes[currentPath[currentPath.length - 2]],
                stage = shapes[currentPath[currentPath.length - 1]]

            stage.parts["overly"].listening(true)

            for (let n of relativeRoot.nodes)
                n.visible(true)
        }
    }
}

window.addEventListener('canvas', e => {
    let
        type = e.detail.type,
        shape = e.detail.shape

    if (type === "create") {
        // mainLayer.add(shape)
        mainLayer.draw()
    }
    else if (type === "update") {
    }
    else if (type === "delete") {
    }
    else
        throw new Error(`undefined canvas event '${type}'`)
})
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
    bgShape.listening(false)

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
    let shape = newRectangle({
        width: board.width(),
        height: board.height(),
        fill: color,
        borderSize: 0
    })
    shape.listening(false)
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
    for (let n of transformer.nodes())
        n.setters.draggable(false)

    transformer.nodes([])
    transformer.hide()
}
