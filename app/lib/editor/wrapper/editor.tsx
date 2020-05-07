import assign from 'object-assign';
import blacklist from 'blacklist';
import React from 'react';

if (typeof document !== 'undefined') {
  var MediumEditor = require('mqtik/medium-editor/dist/js/medium-editor.min.js');
}

export default class ReactMediumEditor extends React.Component {
  static defaultProps = {
    tag: 'div'
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text
    };

  }

  componentDidMount() {
    this.medium = new MediumEditor(this.dom, this.props.options);
    this.medium.subscribe('editableInput', async(e) => {
      this._updated = true
      this.change(this.dom.innerHTML);
    });
  }

  componentDidUpdate() {
    this.medium.restoreSelection();
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.dom.innerHTML;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text && !this._updated) {
      this.setState({ text: nextProps.text });
    }

    if (this._updated) this._updated = false;
  }

  render() {
    const tag = this.props.tag;
    const props = blacklist(this.props, 'options', 'text', 'tag', 'contentEditable', 'dangerouslySetInnerHTML');
    props.ref = node => this.dom = node;

    assign(props, {
      dangerouslySetInnerHTML: { __html: this.state.text }
    });

    if (this.medium) {
      this.medium.saveSelection();
    }

    return React.createElement(tag, props);
  }

  change = (text) => {
    if (this.props.onChange) {
      return this.props.onChange(text);
    } else {
      return null;
    }
  }
}