"use strict";

import {wantedDiffKeys } from "@arwidt/fluxtools";
import PubSub from 'pubsub-js';
import actions from "./actions.js";
import "./view.scss";

const _view = {};
const _elements = {
    views: {}
};

// Factory object for one box
// A box has a background color
// a shape and shapecolor.
// This is a dumb part and
// only takes values from the view
// and changes accordingly.
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

// Handle the store change
// the subscription will get the action
// which is always the store change action.
// The payload will have .diff containing what
// parts of the object that changed and a clone
// of the current store.
const _handleStoreChange = function(action, payload) {

    // Using the fluxtool helper function wantedDiffKeys
    // to filter for only wanted diffs.
    if (wantedDiffKeys(payload.diff, ['view'])) {

        // Save the ids from the store
        // to later remove boxes not matching.
        const storeIds = [];
        payload.store.views.forEach(value => {

            // Add id to list of ids.
            storeIds.push("" + value.id);
            
            // If box with id already in views.
            if (_elements.views.hasOwnProperty(value.id)) {
                // Add the new values to each box
                _elements.views[value.id].renderValue(value);
            } else {
                // Box is a new box, then we create it
                // and add to list of boxes.
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

// Init the view and start subscribing
// to the change event from store.
_view.init = function() {
    _elements["root"] = document.querySelector('.gfx-area');
    PubSub.subscribe(actions.STORE_CHANGED, _handleStoreChange);
};

export default _view;
