import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import LoginModal from './LoginModal';
import FileList from './FileList';

export default class App extends Component {
    state = {
        user: {},
        loginModal: false,
        /** @type {HTMLInputElement} */
        fileInput: null,
        /** @type {File} */
        file: null,
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
        } catch (e) { }
    }

    onConnect = () => this.getUser();

    accountClick = async e => {
        if (Object.keys(this.state.user).length <= 0) {
            return this.setState({ loginModal: true });
        }

        try {
            await axios.post('/logout');

            this.setState({ user: {} });
        } catch (e) {
            console.error(e);
        }
    }

    openUpload = e => {
        e.preventDefault();

        if (this.state.fileInput) {
            this.state.fileInput.click();
        }
    }

    upload = () => {
        const data = new FormData();
        data.append('foo', 'bar');
        data.append('file', document.getElementById('file').files[0]);
        var config = {
            onUploadProgress: ({ loaded, total }) => {
                const percentCompleted = Math.round((loaded * 100) / total);

                console.log(percentCompleted);
            }
        };
        axios.put(`/files/${this.state.user.username}/`, data, config)
            .then(res => {
                console.log('Done.')
            })
            .catch(err => {
                console.log(err)
            });
    }

    render() {
        return (
            <Router>
                <div className="app">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={({ target: { files: [file] } }) => this.setState({ file })}
                        ref={ref => !this.state.fileInput ? this.setState({ fileInput: ref }) : null}
                    />
                    <header>
                        <nav>
                            <ul>
                                <li>
                                    <a>My files</a>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span onClick={this.openUpload}>Upload</span>
                                </li>
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