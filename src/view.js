"use strict";

import { PubSub, wantedDiffKeys } from "@arwidt/fluxtools";
import actions from "./actions.js";
import "./view.scss";

const _view = {};
const _elements = {
    views: {}
};

const _boxFactory = (function() {

    // Factory object
    var _inst = function(opts) {
        var _opts = opts || {};
        var inst = {
            opts: function() {
                return _opts;
            }
        };

        const value = _opts.value;
        const elementDomString = `<div class="item" id="box_${value.id}" data-shape="${value.shape}" data-background="${value.background}" data-shapecolor="${value.shapecolor}"></div>`.toDOM()
        _opts.container.appendChild(elementDomString);
        const element = _opts.container.querySelector(`#box_${value.id}`);

        // Return the id
        Object.defineProperty(inst, "id", {get: function() { return value.id; }});

        // Render new values
        inst.renderValue = function(val) {
            console.log(val);
            
            element.setAttribute('data-shape', val.shape);
            element.setAttribute('data-background', val.background);
            element.setAttribute('data-shapecolor', val.shapecolor);
        };

        // Remove the element
        inst.remove = function() {
            element.parentElement.removeChild(element);
        };

        return inst;
    };

    // Factory interface
    var _fact = {
        create: function(opts) {
            return _inst(opts);
        }
    };

    return _fact;

})();

const _handleStoreChange = function(action, payload) {
    console.log("VIEW:", action, payload);

    if (wantedDiffKeys(payload.diff, ['view'])) {
        console.log("VIEWS");

        const storeIds = [];
        payload.store.views.forEach(value => {
            storeIds.push("" + value.id);
            if (_elements.views.hasOwnProperty(value.id)) {
                _elements.views[value.id].renderValue(value);
            } else {
                _elements.views[value.id] = _boxFactory.create({
                    container: _elements.root,
                    value: value
                });
            }
        });

        // Remove items not in store
        Object.keys(_elements.views).forEach(key => {
            if (storeIds.indexOf(key) === -1) {
                _elements.views[key].remove();
                delete _elements.views[key];
            }
        });

    }
};

_view.init = function() {
    console.log("VIEW");
    _elements["root"] = document.querySelector('.gfx-area');
    
    PubSub.subscribe(actions.STORE_CHANGED, _handleStoreChange);
};

export default _view;
