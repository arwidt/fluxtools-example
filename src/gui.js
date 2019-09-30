
import PubSub from 'pubsub-js';
import actions from "./actions.js";

import "./gui.scss";

const _gui = {};
const _elements = {};

// Init the gui connecting the
// element to click functions.
_gui.init = function() {

    _elements.root = document.body.querySelector('.gui');
    _elements.addButton = _elements.root.querySelector('.gui__addbutton');
    _elements.removeButton = _elements.root.querySelector('.gui__removebutton');
    _elements.randomButton = _elements.root.querySelector('.gui__randomize');
    _elements.historyBackButton = _elements.root.querySelector('.gui__history-back');

    // When user clicks the add button
    // we publish the add action.
    _elements.addButton.addEventListener('click', (e) => {
        PubSub.publish(actions.PUSH_RANDOM_VIEW, {});
    });

    // When user clicks the remove button
    // we publish the remove action.
    _elements.removeButton.addEventListener('click', (e) => {
        PubSub.publish(actions.POP_RANDOM_VIEW, {});
    });

    // When user clicks the randomize button
    // we publish the randomize action.
    _elements.randomButton.addEventListener('click', (e) => {
        PubSub.publish(actions.RANDOMIZE_ALL_VIEWS, {});
    });

    // When user clicks the pop history button
    // we publish the pop history action.
    _elements.historyBackButton.addEventListener('click', (e) => {
        PubSub.publish(actions.POP_HISTORY, {});
    });
    
};

export default _gui;