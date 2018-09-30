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
            console.log(user);
            if (user) {
                this.setState({ user });
            }
        } catch (e) {
            console.log(e);
        }
    }

    onConnect = () => this.getUser();

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
                                    <span onClick={() => this.setState({ loginModal: true })}>{this.state.user.username ? `Diconnect (connected as ${this.state.user.username})` : "Login"}</span>
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