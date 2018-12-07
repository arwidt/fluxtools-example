
import { PubSub } from "@arwidt/fluxtools";
import actions from "./actions.js";

import "./gui.scss";

const _gui = {};
const _elements = {};

_gui.init = function() {

    _elements.root = document.body.querySelector('.gui');
    _elements.addButton = _elements.root.querySelector('.gui__addbutton');
    _elements.removeButton = _elements.root.querySelector('.gui__removebutton');
    _elements.randomButton = _elements.root.querySelector('.gui__randomize');
    _elements.historyBackButton = _elements.root.querySelector('.gui__history-back');

    _elements.addButton.addEventListener('click', (e) => {
        PubSub.publish(actions.PUSH_RANDOM_VIEW, {});
    });

    _elements.removeButton.addEventListener('click', (e) => {
        PubSub.publish(actions.POP_RANDOM_VIEW, {});
    });

    _elements.randomButton.addEventListener('click', (e) => {
        PubSub.publish(actions.RANDOMIZE_ALL_VIEWS, {});
    });

    _elements.historyBackButton.addEventListener('click', (e) => {
        PubSub.publish(actions.POP_HISTORY, {});
    });
    
};

export default _gui;