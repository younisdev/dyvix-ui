import React from 'react';
import SelectEngine from './SelectEngine';
import './dependencies/style/styles.css';
function DynamicSelect({ elements = [], onChangeCallback }) {
  const [Select, SetSelect] = React.useState({
    is_rendered: true,
    is_open: false,
    elements: [],
    selected: ''
  });
  const selectRef = React.useRef(null);
  const dropdownSelectRef = React.useRef(null);

  function onChangeInternalCallback(data) {
    onChangeCallback(data);
  }

  const PopulateSelect = (value, controller, elementArray) => {
    value = value.toLowerCase();

    if (!value) {
      controller((prevData) => ({
        ...prevData,
        is_open: false
      }));
      return;
    }

    const result = elementArray.filter((element) => {
      const items = element.trim().toLowerCase();
      const query = value.trim().toLowerCase();

      return items.startsWith(query);
    });

    if (result.length == 0) {
      controller((prevData) => ({
        ...prevData,
        elements: [],
        is_open: false
      }));

      return;
    }

    controller((prevData) => ({
      ...prevData,
      elements: result,
      is_open: true
    }));
  };

  return (
    <div id="dyvix-select-warper">
      <input
        className="dyvi-select"
        type="text"
        ref={selectRef}
        onChange={(e) => {
          PopulateSelect(e.target.value, SetSelect, elements);
          onChangeInternalCallback(e.target.value);
        }}
      />
      <SelectEngine
        elements={Select.elements}
        is_open={Select.is_open}
        is_rendered={Select.is_rendered}
        inputRef={selectRef}
        ref={dropdownSelectRef}
        controller={SetSelect}
        OnChangeCallback={onChangeCallback}
      />
    </div>
  );
}

export default DynamicSelect;
