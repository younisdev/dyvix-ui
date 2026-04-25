import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';
import React from 'react';
import { ModalTest } from './component/modal';
import { SelectTest } from './component/select';
import { ToastTest } from './component/toast';
import { ButtonTest } from './component/button';
import { FileTest } from './component/file';
import dyvixLogo from './assets/logo.png';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Links = {
  Modal: ModalTest,
  Toast: ToastTest,
  Select: SelectTest,
  Button: ButtonTest,
  File: FileTest
};

function App() {
  const [mode, SetMode] = React.useState('Selection');
  const [current, SetCurrent] = React.useState(null);
  const SelectionRef = React.useRef(null);
  const logoRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const btnRef = React.useRef([]);

  function envClick(sender) {
    SetCurrent(sender);
  }

  localStorage.clear(); // Never do in production. Only in development env.

  useGSAP(() => {
    let tl = gsap.timeline();

    if (!SelectionRef.current || !logoRef.current) return;

    if (current === null) {
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.inOut' }
      );
      tl.fromTo(
        headerRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.67, ease: 'power2.in' }
      );
      tl.fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.inOut',
          stagger: 0.2
        }
      );
    } else {
      tl.fromTo(
        logoRef.current,
        { opacity: 1, scale: 1, y: 0 },
        { opacity: 0, scale: 0, y: 20, duration: 0.8, ease: 'back.inOut' }
      );
      tl.fromTo(
        headerRef.current,
        { opacity: 1, x: 0 },
        { opacity: 0, x: 100, duration: 0.67, ease: 'power2.in' }
      );
      tl.fromTo(
        btnRef.current,
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          ease: 'power3.inOut',
          stagger: 0.2,
          onComplete: () => SetMode('Selected')
        }
      );
    }
  }, [current]);

  return (
    <>
      {mode === 'Selection' && (
        <div id="dyvix-test-selection" ref={SelectionRef}>
          <img
            src={dyvixLogo}
            id="dyvix-test-logo"
            loading="lazy"
            ref={logoRef}
          />
          <span id="dyvix-test-header" ref={headerRef}>
            Please Select a Dyvix component to test.
          </span>
          <div id="dyvix-test-btnhldr">
            {Object.keys(Links).map((link, index) => (
              <button
                key={index}
                ref={(ele) => (btnRef.current[index] = ele)}
                className="dyvix-test-btn"
                onClick={() => envClick(link)}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
      {mode === 'Selected' &&
        (() => {
          const Component = Links[current];
          return <Component />;
        })()}
    </>
  );
}

export default App;
