import {ThemeStairs} from "./theme.stairs";
import {ThemeRoad} from "./theme.road";


export class ThemeFactory {
    _handler;
    constructor(
        themeId
    ) {
        if(themeId === 2) this._handler = new ThemeStairs();
        if(themeId === 6) this._handler = new ThemeRoad();
    }

    handle() {
        return this._handler.handle()
    }
}