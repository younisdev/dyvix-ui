import propsMap from '../registry/props.json';

type ClassType = string | undefined;

export function ConstructClasses(...classes: ClassType[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SplitPropsResult {
  wrapperProps: Record<string, any>;
  elementProps: Record<string, any>;
}

const WRAPPER_PROPS_MAP = new Set(propsMap.wrapperProps);
const WRAPPER_STYLE_MAP = new Set(propsMap.wrapperStyleKeys);

export function SmartPropsSplitting(
  props: Record<string, any>
): SplitPropsResult {
  const { style, ...rest } = props;
  const resolvedElementStyles: Record<string, any> = {};
  const resolvedWrapperStyles: Record<string, any> = {};
  const resolvedElementProps: Record<string, any> = {};
  const resolvedWrapperProps: Record<string, any> = {};

  if (style && typeof style === 'object') {
    for (const key in style) {
      if (Object.prototype.hasOwnProperty.call(style, key)) {
        if (WRAPPER_STYLE_MAP.has(key)) {
          resolvedWrapperStyles[key] = style[key];
        } else {
          resolvedElementStyles[key] = style[key];
        }
      }
    }
  }

  if (rest && typeof rest === 'object') {
    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        if (WRAPPER_PROPS_MAP.has(key)) {
          resolvedWrapperProps[key] = rest[key];
        } else {
          resolvedElementProps[key] = rest[key];
        }
      }
    }
  }

  return {
    wrapperProps: {
      style: {
        ...resolvedWrapperStyles
      },
      ...resolvedWrapperProps
    },
    elementProps: {
      style: {
        ...resolvedElementStyles
      },
      ...resolvedElementProps
    }
  };
}
