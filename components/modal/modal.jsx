import elementsData from "./dependencies/elements.json"
import SelectEngine from "../select/SelectEngine";
import "./dependencies/style/elements.css"
import React from "react";

const defaultElement = {type: "!", placeholder: ["!"], id: "!",   className: "!", amount: 1 };
const supportedTypes = ["text", "select", "email", "password", "search", "url", "tel"]
const componentsMap = {"SelectEngine": SelectEngine};

function Modal({title, type, elements, animation, Id, Class, onSubmit})
{
  const [data, SetData] = React.useState({});
  const fields = SerializeData(title, type, elements, animation, Id, Class, onSubmit); 

  function handelInputChange(name, value)
  {
    SetData(prev => ({...prev, [name]: value}))
  }
  
  if(fields === null)
  {
    return null;
  }

  //console.log(fields);
  //console.log(elementsData);
  return (
    <>
      <div className={Class} id={Id}>
        <h3 id="modal-header">{title}</h3>
    
        {fields.map((field, i) => {
          const elementDef = elementsData.find(e => e.element === field.type) || elementsData.find(e => e["inherited-element"]?.includes(field.type));
          const Tag = elementDef.is_custom? componentsMap[elementDef.tag] : elementDef.tag;

          return(
            <div className="grouped-elements" key={field.id || i} >
              {Array.from({ length: field.amount }, (_, j) => {
                  const name = Array.isArray(field.name) ? field.name[j] : field.name
                  const Tagprobs = {
                    className: elementDef["default-class"],
                    role: elementDef.aria.role,
                    ...(elementDef["supports-placeholder"] && ({placeholder: Array.isArray(field.placeholder) ? field.placeholder[j] : field.placeholder })),
                    ...(elementDef["tag-type"] && ({ type: elementDef["tag-type"] }))
                  }
                  return <Tag key={j} {...Tagprobs} onChange={(e) => handelInputChange(name, e.target.value)} />
              })
              }
              
            </div>
          )
        })}
        <button className="modal-btn" onClick={()=> onSubmit(data)}>Submit</button>
      </div>
    </>
  )
}

function SerializeData(title, type, elements, animation, Id, Class, onSubmit)
{
  const validator = ValidateInput(title, type, elements, animation, Id, Class, onSubmit)

    if(validator.status !== 1)
    {
      console.error(validator.error)
      return null
    }

    const normalizedElements = elements.map(ele => ({...defaultElement, ...ele}));
    const eleValidator =  validateElements(normalizedElements);

    if(eleValidator.status !== 1)
    {
      console.error(eleValidator.error)
      return null
    }

    return normalizedElements; 
}
function ValidateInput(title, type, elements = [], animation, Id, Class, onSubmit)
{
  if(!title)
  {
    return {status: -1, error: "Please provide a title"};
  }
  if (!Array.isArray(elements) || !elements.every(ele => typeof ele === 'object'))
  {
    return {status: -1, error: "Element should be provided as an array of objects."};
  }
  if(animation && typeof animation === 'string')
  {
    // todo when you figure out animations configue you need to write a great validation here
  }

  if(onSubmit !== null && typeof onSubmit !== 'function')
  {
    return {status: -1, error: "onSubmit should be provided as a function."};
  }

  return  {status: 1};
}
function validateElements(elements)
{      

  for(const element of elements)
  {
    if(!supportedTypes.includes(element.type))
    {       
      return {status: -1, error: "Elements should include a valid type."};
    }
    if(element.amount < 1 || element.amount > 3)
    {
      return {status: -1, error: "Element amount should be positive and less than 3."};
    }
    else if (element.amount > 1)
    {
      if (!Array.isArray(element.placeholder) || element.placeholder.length !== element.amount)
      {
        return {status: -1, error: "Element placeholder should be provided as an array of the same length as the provided amount."};
      }
      if (!Array.isArray(element.name) || element.name.length !== element.amount)
      {
        return {status: -1, error: "Element name should be provided as an array of the same length as the provided amount."};
      }
    }
    else
    {
      if(typeof element.placeholder !== "string")
      {
        return {status: -1, error: "Element placeholder should be provided as string when the amount is set to 1."};
      }
      if(typeof element.name !== "string")
      {
        return {status: -1, error: "Element name should be provided as string when the amount is set to 1."};
      }
    }
  };

  return  {status: 1};
}

export default Modal;