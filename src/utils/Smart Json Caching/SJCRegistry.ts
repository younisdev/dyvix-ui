import globalThemesJSON from '../../themeRegistry/themes.json?raw';
import buttonThemesJSON from '../../components/button/dependencies/themes.json?raw';
import buttonThemesCSS from '../../components/button/dependencies/style/themes.css?raw';
import modalThemesJSON from '../../components/modal/dependencies/themes.json?raw';
import modalThemesCSS from '../../components/modal/dependencies/style/themes.css?raw';
import modalPresetsJSON from '../../components/modal/dependencies/presets.json?raw';
import animationsJSON from '../../components/animations.json?raw';
import fileThemesJSON from '../../components/file/dependencies/themes.json?raw';
import fileThemesCSS from '../../components/file/dependencies/style/themes.css?raw';
import inputTypesJSON from '../../components/input/dependencies/types.json?raw';
import inputThemesJSON from '../../components/input/dependencies/themes.json?raw';
import inputThemesCSS from '../../components/input/dependencies/style/themes.css?raw';
import labelThemesJSON from '../../components/label/dependencies/themes.json?raw';
import labelThemesCSS from '../../components/label/dependencies/style/themes.css?raw';
import tableThemesJSON from '../../components/table/dependencies/themes.json?raw';
import tableThemesCSS from '../../components/table/dependencies/style/themes.css?raw';
import selectThemesJSON from '../../components/select/dependencies/themes.json?raw';
import selectThemesCSS from '../../components/select/dependencies/style/themes.css?raw';
import navThemesJSON from '../../components/nav/dependencies/themes.json?raw';
import navThemesCSS from '../../components/nav/dependencies/style/themes.css?raw';
import toastTypesJSON from '../../components/toast/dependencies/types.json?raw';
import toastPostionsJSON from '../../components/toast/dependencies/positions.json?raw';

export const JSON_LIBRARY: Record<string, string> = {
  '../../themeRegistry/themes.json': globalThemesJSON,
  '../../components/button/dependencies/themes.json': buttonThemesJSON,
  '../../components/modal/dependencies/themes.json': modalThemesJSON,
  '../../components/modal/dependencies/presets.json': modalPresetsJSON,
  '../../components/animations.json': animationsJSON,
  '../../components/file/dependencies/themes.json': fileThemesJSON,
  '../../components/input/dependencies/types.json': inputTypesJSON,
  '../../components/input/dependencies/themes.json': inputThemesJSON,
  '../../components/label/dependencies/themes.json': labelThemesJSON,
  '../../components/table/dependencies/themes.json': tableThemesJSON,
  '../../components/select/dependencies/themes.json': selectThemesJSON,
  '../../components/nav/dependencies/themes.json': navThemesJSON,
  '../../components/toast/dependencies/types.json': toastTypesJSON,
  '../../components/toast/dependencies/positions.json': toastPostionsJSON
};

export const CSS_LIBRARY: Record<string, string> = {
  '../../components/button/dependencies/style/themes.css': buttonThemesCSS,
  '../../components/modal/dependencies/style/themes.css': modalThemesCSS,
  '../../components/file/dependencies/style/themes.css': fileThemesCSS,
  '../../components/input/dependencies/style/themes.css': inputThemesCSS,
  '../../components/label/dependencies/style/themes.css': labelThemesCSS,
  '../../components/table/dependencies/style/themes.css': tableThemesCSS,
  '../../components/select/dependencies/style/themes.css': selectThemesCSS,
  '../../components/nav/dependencies/style/themes.css': navThemesCSS
};
