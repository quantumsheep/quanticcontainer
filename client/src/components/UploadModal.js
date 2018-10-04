import React, { Component } from 'react';
import axios from 'axios';

export default class UploadModal extends Component {
  state = {
    directories: [],
    /** @type {File[]} */
    files: []
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    if(this.state.files.length !== this.props.files.length) {
      this.setState({ files: [...this.props.files] });
    }
  }

  getDirectories = () => {
    // axios.get('/tree?od=1')
  }

  upload = async e => {
    e.preventDefault();

    const data = new FormData();
    this.state.files.forEach((file, i) => data.append(`files[${i}]`, file));

    try {
      await axios.put(`/files/${this.state.user.username}/`, data, {
        onUploadProgress: ({ loaded, total }) => {
          console.log(Math.round((loaded * 100) / total));
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    const { open = false, onClose = () => { } } = this.props;

    return (
      <div className={"modal" + (!open ? " hidden" : "")}>
        <div className="back" onClick={onClose}></div>
        <div className="modal-content">
          <form method="POST" action="/files" onSubmit={this.upload}>
            <h2>Login</h2>
            <select name="directory">
              <option>Select a directory</option>
              {
                this.state.directories.map((dir, i) => (
                  <option key={i} value={dir}>{dir}</option>
                ))
              }
            </select>
            {
              this.state.files.map((file, i) => (
                <div key={i}>{file.name}</div>
              ))
            }
            <div className="flex space-between align-end">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Upload</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}