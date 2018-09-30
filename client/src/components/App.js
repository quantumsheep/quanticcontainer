import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import LoginModal from './LoginModal';
import FileList from './FileList';

export default class App extends Component {
    state = {
        account: {},
        loginModal: false,
    }

    componentDidMount() {
        this.getAccount();
    }

    getAccount = async () => {
        try {
            const { data: account } = await axios.get('/identify');

            if (account) {
                this.setState({ account });
            }
        } catch (e) {
            console.log(e);
        }
    }

    onConnect = () => this.getAccount();

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
                                    <span onClick={() => this.setState({ loginModal: true })}>{this.state.account.username ? "Disconnect" : "Login"}</span>
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