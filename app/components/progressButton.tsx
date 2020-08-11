import React, { useState } from 'react';
import { remote } from "electron";

export class ProgressButton extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: "0%"
    };
  }
  handleClick = async() => {
      this.setState({
        progress: "100%" 
      })

      this.props.onClick();
      setTimeout(() => {
        this.setState({
        progress: "0%" 
      })
      }, 300)
      
  }
  render() {
    const styles = {
      width: this.state.progress
    };
    return (
        <div className="progress-container" onClick={() => this.handleClick()}>
          <span style={{zIndex:2}}>Save</span>
          <div className="bar" style={styles} />
        </div>

    );
  }
}