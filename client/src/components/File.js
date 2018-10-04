import React, { Component } from 'react';

import { Link } from 'react-router-dom';

/**
 * Icons from: https://www.flaticon.com/packs/file-types
 */

const extensions = [
    'js',
]

export default class File extends Component {
    render() {
        const { isDir, path = '', filename = '' } = this.props;

        if (isDir) {
            return (
                <li className="file">
                    <Link to={`${path}${path.endsWith('/') ? filename : `/${filename}`}`}>
                        <img className="icon" src="/icons/dir.svg" alt="" />
                        <span>{filename}</span>
                    </Link>
                </li>
            );
        } else {
            /**
             * @type {string[]}
             */
            const parts = filename.split('.');

            const extension = parts.length > 1 ? parts.pop() : 'file';

            return (
                <li className="file">
                    <Link to={`${path}${path.endsWith('/') ? filename : `/${filename}`}`}>
                        <img className="icon" src={`/icons/${extensions.includes(extension) ? extension : 'file'}.svg`} alt="" />
                        <span>{filename}</span>
                    </Link>
                </li>
            )
        }
    }
}