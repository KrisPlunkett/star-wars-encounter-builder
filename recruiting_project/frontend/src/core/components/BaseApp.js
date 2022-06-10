import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, generatePath, matchPath, Route, withRouter} from 'react-router-dom';

class BaseApp extends React.Component {
    /**
     * Render this application to the dom
     * @param props
     */
    static renderToDOM(props=null) {
        ReactDOM.render(
            <Router>
                <Route {...this.routeOptions}>
                    {(React.createElement(withRouter(this), props))}
                </Route>
            </Router>,
            document.querySelector('.react-render')
        );
    }
}

export default BaseApp;
