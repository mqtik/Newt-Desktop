import React from 'react';
import { remote } from "electron";
const { Menu } = remote;

import Popover, { ArrowContainer } from 'react-tiny-popover'

export interface ContextMenuAreaProps {
  menuItems: any;
  style?: any;
}
//nnconst _menu = new Menu();

// const ContextMenuArea = ({ menuItems, children }) => {
//   const [visible, show] = useState(false);

//   return (
//     <Popover
//                   isOpen={visible}
//                   position={'bottom'} // preferred position
//                   transitionDuration={0}
//                   align="center"
//                   onClickOutside={() => setLang(!visible)}
//                   content={({ position, targetRect, popoverRect }) => (
//                       <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
//                           position={'bottom'}
//                           targetRect={targetRect}
//                           popoverRect={popoverRect}
//                           arrowColor={'#000'}
//                           arrowSize={10}
//                           arrowStyle={{ opacity: 1 }}
//                       >
//                         <div className="navUserOptions"  style={{width: 120}}>
//                             <div>
//                         <a style={{width:'auto'}} onClick={() => console.log("t")}>Test</a>  
//                       </div>
                      

//                     </div>
//                       </ArrowContainer>    
//                      )}
//               >
//               <div className="switch-language-nav" onClick={() => show(true)}>
//                 {children}
//               </div>

//               </Popover>
//         )
// }

export class ContextMenuArea extends React.PureComponent {
  constructor(props){
    super(props);

    this.state = {
      visible: false
    }
  }
  

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
      <Popover
                  isOpen={this.state.visible}
                  position={['bottom', 'top']} // preferred position
                  transitionDuration={0}
                  //align="center"
                  onClickOutside={() => this.setState({visible: !this.state.visible}) }
                  content={({ position, targetRect, popoverRect }) => (
                      <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                          //position={['bottom', 'top']}
                          targetRect={targetRect}
                          popoverRect={popoverRect}
                          arrowColor={'#fff'}
                          arrowSize={10}
                          arrowStyle={{ opacity: 1 }}
                      >

                       <div className="popoverContextNewt"  style={{width: this.props.width || 120}}>
                        {
                          this.props.menuItems && this.props.menuItems.map((i,j) => {
                            return (
                                <a key={j.toString()} style={{}} onClick={() => i.click()}>{i.label}</a>  
                              )
                          })
                        }
                         </div>
                      </ArrowContainer>    
                     )}
              >
              <div className="" style={{float:'left'}} onClick={() => this.setState({visible: !this.state.visible})}>
                {this.props.children}
              </div>

       </Popover>
    );
  }
}


export default ContextMenuArea;