import Konva from 'konva'
import {DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH, shapeKinds} from '../'
import {
    addCommonEvents,
    everyShapeProps,
    basicShape,
    applyPropsToShape,
    everyShapeAttrs,
    applyDefaultSetters,
    closedShapeProps
} from '../abstract'
import {validDeg} from "../../utils/math";
import {updateShape} from "../manager";

export function newCustomShapeNode(options, isMain = true) {
    let shape = new Konva.Shape({
        ...everyShapeAttrs(),
        ...closedShapeProps(),
        ...everyShapeProps(),
        x: 100,
        y: 230,
        fill: '#00D2FF',
        width: 100,
        height: 50,
        sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(20, 50);
            context.lineTo(220, 80);
            context.quadraticCurveTo(150, 100, 260, 170);
            context.closePath();

            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
        },
        // ...options
    })

    shape.props = {
        ...everyShapeProps(),
        x: 100,
        y: 230,
        fill: '#00D2FF',
        width: 100,
        height: 50,
        sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(20, 50);
            context.lineTo(220, 80);
            context.quadraticCurveTo(150, 100, 260, 170);
            context.closePath();

            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
        },
        // borderColor: DEFAULT_STROKE_COLOR,
        // borderSize: DEFAULT_STROKE_WIDTH,
        // opacity: 1,

        ...options
    }

    shape.setters = {}

    applyDefaultSetters(shape, shape.setters, [
        "fill",
        "opacity",
        "rotation",
        "draggable",
        ["borderColor", "stroke"],
        ["borderSize", "strokeWidth"],
    ])

    addCommonEvents(shape)
    applyPropsToShape(shape.props, shape.setters)

    return shape
}