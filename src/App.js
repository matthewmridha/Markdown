import React from 'react';
import './App.css';
import marked from "marked";
// eslint-disable-next-line no-unused-vars
import { faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";
// eslint-disable-next-line no-unused-vars
import { faCompressArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/* 
Takes text input in the editor section;
displays given text after marking it down in th preview section.
\\\ MARKED : https://github.com/markedjs/marked ///
\\\ SANITIZER : https://github.com/cure53/DOMPurify ///
*/

/////\\\\\ MARKED SETTINGS /////\\\\\

// Allows for line break on press enter for marked text

marked.setOptions({
  breaks : true
});

// Links open in new tab

const renderer = new marked.Renderer();
renderer.link = function( href, text ) {
  return `<a target="_blank" href="${href}">${text} "</a>`;
};

// Hides blue focus ring ("body.usingMouse");
// Detects tab press and brings back focus ring for accessibility (":focus")

document.body.addEventListener( "mousedown", function() {
  document.body.classList.add( "usingMouse" );
});
document.body.addEventListener( "keydown", function() {
  document.body.classList.remove( "usingMouse" );
});

/////\\\\\ MAIN /////\\\\\

// Root component manages all states(input,),
// runs sanitize on input,
// sends props to and renders components.

class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      input: placeholder,
      previewMax: false,
      editorMax: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onEditorMax = this.onEditorMax.bind(this);
    this.onPreviewMax = this.onPreviewMax.bind(this);
  }
  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }
  ///* sets state.input and editor to empty *///
  onClear() {
    this.setState({
      input: ""
    });
  }
  ///* sets state.input and editor back to default placeholder text *///
  onReset() {
    this.setState({
      input: placeholder
    });
  }
  ///* changes boolean state of state.editorMax to expand or contract the editor *///
  onEditorMax() {
    this.setState({
      editorMax: !this.state.editorMax
    });
  }
  ///* changes boolean state of state.previewMax to expand or contract the previewer *///
  onPreviewMax() {
    this.setState({
      previewMax: !this.state.previewMax
    });
  }
  render() {
    
    /* toggles classes to allow maximizing and resetting elements */
    
    const CLASSES = this.state.editorMax ? 
          [
            "DisplayArea max",
            "DisplayArea hide",
            faCompressArrowsAlt
          ] : this.state.previewMax ?
          [
            "DisplayArea hide",
            "DisplayArea max",
            faCompressArrowsAlt
          ] :
          [
            "DisplayArea",
            "DisplayArea",
            faExpandArrowsAlt
          ]
    
    return (
      <div className="container">
        
        {/* HEADER */}
        
        <div className="header">
          <header>
            <h1>Markdown Previewer</h1>
          </header>
        </div>
        
        {/* FLEX WRAP */}
        
        <div className="FlexBox">
          
          {/* EDITOR SECTION */}
          
          <div className={ CLASSES[0] }>
            
            {/* TOOLBAR */}
            
            <div className="ToolBar">
              <div className="ToolBarLeft">
                <h3 className="SubHeader">Editor</h3>
              </div>
              <div className="ToolBarRight">
                <button id="CLR-BTN" 
                  className="Btn" 
                  onClick={ this.onClear }>
                  clear
                </button>
                <button 
                  id="RST-BTN" 
                  className="Btn" 
                  onClick={this.onReset}>
                  reset
                </button>
                <button 
                  className="SizeBtn" 
                  onClick={ this.onEditorMax }>
                  <FontAwesomeIcon icon={CLASSES[2]} />
                </button>
              </div>
            </div>
            
            {/* CONTENT */}
            
            <Editor 
              input = { this.state.input } 
              onChange = { this.handleChange } 
            />
          </div>
          
          {/* PREVIEW SECTION */}
          
          <div id="Preview" className={ CLASSES[1] }>
            
            {/* TOOLBAR */}
            
            <div className="ToolBar">
              <div className="ToolBarLeft">
                <h3 className="SubHeader">Preview</h3>
              </div>
              <div className="ToolBarRight">
                <button 
                  className="SizeBtn"
                  onClick = { this.onPreviewMax } >
                    <FontAwesomeIcon icon={ CLASSES[2] }/> 
                </button>
              </div>
            </div>
            
            {/* CONTENT */}
            
            <Preview 
              input = { this.state.input } 
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  };
};

// Editor component takes input in text area,
// sends input to Root
// displays input state from Root.

const Editor = ( props ) => {
    return (
      <textarea
        id="editor"
        value = { props.input }
        onChange = { props.onChange }
      />
    );
}

// Preview component takes sanitized and marked output prop from Root,
// displays output prop as rendered HTML

const Preview = ( props ) => {
    return (
      <div
        id="preview"
        dangerouslySetInnerHTML = {{
          __html: marked( props.input, { renderer: renderer } )
        }}
      />
    );
};

const Footer = () => {
  return (
    <footer>
      Marking function : <a href="https://github.com/markedjs/marked" target="_blank" rel="noopener noreferrer">marked.js</a>
    </footer>

  )
};


// Placeholder for initial state.

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;




export default App;
