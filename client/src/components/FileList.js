import React, { Component } from 'react';

export default class FileList extends Component {
    render() {
        const { children } = this.props;

        return (
            <ul className="filelist">
                {children}
            </ul>
        );
    }
}