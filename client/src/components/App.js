import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import LoginModal from './LoginModal';
import FileList from './FileList';

export default class App extends Component {
    state = {
        user: {},
        loginModal: false,
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = async () => {
        try {
            const { data: user } = await axios.get('/identify');
            
            if (user) {
                this.setState({ user });
            }
        } catch (e) {
            console.error(e);
        }
    }

    onConnect = () => this.getUser();

    accountClick = async e => {
        if (!this.state.user) {
            return this.setState({ loginModal: true });
        }
        
        try {
            await axios.post('/logout');

            this.setState({ user: {} });
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <Router>
                <div className="app">
                    <header>
                        <nav>
                            <ul>
                                <li>
                                    <a>My files</a>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span onClick={this.accountClick}>{this.state.user.username ? `Diconnect (connected as ${this.state.user.username})` : "Login"}</span>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <FileList />
                    <LoginModal open={this.state.loginModal} onConnect={this.onConnect} onClose={() => this.setState({ loginModal: false })} />
                </div>
            </Router>
        );
    }
}