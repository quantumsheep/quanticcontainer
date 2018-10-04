import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Breadcrumb extends Component {
    render() {
        const path = window.location.pathname.split('/').filter(v => v);

        return (
            <span className="breadcrumb">
                {
                    path.map((part, i) => {
                        console.log(path.slice(0, i).join('/') + `/${part}`)
                        return (
                            <span key={i}>
                                <span>/</span>
                                <Link to={`${i > 0 ? '/' : ''}` + path.slice(0, i).join('/') + `/${part}`}>{part}</Link>
                            </span>
                        )
                    })
                }
            </span>
        )
    }
}