import {ThemeStairs} from "./theme.stairs";


export class ThemeFactory {
    _handler;
    constructor(
        themeId
    ) {
        if(themeId === 2) this._handler = new ThemeStairs();
    }

    handle() {
        return this._handler.handle()
    }
}