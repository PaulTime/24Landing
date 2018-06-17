import React from 'react'
import bemDecorator from 'cn-decorator';
import { Switch, Route } from 'react-router-dom';

// import 'normalize.css';

import AppLayout from 'common/layouts/AppLayout'

import './index.css';

@bemDecorator('app-root')
export default class App extends React.Component {
    render (bem) {
        return (
            <section className={bem()}>
                <AppLayout>
                    <Switch>
                        <Route exact path="/" component={() => <h1>header 1</h1>}/>
                        <Route exact path="/landing-credits" component={() =>
                            <div>
                                <h1>landing-credits</h1>
                                <img src="static/img/googlelogo.png" alt="GoogleLogo" />
                                <img src="static/img/logo.svg" alt="logo" />
                            </div>
                        }/>
                    </Switch>
                </AppLayout>
            </section>
        )
    }
};