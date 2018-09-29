import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import File from './File';
import FileList from './FileList';

export default class App extends Component {
    state = {
        files: [],
    }

    componentDidMount() {
        this.getFiles();
    }

    getFiles = () => {
        axios.get('/files')
            .then(files => this.setState({ files }))
            .catch(console.error);
    }

    render() {
        return (
            <Router className="app">
                <FileList>
                    {
                        this.state.files.map(file => <File isDir={file.isDir} filename={file.name} />)
                    }
                </FileList>
            </Router>
        )
    }
}