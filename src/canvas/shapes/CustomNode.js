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

export function newCustomShapeNode(options = {}, isMain = true) {
    let shape = new Konva.Line({
        ...everyShapeAttrs(),
        ...closedShapeProps(),
        ...everyShapeProps(),
        x: 100,
        y: 230,
        fill: '#00D2FF',
        closed : true,
        stroke : "black",
        ...options
    })

    shape.props = {
        ...everyShapeProps(),
        x: 100,
        y: 230,
        fill: '#00D2FF',
        closed : true,
        stroke : "black",

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