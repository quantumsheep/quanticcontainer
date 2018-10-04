import React, { Component } from 'react';
import axios from 'axios';

import File from './File';

export default class FileList extends Component {
    state = {
        path: '/',
        files: [],
    }

    componentDidMount() {
        this.getFiles(window.location.pathname);
        this.setPath();
    }

    componentDidUpdate() {
        if (this.state.path !== window.location.pathname) {
            this.getFiles(window.location.pathname);
            this.setPath();
        }
    }

    setPath = () => this.setState({ path: window.location.pathname });

    getFiles = (path) => {
        axios.get(`/files${path || this.state.path}`)
            .then(({ data }) => this.setState({ files: data || [] }))
            .catch(console.error);
    }

    render() {
        return (
            <ul className="filelist">
                {
                    this.state.files.map((file, i) => <File key={i} isDir={file.isDir} path={this.state.path} filename={file.name} />)
                }
            </ul>
        );
    }
}