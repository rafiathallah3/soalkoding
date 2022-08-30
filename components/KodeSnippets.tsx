import { CodeBlock, monokai } from "react-code-blocks";
import React from 'react';

export default function Kode({bahasa, children}: {bahasa: any, children: any}) {
    console.log(children)
    return (
        <CodeBlock
            text={children.props.children.trim()}
            language={bahasa}
            showLineNumbers={false}
            theme={monokai}
            wrapLines={true}
        />
    )    
}

// export class Kode extends React.Component<{children: any, bahasa: string}> {
//     constructor(props: any) {
//         super(props);
//         console.log(props);
//     }

//     render() {
//         return (
//             <CodeBlock
//                 text={this.props.children}
//                 language={this.props.bahasa}
//                 showLineNumbers={false}
//                 theme={monokai}
//                 wrapLines={true}
//             />
//         )
//     }
// }