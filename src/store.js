"use strict";

import { defineStore, cloneObject, deepObjectDiff, mergeObjects } from "@arwidt/fluxtools";
import PubSub from 'pubsub-js';
import actions from "./actions.js";

const _store = {};
const _storeModel = {};
const _storeHistory = [];

const _colors = ["blue", "red", "green"];
const _shapes = ["square", "circle", "triangle"];
const _shapecolors = ["yellow", "cyan", "purple"];

// When 
const _addStoreToHistory = function() {
    _storeHistory.push(cloneObject(_storeModel));
    
    // We save max 100 historical stores
    while (_storeHistory.length > 100) {
        _storeHistory.shift();
    }
};

// Pops the last history item
const _getLastItemInHistory = function() {
    if (_storeHistory.length > 0) {
        return _storeHistory[_storeHistory.length-1];
    } else return null;
};

// We publish change and push to history
const _publishChange = function() {

    // Get the last item in history
    // the have something to diff with
    const previousStore = _getLastItemInHistory();
    
    // Add the store to history
    _addStoreToHistory();

    // Use the fluxtools function deepObjectDiff
    // the get a list of changes to the store model
    const diff = deepObjectDiff(previousStore, _storeModel);
    
    // Then publish change
    PubSub.publish(actions.STORE_CHANGED, {diff: diff, store: cloneObject(_storeModel)});
};

// We publish the last pushed object in
// history list
const _publishHistoryBack = function() {
    if (_storeHistory.length === 0) return; // Guard

    // We clone the current store
    const currentStore = cloneObject(_storeModel);
    
    // Merge the current store with the store
    // from history
    mergeObjects(_storeModel, _storeHistory.pop());

    // Get the diff
    const diff = deepObjectDiff(currentStore, _storeModel);

    // And publish
    PubSub.publish(actions.STORE_CHANGED, {diff: diff, store: cloneObject(_storeModel)});
};

// We add a new box values object to
// the views list with random values
const _handlePushRandomView = function(action, payload) {
    _storeModel.views.push({
        id: Date.now(),
        shape: _shapes[~~(Math.random()*_shapes.length)],
        shapecolor: _shapecolors[~~(Math.random()*_shapecolors.length)],
        background: _colors[~~(Math.random()*_colors.length)]
    });
    _publishChange();
};

// We remove a box from the views list
// in the store model
const _handlePopRandomView = function(action, payload) {
    _storeModel.views.pop();
    _publishChange();
};

// We randomize all the boxes in
// the storeModel with new values
// for background, shape and shapecolor
const _handleRandomizeAllViews = function(action, payload) {
    _storeModel.views.forEach(item => {
        item.shape = _shapes[~~(Math.random()*_shapes.length)];
        item.shapecolor = _shapecolors[~~(Math.random()*_shapecolors.length)];
        item.background = _colors[~~(Math.random()*_colors.length)];
    });
    _publishChange();
};

// We pop from the history list
// and replace the current store
// with the last pushed in history.
const _handlePopHistory = function(action, payload) {
    _publishHistoryBack();
};

// We init the store
_store.init = function() {
    
    // Use the fluxtools defineStore function
    // to merge the _storeModel with
    // new structure.
    defineStore(_storeModel, {
        views: []
    });

    // We publish the first time to
    // give all views the correct state.
    _publishChange();

    // We subscribe to all "to store" actions.
    PubSub.subscribe(actions.PUSH_RANDOM_VIEW, _handlePushRandomView);
    PubSub.subscribe(actions.POP_RANDOM_VIEW, _handlePopRandomView);
    PubSub.subscribe(actions.RANDOMIZE_ALL_VIEWS, _handleRandomizeAllViews);
    PubSub.subscribe(actions.POP_HISTORY, _handlePopHistory);

};

export default _store;