import Konva from "konva"

var 
    stage = null,
    mainLayer = null,
    bgLayer = null,
    data = {}

export function initCanvas() {
    stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 600,
        height: 600
    })

    // then create layer
    mainLayer = new Konva.Layer()

    // add the layer to the stage
    stage.add(mainLayer)

    // draw the image
    mainLayer.draw()
}

export function drawSample(){
    // create our shape
    var circle = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    })

    // add the shape to the layer
    mainLayer.add(circle)
    mainLayer.draw()
}

// window.addEventListener('canvas-update')

export function addShape(
    shapeObj,
    onclick,
    onMove,
) {
}
export function updateShape() {
}
export function removeShape() {
}