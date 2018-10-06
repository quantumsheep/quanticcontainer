import React, { Component } from 'react';
import axios from 'axios';

export default class UploadModal extends Component {
  state = {
    directories: [],
    /** @type {File[]} */
    files: [],
    checked: [],
  }

  checkboxes = [];

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.state.files.length !== this.props.files.length) {
      this.setState({ files: [...this.props.files] });
      this.getDirectories();
    }

    if(this.props.open && !prevProps.open) {
      this.setState({ checked: [] });
    }
  }

  getDirectories = () => {
    axios.get('/tree?od=1')
      .then(({ data: directories }) => this.setState({ directories }))
      .catch(console.error)
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

  /**
   * @param {React.MouseEvent<HTMLDivElement>} e 
   * @param {number} i 
   */
  check = (e, i) => {
    e.preventDefault();

    const checked = this.state.checked;
    checked[i] = !checked[i];

    this.setState({ checked });
  }

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    this.checkboxes = [];
    const { open = false, onClose = () => { } } = this.props;

    return (
      <div className={"modal" + (!open ? " hidden" : "")}>
        <div className="back" onClick={onClose}></div>
        <div className="modal-content upload-modal">
          <form method="POST" action="/files" onSubmit={this.upload}>
            <h2>Upload files</h2>
            <select name="directory" defaultValue="">
              <option value="" disabled>Destination</option>
              {
                this.state.directories.map((dir, i) => (
                  <option key={i} value={dir}>{dir}</option>
                ))
              }
            </select>
            <div>
              {
                this.state.files.map((file, i) => (
                  <div key={i} className="upload-file" onClick={e => this.check(e, i)}>
                    <input type="checkbox" checked={this.state.checked[i] || false} readOnly />
                    <div className="upload-thumbnail"></div>
                    <div className="upload-filename">{file.name}</div>
                  </div>
                ))
              }
            </div>
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