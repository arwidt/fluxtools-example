"use strict";

import { defineStore, PubSub, cloneObject, deepObjectDiff, mergeObjects } from "@arwidt/fluxtools";
import actions from "./actions.js";

const _store = {};
const _storeModel = {};
const _storeHistory = [];

const _colors = ["blue", "red", "green"];
const _shapes = ["square", "circle", "triangle"];
const _shapecolors = ["yellow", "cyan", "purple"];

const _addStoreToHistory = function() {
    _storeHistory.push(cloneObject(_storeModel));
    
    // We save max 100 historical stores.
    while (_storeHistory.length > 100) {
        _storeHistory.shift();
    }
};

const _getLastItemInHistory = function() {
    if (_storeHistory.length > 0) {
        return _storeHistory[_storeHistory.length-1];
    } else return null;
};

const _publishChange = function() {
    const previousStore = _getLastItemInHistory();
    _addStoreToHistory();

    const diff = deepObjectDiff(previousStore, _storeModel);
    
    PubSub.publish(actions.STORE_CHANGED, {diff: diff, store: cloneObject(_storeModel)});
};

const _publishHistoryBack = function() {
    if (_storeHistory.length === 0) return; // Guard

    const currentStore = cloneObject(_storeModel);
    mergeObjects(_storeModel, _storeHistory.pop());

    const diff = deepObjectDiff(currentStore, _storeModel);
    PubSub.publish(actions.STORE_CHANGED, {diff: diff, store: cloneObject(_storeModel)});
};

const _handlePushRandomView = function(action, payload) {
    _storeModel.views.push({
        id: Date.now(),
        shape: _shapes[~~(Math.random()*_shapes.length)],
        shapecolor: _shapecolors[~~(Math.random()*_shapecolors.length)],
        background: _colors[~~(Math.random()*_colors.length)]
    });
    _publishChange();
};

const _handlePopRandomView = function(action, payload) {
    _storeModel.views.pop();
    _publishChange();
};

const _handleRandomizeAllViews = function(action, payload) {
    _storeModel.views.forEach(item => {
        item.shape = _shapes[~~(Math.random()*_shapes.length)];
        item.shapecolor = _shapecolors[~~(Math.random()*_shapecolors.length)];
        item.background = _colors[~~(Math.random()*_colors.length)];
    });
    _publishChange();
};

const _handlePopHistory = function(action, payload) {
    _publishHistoryBack();
};

_store.init = function() {
    
    defineStore(_storeModel, {
        views: []
    });

    _publishChange();

    PubSub.subscribe(actions.PUSH_RANDOM_VIEW, _handlePushRandomView);
    PubSub.subscribe(actions.POP_RANDOM_VIEW, _handlePopRandomView);
    PubSub.subscribe(actions.RANDOMIZE_ALL_VIEWS, _handleRandomizeAllViews);
    PubSub.subscribe(actions.POP_HISTORY, _handlePopHistory);

    window.f['storeModel'] = _storeModel;
    
};

export default _store;