import 'regenerator-runtime/runtime'

import * as React from 'react'


import fs from 'fs';
import assign from 'object-assign';
import blacklist from 'blacklist';

import EditorNewt from '../base/base-editor';

import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import API from '../../../services/api.tsx';

const {clipboard} = require('electron')

var loadBase64Image = function (url) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            return {image, base64prefix}
        } else {
            throw new Error('Can not download image');
        }
    });
};

const Remote = new API({url: 'image'})
export const EDITOR_JS_TOOLS = {
  logLevel: 'ERROR',
  embed: {
      class: Embed,
      inlineToolbar: true,
      config: {
        services: {
          youtube: true,
          coub: true
        }
      }
    },
  table: {
    inlineToolbar: true,
    class:Table
  },
  paragraph: {
    class:Paragraph,
    config: {
        placeholder: 'Tell your story...'
      },
    placeholder: 'Tell your story...',
    inlineToolbar: true
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  warning: {
    inlineToolbar: true,
    class:Warning
  },
  code: {
    class:Code,
    inlineToolbar: true
  },
  linkTool: {
    class:LinkTool,
    inlineToolbar: true,
    config: { 
        endpoint: 'https://newt.keetup.com/api/creators/scraplink', // Your backend endpoint for url data fetching
      }
  },
  image: {
    class: Image,
    inlineToolbar: true,
    config: {
      uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByFile(file){

            console.log("uploadbyfile!",file)
            let bitmap;
            if(file.path != '' && file.path != null){
              bitmap = fs.readFileSync(file.path).toString('base64');
            } else {
              bitmap = clipboard.readImage("clipboard").toDataURL().replace(/^data:image\/[a-z]+;base64,/, "");
              //var bitmap = fs.writeFileSync("test.png", image.toPNG());
              //console.log("bitttt!",image)

            }


            let data = {
              type: file.type,
              name: file.name,
              size: file.size,
              data: bitmap,
              path: file.path
            };

          console.log("bittttt!!!",data)

            // convert binary data to base64 encoded string
           // return new Buffer(bitmap).toString('base64');
            // your own uploading logic here
            return Remote.Work().drafts().chapters().addImgContent(data).then((res) => {

              return {
                success: 1,
                file: {
                  url: 'https://static.newt.keetup.com/contents/'+res.objects.filename,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              };
            });
          },
          uploadByUrl(url){

            let bit = loadBase64Image(url)
            console.log("upload byurl!", bit)
           

            // convert binary data to base64 encoded string
           // return new Buffer(bitmap).toString('base64');
            // your own uploading logic here
            let bitmap;
            const fileUrl = new URL(url);
            bitmap = fs.readFileSync(fileUrl).toString('base64');
            //let myBase64 = toDataUrl(url)
              console.log(Remote, bitmap); // myBase64 is the base64 string
              bitmap = bitmap.replace(/^data:image\/[a-z]+;base64,/, "");
              let data = {
                type: "image/jpg",
                name: 'i',
                size: 0,
                data: bitmap,
                path: ''
              };

              return Remote.Work().drafts().chapters().addImgContent(data).then((res) => {
                return {
                  success: 1,
                  file: {
                    url: 'https://static.newt.keetup.com/contents/'+res.objects.filename,
                    // any other image data you want to store, such as width, height, color, extension, etc
                  }
                };
              });
            
          },
        }
      }
  },
  raw: {
    inlineToolbar: true,
    class:Raw
  },
  header: {
    class: Header,
    inlineToolbar: true
  },
  quote: {
    class:Quote,
    inlineToolbar: true
  },
  marker: {
    class:Marker,
    inlineToolbar: true
  },
  checklist: {
    class:CheckList,
    inlineToolbar: true
  },
  delimiter: {
    inlineToolbar: true,
    class:Delimiter
  },
  inlineCode: {
    class:InlineCode,
    inlineToolbar: true
  },
  simpleImage: {
    inlineToolbar: true,
    class:SimpleImage
  }
}


 export default class NewtEditor extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {

    //console.log("should component change?", this.props.text.blocks != nextProps.text.blocks,this.props.text, nextProps.text)
    //return false;

    if(this.props.text !== nextProps.text){
      return true;
    }  else {
      return false;
    }
  }


  handleChange = async() => {
    let t = await this.instanceRef.save();
    //console.log("handle channge!", t)
    return this.props.onChange(t);
  }
  render() {
    /*const tag = this.props.tag;
    const props = blacklist(this.props, 'options', 'text', 'tag', 'contentEditable', 'dangerouslySetInnerHTML');
    props.ref = node => this.dom = node;

    assign(props, {
      dangerouslySetInnerHTML: { __html: this.state.text }
    });

    if (this.medium) {
      this.medium.saveSelection();
    }*/
    //console.log("newt editor", this.props)
    return <EditorNewt enableReInitialize={true} data={this.props.text} instanceRef={instance => (this.instanceRef = instance)}  onChange={() => this.handleChange()} tools={EDITOR_JS_TOOLS} />;
    //return React.createElement(tag, props);
  }

  change = (text) => {
    if (this.props.onChange) {
      return this.props.onChange(text);
    } else {
      return null;
    }
  }
}