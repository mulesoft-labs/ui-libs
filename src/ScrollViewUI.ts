/**
 * Created by kor on 22/06/15.
 */
import SpacePenViews = require('atom-space-pen-views');
import UI = require("./UI")
export class Scrollable extends SpacePenViews.ScrollView implements UI.UIComponent {

     _children: UI.UIComponent[] = []

    constructor() {
        super();
    }
    static content(): HTMLElement {
        var v = (<any>this).div({ class: 'scrollpad pane-item padded', tabindex: -1, style: "overflow:scroll;" })

        return v;
    }
    dispose() {

    }


    caption() { return ""; }

    scroll(top: number, left: number) {
        this.element.scrollTop = top;
        this.element.scrollLeft = left;    
    }
    
    size() {
        return {
            top: this.element.scrollTop,
            left: this.element.scrollLeft,
            bottom: this.element.scrollTop + this.element.clientHeight,
            right: this.element.scrollLeft + this.element.clientWidth
        }
    }

    changed() { }
    refresh() { }

    private _ui: UI.HTMLTypes;
    ui() {
        return this.element;
    }

    private _parent: UI.UIComponent;

    setParent(p: UI.UIComponent) {
        if (this._parent != null)
            this._parent.removeChild(this);

        this._parent = p;
    }

    //TODO REMOVE COPY PASTE
    addChild(child: UI.UIComponent|UI.BasicComponent<any>) {
        child.setParent(this);
        this._children.push(child);
        //this.changed();
    }
    removeChild(child: UI.UIComponent) {
        this._children = this._children.filter(x=> x != child);
        // this.changed();
    }
    doRender() {
        return this.innerRenderUI();
    }
    /**
     *
     * @returns not null element;
     */
    private selfRender(): HTMLElement {
        return <any>document.createElement("div");
    }

    attached() {
        this.html(this.innerRenderUI())
    }

    innerRenderUI(): HTMLElement {
        var start = this.selfRender();
        this._children.forEach(x=> {
            var el = x.renderUI()
            if (el) {
                start.appendChild(el);
            }
        });

        return start;
    }

    renderUI(): UI.HTMLTypes {
        return this.element;
    }

    parent(): any {
        return null;
    }

    children(): UI.UIComponent[] {
        return this._children;
    }

    isAttached(): boolean {
        return true;
    }
}