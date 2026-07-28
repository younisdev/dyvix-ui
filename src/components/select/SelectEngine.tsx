import './dependencies/style/styles.css';
import React, { forwardRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { DyvixSelectEngineProps } from './dependencies/select.types';

const SelectEngine = forwardRef<HTMLUListElement, DyvixSelectEngineProps>(
  (
    {
      elements = [],
      is_open,
      is_rendered,
      selectedElement = '',
      placeholder = '',
      controller,
      activeIndex,
      inputRef,
      OnChangeCallback,
      type,
      background,
      className,
      activeOptionId
    },
    ref
  ) => {
    const itemsRef = React.useRef<(HTMLLIElement | null)[]>([]);

    function ChangeValue(value: string | number) {
      if (!value) {
        return;
      }

      if (inputRef.current) {
        inputRef.current.value = String(value);
      }
      controller((prevData) => ({
        ...prevData,
        is_open: false,
        activeIndex: -1
      }));

      OnChangeCallback(value);
    }

    useGSAP(() => {
      if (!ref || typeof ref === 'function' || !ref?.current) return;

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
            duration: 0.5,
            ease: 'power2.inOut',
            overwrite: 'auto'
          }
        );
      } else {
        gsap.to(ref.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      }
    }, [is_open, elements]);

    useEffect(() => {
      if (activeIndex >= 0 && itemsRef.current[activeIndex]) {
        itemsRef.current[activeIndex].scrollIntoView({ block: 'nearest' });
      }
    }, [activeIndex]);
    return (
      <>
        {is_rendered && (
          <ul
            className={`dyvix-dropdown-select ${className}`.trim()}
            role="listbox"
            ref={ref}
            style={
              {
                ...(background && {
                  '--dyvix-select-dropdown-color': background
                })
              } as React.CSSProperties
            }
          >
            {is_open &&
              elements.map((element, index) => (
                <li
                  role="option"
                  ref={(ele) => {
                    if (ele) itemsRef.current[index] = ele;
                  }}
                  aria-selected={index === activeIndex}
                  key={`${element}-${index}`}
                  style={
                    index === activeIndex
                      ? {
                          backgroundColor:
                            'var(--dyvix-select-active-bg, #e0f7fa)',
                          color: 'var(--dyvix-select-active-text, #141618)',
                          cursor: 'pointer'
                        }
                      : {}
                  }
                  onMouseDown={(e) => {
                    e.preventDefault();
                    ChangeValue(element);
                  }}
                  onMouseEnter={() => {
                    controller((prevData) => ({
                      ...prevData,
                      activeIndex: index
                    }));
                  }}
                  {...(index === activeIndex && { id: activeOptionId })}
                >
                  {element}
                </li>
              ))}
            {is_open && elements.length === 0 && (
              <li
                role="option"
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
