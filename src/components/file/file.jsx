import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GaurdStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';

function DyvixFile({ label = 'Upload File', onUpload }) {
  const [file, Setfile] = React.useState(null);
  function handleFileChange(e) {
    if(e.target.files && e.target.files[0])
    {
      Setfile(e.target.files[0].name);
      if(typeof onUpload === 'function')
      {
        onUpload(e.target.files[0]);
      }
    }
  }

  return (
    <div className="dyvix-file-wrapper">
      <label className="dyvix-file" htmlFor="file-upload">
        <div className="dyvix-file-ui">
          <span className="dyvix-file-icon">📁</span>
          <p>{file !== null ? file :label}</p>
        </div>
        <input type="file" className="dyvix-file-hidden" id="file-upload" onChange={(e)=> handleFileChange(e)} />
      </label>
    </div>
  );
}

export default DyvixFile;
