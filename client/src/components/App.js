import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import FileList from './FileList';

export default class App extends Component {
    state = {
        connected: false,
    }

    async componentDidMount() {
        try {
            const { data: connected } = await axios.get('/identify');
            this.setState({ connected });
        } catch (e) {
            console.log(e);
        }
    }

    onConnect = () => this.setState({ connected: true });

    render() {
        if (!this.state.connected) {
            return <Login onConnect={this.onConnect} />
        } else {
            return (
                <Router className="app">
                    <FileList />
                </Router>
            )
        }
    }
}