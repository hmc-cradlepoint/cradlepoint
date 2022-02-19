import React, { Component } from "react";
import ReactS3Uploader from "react-s3-uploader";
import styles from "./Upload.module.scss";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      progress: 0
    };
  }

  // set loading to true, then continue
  // this is a specific func to the react-s3-uploader
  preprocess = (file, callback) => {
    this.setState({ loading: true });
    callback(file);
  };

  onUploadError = e => {
    this.setState({ loading: false, progress: 0 });
  };

  onUploadFinish = e => {
    // stop loading
    this.setState({ loading: false, progress: 0 });

    // clear input value
    if (this.uploadInput) this.uploadInput.value = null;

    this.props.handleFinish(e.url);
  };

  onUploadProgress = progress => {
    this.setState({
      progress
    });
  };

  renderLoading() {
    const { progress } = this.state;

    return <div>Loading ... {progress}%</div>;
  }

  render() {
    return (
      <div className={styles.container}>
        {this.state.loading ? (
          this.renderLoading()
        ) : (
          <ReactS3Uploader
            signingUrl="/upload/sign"
            signingUrlMethod="GET"
            accept="image/*"
            preprocess={this.preprocess}
            onSignedUrl={this.onSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            contentDisposition="auto"
            scrubFilename={filename => filename.replace(/[^\w\d_\-.]+/gi, "")}
            inputRef={cmp => (this.uploadInput = cmp)}
            autoUpload={true}
            multiple
          />
        )}
      </div>
    );
  }
}

export default Upload;
