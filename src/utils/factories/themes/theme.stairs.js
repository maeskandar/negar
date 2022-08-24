export class ThemeStairs {
    handle() {
        const stairs = parseInt(prompt("چند پله را پیاده سازی کنیم"));
        return {
            x: 10,
            y: 20,
            fill: '#00D2FF',
            width: 100,
            height: 50,
            sceneFunc: function (context, shape) {
                context.beginPath();
                // don't need to set position of rect, Konva will handle it
                context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
                // (!) Konva specific method, it is very important
                // it will apply are required styles
                context.fillStrokeShape(shape);
            }
        }
    }
}