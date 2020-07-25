import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import { DEFAULT_LANG_OPTS } from "./options";
import Result from "./Result";

function sampleProgram(
  commentPrefix: string,
  whileKeyword: string,
  blockStyle: string
): string {
  if (blockStyle == "curly") {
    return `${commentPrefix} A starter to whet your appetite.
(print "hello world\\n")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 1)
(${whileKeyword} (lte i 20) {
  if (equal (mod i 15) 0) {
    (print "FizzBuzz\\n")
  } else {
    if (equal (mod i 5) 0) {
      (print "Buzz\\n")
    } else {
      if (equal (mod i 3) 0) {
        (print "Fizz\\n")
      } else {
        (print i)
        (print "\\n")
      }
    }
  }
  (set i (add i 1))
})`;
  } else {
    return `${commentPrefix} A starter to whet your appetite.
(print "hello world\\n")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 1)
(${whileKeyword} (lte i 20)
  (do
    (if (equal (mod i 15) 0)
        (print "FizzBuzz\\n")
      (if (equal (mod i 5) 0)
          (print "Buzz\\n")
        (if (equal (mod i 3) 0)
            (print "Fizz\\n")
          (do (print i) (print "\\n")))))
    (set i (add i 1))))`;
  }
}

const App: React.FC = () => {
  const [opts, setOpts] = useState(DEFAULT_LANG_OPTS);

  const [blockStyle, setBlockStyle] = useState("do");

  const [src, setSrc] = useState(
    sampleProgram(opts.commentPrefix, opts.whileKeyword, blockStyle)
  );

  const parser = buildParser(opts, blockStyle);

  const result = parser.Program.parse(src);

  let errorRange = null;
  if (!result.status) {
    const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    const endPos = { line: result.index.line - 1, ch: result.index.column };

    errorRange = [pos, endPos];
  }

  return (
    <div>
      <LexerOptions
        opts={opts}
        setCommentPrefix={(s: string) => setOpts(opts.set("commentPrefix", s))}
        setTrueKeyword={(s: string) => setOpts(opts.set("trueKeyword", s))}
        setFalseKeyword={(s: string) => setOpts(opts.set("falseKeyword", s))}
        blockStyle={blockStyle}
        setBlockStyle={setBlockStyle}
        setWhileKeyword={(s: string) => setOpts(opts.set("whileKeyword", s))}
      />
      <div className="box">
        <h2 className="title">Write Code 🍳</h2>
        <CodeMirrorTag
          initialValue={sampleProgram(
            opts.commentPrefix,
            opts.whileKeyword,
            blockStyle
          )}
          commentPrefix={opts.commentPrefix}
          trueKeyword={opts.trueKeyword}
          falseKeyword={opts.falseKeyword}
          whileKeyword={opts.whileKeyword}
          onChange={setSrc}
          errorRange={errorRange}
        />
      </div>
      <Result src={src} parser={parser} />
    </div>
  );
};
export default App;
