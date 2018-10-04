import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import LoginModal from './LoginModal';
import UploadModal from './UploadModal';

import FileList from './FileList';
import Breadcrumb from './Breadcrumb';

export default class App extends Component {
    state = {
        user: {},
        loginModal: false,
        uploadModal: false,
        /** @type {HTMLInputElement} */
        fileInput: null,
        /** @type {Filelist} */
        files: [],
        path: '',
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

    onFiles = e => {
        this.setState({ 
            files: e.target.files,
            uploadModal: true,
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
                        onChange={this.onFiles}
                        ref={ref => !this.state.fileInput ? this.setState({ fileInput: ref }) : null}
                    />
                    <header>
                        <nav>
                            <ul>
                                <li>
                                    <a>My files</a>
                                </li>
                                <li className="nohover">
                                    <Breadcrumb />
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
                    <UploadModal open={this.state.uploadModal} files={this.state.files} onClose={() => this.setState({ uploadModal: false })} />
                </div>
            </Router>
        );
    }
}