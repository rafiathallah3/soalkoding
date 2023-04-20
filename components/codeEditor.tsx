import React from 'react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import 'ace-builds/src-noconflict/snippets/python';
import "ace-builds/src-noconflict/ext-language_tools";

//Perlu
export default function CodeEditor({ refData, mode, value, onChange, autoComplete = true, placeholder = "" }: { refData: any, mode: string, value: string, onChange: any, autoComplete?: boolean, placeholder?: string }) {
    return (
        <AceEditor
            placeholder={placeholder}
            mode={mode}
            theme="tomorrow_night_eighties"
            name="kodingeditor"
            value={value}
            showGutter={true}
            readOnly={false}
            onChange={onChange}
            showPrintMargin={false}
            style={{ height: '100%', width: "100%" }}
            ref={refData}
            // ref={instance => { ace = instance; }} // Let's put things into scope
            editorProps={{$blockScrolling: Infinity}}
            setOptions={{
                enableBasicAutocompletion: autoComplete,
                enableLiveAutocompletion: autoComplete,
                highlightActiveLine: false, 
                enableSnippets: true,
                showLineNumbers: true,
                wrap: false,
                fontSize: "12pt",
                tabSize: 4
            }}
        />
        
    );
}