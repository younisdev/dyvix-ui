import React from 'react';
import './style.css';
import ButtonPlayground from './button/ButtonPlayground';
import { highlight } from 'sugar-high';
import { createPortal } from 'react-dom';

export default function Wrapper({
  children,
  componentConfig,
  componentCallback,
  tag,
  imports
}) {
  const [snippet, setSnippet] = React.useState('');
  const [copied, setCopied] = React.useState(null);
  const [activeConfig, setActive] = React.useState('');
  const [currentConfig, setConfig] = React.useState({});
  const [amount, setAmount] = React.useState(3);
  const [showAdd, SetAdd] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(snippet);
    setCopied(snippet);
    setTimeout(() => setCopied(null), 2000);
  }
  function handleConfigAddition() {
    const currentVal = componentConfig.find(
      (ele) => ele.utility === activeConfig && ele.type === 'config'
    );

    const currentData = {
      ...currentConfig,
      amount: currentConfig.amount || amount
    };

    const isvalid = { status: 1, message: null };

    for (const rule of currentVal['config-rules']) {
      if (rule.required) {
        const format = rule.formats;
        const hasMultiple = format.includes('multiple');
        const data = currentData[rule.rule];

        if (hasMultiple) {
          const isMissingEntry =
            !data ||
            data.length < amount ||
            data.some((v) => !v || v.toString().trim() === '');

          if (isMissingEntry) {
            isvalid.status = -1;
            isvalid.message = `All ${amount} fields for "${rule.rule}" must be filled.`;
            break;
          }
        } else {
          if (!data || data.toString().trim() === '') {
            isvalid.status = -1;
            isvalid.message = `${rule.rule} is required.`;
            break;
          }
        }
      }
    }

    if (isvalid.status === -1) {
      console.error(isvalid.message);
      return;
    }

    componentCallback((prev) =>
      prev.map((item) =>
        item.utility === activeConfig
          ? { ...item, current: [...item.current, currentData] }
          : item
      )
    );

    setActive('');
  }

  function delconfig(index) {
    componentCallback((prev) =>
      prev.map((item) =>
        item.utility === activeConfig
          ? {
              ...item,
              current: item.current.filter((_, i) => i !== index)
            }
          : item
      )
    );
  }

  React.useEffect(() => {
    let curr = `<${tag}\n`;
    for (const ele of componentConfig) {
      if (ele.utility === 'children' || ele.type === 'children') continue;
      const val =
        ele.type === 'config'
          ? JSON.stringify(ele.current, null, 2)
          : ele.current;
      const formattedVal = ele.format === 'string' ? `"${val}"` : `{${val}}`;
      if(formattedVal.includes("!/")) continue;
      curr += ele.current ? `${ele.utility}=${formattedVal}\n` : '';
    }
    curr += '>';
    const children = componentConfig.find((ele) => ele.utility === 'children');
    curr += children?.current ? `\n${children.current}\n</${tag}>` : '';
    setSnippet(curr);
  }, [componentConfig]);
  return (
    <>
      <div className="dyvix-playground-wrapper">
        <div className="dyvix-hud-overlay">
          {componentConfig.map((ele, i) => {
            let currentInput = null;
            if (ele.type === 'select') {
              currentInput = (
                <select
                  className="playground-select"
                  id={`${ele.utility}-${i}`}
                  value={ele.current}
                  onChange={(e) =>
                    componentCallback((prev) =>
                      prev.map((item) =>
                        item.utility === ele.utility
                          ? { ...item, current: e.target.value }
                          : item
                      )
                    )
                  }
                >
                  {ele.allowNull && <option value={"!/"}>None</option>}
                  {Object.entries(ele.options).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </select>
              );
            } else if (ele.type === 'color') {
              currentInput = (
                <input
                  type="color"
                  className="playground-color"
                  onChange={(e) =>
                    componentCallback((prev) =>
                      prev.map((item) =>
                        item.utility === ele.utility
                          ? { ...item, current: e.target.value }
                          : item
                      )
                    )
                  }
                  value={ele.current}
                ></input>
              );
            } else if (ele.type === 'text') {
              currentInput = (
                <input
                  type="text"
                  className="playground-text"
                  onChange={(e) =>
                    componentCallback((prev) =>
                      prev.map((item) =>
                        item.utility === ele.utility
                          ? { ...item, current: e.target.value }
                          : item
                      )
                    )
                  }
                  value={ele.current}
                ></input>
              );
            } else if (ele.type === 'config') {
              currentInput = (
                <>
                  <button
                    className="playground-config-btn"
                    onClick={() => setActive(ele.utility)}
                  >
                    {ele['config-title']}
                  </button>

                  {activeConfig === ele.utility &&
                    createPortal(
                      <div className="playground-config-container">
                        <div className="playground-item-cont">
                          {ele.current.map((val, j) => {
                            const previewText = Object.entries(val).map(
                              ([key, value]) => (
                                <span
                                  className="playgound-config-property"
                                  key={key}
                                >
                                  <span className="playgound-property-key">
                                    {key}
                                  </span>
                                  <span className="playgound-property-value">
                                    {Array.isArray(value)
                                      ? value.join(', ')
                                      : value}
                                  </span>
                                </span>
                              )
                            );
                            return (
                              <span key={j} className="playground-item">
                                <span className="playgound-config-index">
                                  {j + 1}
                                </span>
                                <div className="playground-conf-content">
                                  {previewText}
                                </div>
                                <button
                                  className="playground-config-btn"
                                  onClick={() => delconfig(j)}
                                >
                                  X
                                </button>
                              </span>
                            );
                          })}
                        </div>
                        <div className="config-toolbar">
                          <button
                            className="playground-config-btn"
                            onClick={() => setActive('')}
                          >
                            X
                          </button>
                          <button
                            className="playground-config-btn"
                            onClick={() => SetAdd((prev) => !prev)}
                          >
                            +
                          </button>
                        </div>
                        {showAdd && (
                          <div className="playground-add-config">
                            {ele['config-rules'].map((rule) => {
                              const format = rule.formats;
                              const hasMultiple = format.includes('multiple');
                              const hasOptions = rule.options;
                              const isUnique = format.find(
                                (e) => e === 'unique'
                              );
                              const isAmount = ele['config-rules'].find(
                                (ele) => ele.amount_field === true
                              );
                              const type = format.find(
                                (e) =>
                                  e === 'string' ||
                                  e === 'number' ||
                                  e === 'array'
                              );

                              return (
                                <div
                                  key={rule.rule}
                                  className="config-field-group"
                                >
                                  <label>{rule.rule}</label>
                                  {type === 'number' ? (
                                    <div className="dynamic-input-list">
                                      <input
                                        type="number"
                                        placeholder={rule.rule}
                                        max={rule.max_val}
                                        min={1}
                                        className="playground-text"
                                        defaultValue={amount}
                                        onChange={(e) => {
                                          const val = Math.min(
                                            Number(e.target.value),
                                            rule.max_val
                                          );
                                          const clamped = Math.max(val, 1);
                                          setAmount(clamped);
                                          setConfig((prev) => ({
                                            ...prev,
                                            [rule.rule]: clamped
                                          }));
                                        }}
                                      ></input>
                                    </div>
                                  ) : hasOptions ? (
                                    <div className="dynamic-input-list">
                                      {[
                                        ...Array(
                                          hasMultiple ? Number(amount) : 1
                                        )
                                      ].map((_, index) => (
                                        <select
                                          key={index}
                                          className="playground-select"
                                          onChange={(e) => {
                                            const targetVal = e.target.value;
                                            let currentVal;
                                            setConfig((prev) => {
                                              if (hasMultiple) {
                                                currentVal = prev[rule.rule]
                                                  ? prev[rule.rule]
                                                  : [];
                                                currentVal[index] = targetVal;
                                              } else {
                                                currentVal = targetVal;
                                              }

                                              return {
                                                ...prev,
                                                [rule.rule]: currentVal
                                              };
                                            });
                                          }}
                                        >
                                          <option>None</option>
                                          {Object.entries(hasOptions).map(
                                            ([key, value]) => (
                                              <option key={key} value={value}>
                                                {key}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      ))}
                                    </div>
                                  ) : type === 'string' ? (
                                    <div className="dynamic-input-list">
                                      {[
                                        ...Array(
                                          hasMultiple ? Number(amount) : 1
                                        )
                                      ].map((_, index) => (
                                        <input
                                          key={index}
                                          type="text"
                                          placeholder={`${rule.rule} ${index + 1}`}
                                          className="playground-text"
                                          onChange={(e) => {
                                            const targetVal = e.target.value;
                                            let currentVal;
                                            setConfig((prev) => {
                                              if (hasMultiple) {
                                                currentVal = prev[rule.rule]
                                                  ? prev[rule.rule]
                                                  : [];
                                                currentVal[index] = targetVal;
                                              } else {
                                                currentVal = targetVal;
                                              }
                                              return {
                                                ...prev,
                                                [rule.rule]: currentVal
                                              };
                                            });
                                          }}
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              );
                            })}
                            <button
                              className="playground-config-btn addbtn"
                              onClick={() => handleConfigAddition()}
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>,
                      document.querySelector('.dyvix-playground-wrapper')
                    )}
                </>
              );
            }
            if (currentInput) {
              return (
                <div key={ele.utility} className="dyvix-hud-item">
                  <label htmlFor={`${ele.utility}-${i}`}>{ele.utility}</label>
                  {React.cloneElement(currentInput)}
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className="dyvix-render-zone">
          <span className="dyvix-render-message">Live Preview</span>
          {React.cloneElement(children, {
            ...componentConfig.reduce(
              (acc, curr) => ({
                ...acc,
                [curr.utility]: curr.current
              }),
              {}
            )
          })}
        </div>

        <div className="dyvix-preview-snippet">
          <button onClick={handleCopy} className="dyvix-preview-button">
            {copied ? 'Copied' : 'Copy'}
          </button>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: highlight(snippet) }} />
          </pre>
        </div>
      </div>
    </>
  );
}
