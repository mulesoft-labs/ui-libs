import UI = require("./UI");

declare var atom:{workspace:any, grammars: any, tooltips:any, views: any, config: any, styles: any};

var _dialogPanels: UI.Panel[] = [];

export function simpleModalDialog(panel: UI.Panel, onDone: () => boolean, onCancel: () => boolean) {
    _dialog2(panel, [
        { name: "Ok",   isPrimary:true,    highlight: UI.ButtonHighlights.PRIMARY, action: onDone},
        { name: "Cancel",   highlight: UI.ButtonHighlights.NO_HIGHLIGHT, action: onCancel}
    ], null)(null);
}

function _dialog2(panel: UI.Panel, actions: { name: string; isPrimary?:boolean;highlight: UI.ButtonHighlights; action: () => boolean}[], toFocus?: UI.UIComponent, stretch: boolean = false) {
    var buttonBar = UI.hc().setPercentWidth(100);

    actions.reverse().forEach(a => {
        var button = UI.button(a.name, UI.ButtonSizes.NORMAL, a.highlight, UI.Icon.NONE, x=> { if (a.action()) _closeDialog(); });
        if (a.isPrimary){
            var st=panel.getBinding().status();
            if (st) {
                if (st.code == UI.StatusCode.ERROR) {
                    button.setDisabled(true);
                }
            }
            panel.getBinding().addStatusListener((x)=>{
                var st = panel.getBinding().status();
                if (st) {
                    if (st.code != UI.StatusCode.ERROR) {
                        button.setDisabled(false);
                    }
                    else {
                        button.setDisabled(true);
                    }
                }
            })
        }
        button.setStyle("float", "right")
            .margin(4,10);

        buttonBar.addChild(button);
    });

    panel.addChild(buttonBar);

    var ui = panel.ui();

    return (e) => {
        _dialogPanels.push(panel);

        var eventListener = () => {
            if(!stretch) {
                return;
            }

            var parent = ui.parentElement;

            var height = document.body.clientHeight;

            if(!parent) {
                return;
            }

            var style = window.getComputedStyle(parent);

            ["paddingBottom", "paddingTop", "marginBottom", "marginTop"].forEach(property => {
                height -= parseFloat(style[property] || 0);
            });

            ui.style.height = height + "px";
            ui.style.overflowY = "scroll";
        }

        window.addEventListener('resize', eventListener);

        mdp = (<any>atom).workspace.addModalPanel({ item: ui});

        mdp.onDidDestroy(() => {
            window.removeEventListener('resize', eventListener);
        });

        eventListener();

        if (toFocus) toFocus.ui().focus();
    };
}

var mdp = null;
function _closeDialog() {
    _dialogPanels.pop();
    if (_dialogPanels.length == 0)
        mdp.destroy();
    else
        mdp = atom.workspace.addModalPanel({item: _dialogPanels[_dialogPanels.length -1].ui() });
}