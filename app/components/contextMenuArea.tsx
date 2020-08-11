import React from 'react';
import { remote } from "electron";
const { Menu } = remote;

export interface ContextMenuAreaProps {
  menuItems: Electron.MenuItemConstructorOptions[];
  style?: any;
}
const _menu = new Menu();

export class ContextMenuArea extends React.PureComponent {
  
  

  // componentDidMount() {


  //   this._menu = Menu.buildFromTemplate(this.props.menuItems);

  //   this._rootElement!.addEventListener(
  //     "mousedown",
  //     e => {
  //       e.preventDefault();
  //       //self._rightClickPosition = { x: e.x, y: e.y };
  //       this._menu.popup({ window: remote.getCurrentWindow() });
  //     },
  //     true
  //   );
  // }

  render() {
    return (
      <div style={{ ...this.props.style }} ref={ref => (this._rootElement = ref)}>
        {this.props.children}
      </div>
    );
  }
}

export default ContextMenuArea;