import React, { Component } from 'react';
import axios from 'axios';

import File from './File';

export default class FileList extends Component {
    state = {
        path: '/',
        files: [],
    }

    componentDidUpdate() {
        if (this.state.path !== window.location.pathname) {
            this.getFiles();

            this.setState({ path: window.location.pathname });
        }
    }

    getFiles = () => {
        axios.get(`/files${this.state.path}`)
            .then(({ data }) => this.setState({ files: data || [] }))
            .catch(console.error);
    }

    render() {
        return (
            <ul className="filelist">
                {
                    this.state.files.map(file => <File isDir={file.isDir} filename={file.name} />)
                }
            </ul>
        );
    }
}