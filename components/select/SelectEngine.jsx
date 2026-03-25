import React, { forwardRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SelectEngine = forwardRef(
  (
    {
      elements = [],
      is_open,
      is_rendered,
      selectedElement = '',
      controller,
      inputRef,
      OnChangeCallback
    },
    ref
  ) => {
    function ChangeValue(value) {
      if (!value) {
        return;
      }
      inputRef.current.value = value;
      controller((prevData) => ({
        ...prevData,
        is_open: false
      }));

      OnChangeCallback();
    }

    useGSAP(() => {
      if (!ref?.current) return;

      if (is_open) {
        gsap.fromTo(
          ref.current,
          {
            height: 0,
            opacity: 0
          },
          {
            height: 'auto',
            opacity: 1,
            duration: 1.1,
            ease: 'power2.inOut'
          }
        );
      } else {
        gsap.to(ref.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
    }, [is_open, elements]);

    useEffect(() => {
      const observer = new ResizeObserver(() => {
        ref.current.style.width = (inputRef.current.offsetWidth - 20) + "px";
        ref.current.style.marginLeft += 20;
      });
      observer.observe(inputRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <>
        {is_rendered && (
          <ul
            className="dyvix-dropdown-select"
            role="listbox"
            style={
              is_open
                ? { background: 'whitesmoke', border: '1px solid #e2e8f0' }
                : { background: 'transparent', border: 'none' }
            }
            ref={ref}
          >
            {is_open &&
              elements.map((element, index) => (
                <li
                  role="listitem"
                  key={index}
                  onClick={() => ChangeValue(element)}
                >
                  {element}
                </li>
              ))}
            {is_open && elements.length === 0 && (
              <li
                role="listitem"
                key={404}
                style={{
                  fontSize: '.5rem',
                  color: '#888',
                  textAlign: 'center'
                }}
              >
                Not Found!
              </li>
            )}
          </ul>
        )}
      </>
    );
  }
);

export default SelectEngine;
