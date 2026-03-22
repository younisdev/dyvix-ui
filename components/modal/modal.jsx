import elementsData from "./dependencies/elements.json"
import themesData from "./dependencies/themes.json"
import SelectEngine from "../select/SelectEngine";
import animationsData from "../animations.json";
import "./dependencies/style/elements.css"
import "./dependencies/style/themes.css"
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const vaildThemes = themesData.map(e => e.theme);
const validAnimations = animationsData.map(e => e.animation);
const defaultElement = {type: "!", placeholder: ["!"], id: "!",   className: "!", amount: 1 };
const supportedTypes = ["text", "select", "email", "password", "search", "url", "tel"]
const componentsMap = {"SelectEngine": SelectEngine};

function Modal({title, type, elements, theme = "Singularity", animation = "fade", Id, Class, onSubmit})
{
  const [data, SetData] = React.useState({});
  const fields = SerializeData(title, type, elements, theme, animation, Id, Class, onSubmit); 
  const modalRef = React.useRef(null);

  function handleInputChange(name, value)
  {
    SetData(prev => ({...prev, [name]: value}))
  }
  
  if(fields === null)
  {
    return null;
  }

  const currentTheme = themesData.find(e => e.theme === theme);
  const currentAnimation = animationsData.find(e => e.animation === animation);
  const serilaizedClass = Class + ` ${currentTheme.class}`;
  const rowOffset = elements.length / 4;
  const dynamicHeight = rowOffset > 1 ? `${30 + (rowOffset - 1) * 15}rem` : "30rem";
  const dynamicWidth = currentTheme.radiused || rowOffset > 1  ? `${30 + rowOffset * 10}rem` : "30rem";

  useGSAP(()=> {
    gsap.fromTo(modalRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation["default-duration"],
      ease: currentAnimation.ease,
      clearProps: "transform"
    })
  }, []);

  return (
    <>
      <div className={serilaizedClass} id={Id} ref={modalRef} style={{height: dynamicHeight, width: dynamicWidth}}>
        <h3 id="modal-header">{title}</h3>
        {fields.map((field, i) => {
          const elementDef = elementsData.find(e => e.element === field.type) || elementsData.find(e => e["inherited-element"]?.includes(field.type));
          const Tag = elementDef.is_custom? componentsMap[elementDef.tag] : elementDef.tag;

          // Safely get base aria props with defensive check for undefined/null
          let ariaProps = elementDef.aria ? { ...elementDef.aria } : {};
          
          // Apply inherit-overrides if the element type has specific overrides
          // Safe navigation to prevent errors if nested properties are missing
          const overrideConfig = elementDef["inherit-overrides"]?.[field.type];
          if (overrideConfig && overrideConfig.aria) {
            ariaProps = { ...ariaProps, ...overrideConfig.aria };
          }

          return(
            <div className="grouped-elements" key={field.id || i} >
              {Array.from({ length: field.amount }, (_, j) => {
                  const name = field.name[j]
                  
                  // Build aria props object - only include defined values to avoid passing undefined attributes
                  const ariaAttributes = {};
                  if (ariaProps.role !== undefined && ariaProps.role !== null) {
                    ariaAttributes.role = ariaProps.role;
                  }
                  if (ariaProps["aria-label"] !== undefined && ariaProps["aria-label"] !== null) {
                    ariaAttributes["aria-label"] = ariaProps["aria-label"];
                  }
                  if (ariaProps["aria-required"] === true || ariaProps["aria-required"] === false) {
                    ariaAttributes["aria-required"] = ariaProps["aria-required"];
                  }

                  const Tagprobs = {
                    className: elementDef["default-class"],
                    ...ariaAttributes,
                    name: name,                    
                    ...(elementDef["supports-placeholder"] && ({placeholder: field.placeholder[j]})),
                    ...(elementDef["supports_type"] && ({type: field.type})),
                    ...(elementDef["supports_autocomplete"] && ({autoComplete: field.type === "password" ? "current-password": "on"}))
                  }
                  return <Tag key={j} {...Tagprobs} onChange={(e) => handleInputChange(name, e.target.value)} />
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

function SerializeData(title, type, elements, theme, animation, Id, Class, onSubmit)
{
  const validator = ValidateInput(title, type, elements, theme, animation, Id, Class, onSubmit);

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

    return normalizeElements(normalizedElements); 
}
function ValidateInput(title, type, elements, theme, animation, Id, Class, onSubmit)
{
  if(!title)
  {
    return {status: -1, error: "Please provide a title"};
  }
  if (!Array.isArray(elements) || !elements.every(ele => typeof ele === 'object'))
  {
    return {status: -1, error: "Element should be provided as an array of objects."};
  }
  if(!validAnimations.includes(animation))
  {
    return {status: -1, error: "Please provide a vaild animation."};
  }
  if(!vaildThemes.includes(theme))
  {
    return {status: -1, error: "Please provide a vaild theme."};
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
      if(!(typeof element.placeholder === "string" || (Array.isArray(element.placeholder) && element.placeholder.length === 1)))
      {
        return {status: -1, error: "Element placeholder should be a string or an array of length 1."};
      }
      if(!(typeof element.name === "string" || (Array.isArray(element.name) && element.name.length === 1)))
      {
        return {status: -1, error: "Element name should be a string or an array of length 1."};
      }
    }
  };

  return  {status: 1};
}

function normalizeElements(elements)
{
  return elements.map(ele => ({
    ...ele,
    placeholder: typeof ele.placeholder === "string" ? [ele.placeholder] : ele.placeholder,
    name: typeof ele.name === "string" ? [ele.name] : ele.name
  }));
}
export default Modal;