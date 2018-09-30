import React, { Component } from 'react';
import axios from 'axios';

import File from './File';

export default class FileList extends Component {
    state = {
        path: '/',
        files: [],
    }

    componentDidMount() {
        this.getFiles();
        this.setPath();
    }

    componentDidUpdate() {
        if (this.state.path !== window.location.pathname) {
            this.getFiles();
            this.setPath();
        }
    }

    setPath = () => this.setState({ path: window.location.pathname });

    getFiles = () => {
        axios.get(`/files${this.state.path}`)
            .then(({ data }) => this.setState({ files: data || [] }))
            .catch(console.error);
    }

    render() {
        return (
            <ul className="filelist">
                {
                    this.state.files.map((file, i) => <File key={i} isDir={file.isDir} filename={file.name} />)
                }
            </ul>
        );
    }
}