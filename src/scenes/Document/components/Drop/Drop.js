import React from 'react';
import './Drop.css';
import { ReactComponent as DropIcon } from './drop-icon.svg';

const helloWorldBuffer = new TextEncoder().encode('Hello world!');
const helloWorldHandle = {
  name: 'demo-example.txt',
  type: 'text/plain',
};

/**
 * A place to drop an encrypted or uncrypted file.
 */
function Drop({ children, setFile, policyState }) {
  const processFile = async (files) => {
    // Default to hello world
    if (!files.length) {
      return setFile({
        fileHandle: helloWorldHandle,
        fileBuffer: helloWorldBuffer,
      });
    }

    const fileHandle = files[0];
    setFile({ fileHandle });
  };

  const handleFileInput = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    if (files[0] && files[0].size >= 10485760) {
      // 10mb
      event.target.classList.remove('Drop-hover');
      alert('This demo only supports files 10mb or less.');
      return;
    }
    // TODO(DSAT-45) Handle more than one file, or don't
    await processFile(files);
  };

  const handleDrag = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  const handleDragEnter = (event) => {
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  const handleDragLeave = (event) => {
    if (event.target.id === 'dropzone') {
      event.target.classList.remove('Drop-hover');
    }
  };

  function DropZone({ children, policyState }) {
    return (
      <div
        className={`Drop Drop-${policyState}`}
        id="dropzone"
        onDrop={handleFileInput}
        onDragOver={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {children}
      </div>
    );
  }

  function UploadButton() {
    return (
      <label className="Drop-UploadButton" htmlFor="upload">
        Choose File
        <input type="file" id="upload" name="upload[]" onChange={handleFileInput} />
      </label>
    );
  }

  function EmptyTarget() {
    return (
      <div className="Drop-text">
        <div className="default-instructions">
          <div className="Drop-box">
            <DropIcon className="Drop-icon" />
          </div>
          <p>Drag in any regular file to protect it</p>
          <UploadButton />
        </div>
        <div className="dragging-instructions">drop here</div>
      </div>
    );
  }

  if (!children) {
    return (
      <DropZone policyState="empty">
        <EmptyTarget />
      </DropZone>
    );
  }
  return <DropZone policyState={policyState}>{children}</DropZone>;
}

export default Drop;
