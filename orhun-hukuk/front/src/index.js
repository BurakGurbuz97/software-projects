import {render} from "inferno";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "inferno-redux";
import {BrowserRouter} from "inferno-router";

import reducer from "./reducer";
import App from "./App";

let store = createStore(reducer, applyMiddleware(thunk));

render(
    <Provider store= {store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
, document.getElementById("root"));
