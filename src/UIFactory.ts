/// <reference path="../typings/main.d.ts" />

import UI = require("./UI");


export function label(text: string, ic: UI.Icon = null, tc: UI.TextClasses = null, th: UI.HighLightClasses = null): UI.TextElement<any> {
    var v = new UI.TextElement("label", text, ic);
    UI.applyStyling(tc, v, th);
    return v;
}

export function html(text:string):UI.InlineHTMLElement{
    var v= new UI.InlineHTMLElement("span",text);
    return v;
}

export function a(text:string,e:UI.EventHandler, ic:UI.Icon=null,tc:UI.TextClasses=null,th:UI.HighLightClasses=null):UI.TextElement<any>{
    var v= new UI.TextElement("a",text,ic);
    v.addOnClickListener(e);
    UI.applyStyling(tc, v, th);
    return v;
}

export function checkBox(caption: string, h: UI.EventHandler = x=> { }) {
    return new UI.CheckBox(caption, null, h)
}

export function select(caption: string) {
    return new UI.Select(caption, x=>x)
}

export function button(txt: string, _size: UI.ButtonSizes = UI.ButtonSizes.NORMAL,
    _highlight: UI.ButtonHighlights = UI.ButtonHighlights.NO_HIGHLIGHT,
    _icon: UI.Icon = null, onClick: UI.EventHandler = null) {
    return new UI.Button(txt, _size, _highlight, _icon, onClick);
}

export function buttonSimple(txt: string, onClick: UI.EventHandler = null,
                       _icon: UI.Icon = null) {
    return new UI.Button(txt, UI.ButtonSizes.NORMAL,
        UI.ButtonHighlights.NO_HIGHLIGHT, _icon, onClick);
}

export function toggle(txt: string, _size: UI.ButtonSizes = UI.ButtonSizes.NORMAL,
    _highlight: UI.ButtonHighlights = UI.ButtonHighlights.NO_HIGHLIGHT,
    _icon: UI.Icon = null, onClick: UI.EventHandler = null) {
    return new UI.ToggleButton(txt, _size, _highlight, _icon, onClick);
}

export function renderer<T>(v: UI.WidgetCreator<T>): UI.ICellRenderer<T> {
    return new UI.SimpleRenderer(v);
}

export function treeViewer<T>(childFunc: UI.ObjectToChildren<T>, renderer: UI.ICellRenderer<T>, labelProvider?: UI.LabelFunction<T>): UI.TreeViewer<T, T> {
    return new UI.TreeViewer<T, T>(new UI.DefaultTreeContentProvider(childFunc), renderer, labelProvider);
}

export function treeViewerSection<T>(header: string, icon: UI.Icon, input: T, childFunc: UI.ObjectToChildren<T>, renderer: UI.ICellRenderer<T>): UI.TreePanel<T, T> {
    var resp: UI.TreePanel<T, T> = <any>section(header, icon);

    var tw = treeViewer(childFunc, renderer);

    tw.renderUI();

    tw.setInput(input);
    resp.addChild(filterField(tw));
    resp.viewer = tw;
    resp.addChild(tw);
    return resp;
}

export function filterField(viewer: UI.StructuredViewer<any, any>) {
    var flt = new UI.BasicFilter();
    var t = new UI.TextField("Filter:", "", x=> {
        flt.setPattern((<UI.AtomEditorElement>x).getValue());
    }, UI.LayoutType.INLINE_BLOCK)
    t.setStyle("margin-bottom", "5px")
    viewer.addViewerFilter(flt);
    return t;
}

export function toggleFilter<T>(viewer: UI.StructuredViewer<any, T>, icon: UI.Icon, pred: UI.Predicate<T>, on: boolean = false, desc: string = "") {
    var flt = new UI.ToggleFilter(pred);
    var t = toggle("", UI.ButtonSizes.EXTRA_SMALL, UI.ButtonHighlights.NO_HIGHLIGHT, icon, x=> {
        flt.setOn(!flt.isOn())
    })
    t.setSelected(on)
    flt.setOn(on)
    viewer.addViewerFilter(flt);
    return t;
}


export function section(text: string, ic: UI.Icon = null, collapsable: boolean = true, colapsed: boolean = false, ...children: UI.UIComponent[]): UI.Section {
    var textElement = new UI.TextElement("h2", text, ic);
    var newSection = new UI.Section(textElement, collapsable);

    children.filter(x=>x != null).forEach(x=> newSection.addChild(x));

    newSection.setExpanded(!colapsed);
    return newSection;
}


export function masterDetailsPanel<T, R>(selectionProvider: UI.SelectionViewer<T>, viewer: UI.Viewer<R>, convert: UI.Convertor<T, R> = null, horizontal: boolean = false): UI.Panel {
    var panel = horizontal ? hc(selectionProvider, viewer) : vc(selectionProvider, viewer);
    masterDetails(selectionProvider, viewer, convert)
    return panel;
}

export function hcTight(...children: UI.UIComponent[]) {
    var panel = new UI.Panel(UI.LayoutType.INLINE_BLOCK_TIGHT);
    children.forEach(x=> panel.addChild(x));
    return panel;
}
export function hc(...children: UI.UIComponent[]) {
    var panel = new UI.Panel(UI.LayoutType.INLINE_BLOCK);
    children.forEach(x=> panel.addChild(x));
    return panel;
}
export function vc(...children: UI.UIComponent[]) {
    var panel = new UI.Panel(UI.LayoutType.BLOCK);
    children.forEach(x=> panel.addChild(x));
    return panel;
}

export function li(...children: UI.UIComponent[]) {
    var panel = new UI.Panel(UI.LayoutType.BLOCK);
    panel.setTagName("li");
    children.forEach(x=> panel.addChild(x));
    return panel;
}

export function masterDetails<R, T>(selectionProvider: UI.SelectionProvider<T>, viewer: UI.Viewer<R>, convert: UI.Convertor<T, R> = null) {
    selectionProvider.addSelectionListener({
        selectionChanged(e: UI.SelectionChangedEvent<T>) {
            if (!e.selection.isEmpty()) {
                var val = e.selection.elements[0];
                if (convert) {
                    var vl = convert(val);
                    viewer.setInput(vl);
                }
                else {
                    viewer.setInput(<any>val);
                }
            }
            else {
                viewer.setInput(null);
            }
        }
    });
}
