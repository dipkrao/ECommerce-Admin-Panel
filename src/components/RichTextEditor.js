import React, { useState, useRef, useEffect } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  LinkIcon,
  UnlinkIcon,
} from "lucide-react";

// Strip Unicode RTL/LTR control characters that cause reversed text
const stripBidiControls = (html) => {
  if (typeof html !== "string") return "";
  return html.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
};

// Ensure value is always a string (avoid [object Object] when content is an object)
const ensureString = (v) => {
  if (typeof v === "string") return v;
  if (v != null && typeof v === "object") {
    if (typeof v.html === "string") return v.html;
    if (typeof v.text === "string") return v.text;
    if (typeof v.content === "string") return v.content;
  }
  return "";
};

const RichTextEditor = ({ value, onChange, placeholder, rows = 20 }) => {
  const editorRef = useRef(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const stringValue = ensureString(value);

  // Force LTR at DOM level so typing is never reversed (e.g. "test" not "tset")
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.setAttribute("dir", "ltr");
    el.setAttribute("lang", "en");
    el.style.direction = "ltr";
    el.style.textAlign = "left";
    el.style.unicodeBidi = "isolate";
  }, [stringValue]);

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHTML = (html) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = html;
      const fragment = document.createDocumentFragment();
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
      range.insertNode(fragment);
    }
  };

  const notifyChange = (html) => {
    const str = typeof html === "string" ? stripBidiControls(html) : "";
    onChange(str);
  };

  const handleInput = (e) => {
    const html = e.target?.innerHTML;
    notifyChange(html);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") ?? "";
    const plainText = typeof text === "string" ? text : "";
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const fragment = document.createDocumentFragment();
      const lines = plainText.split(/\r?\n/);
      lines.forEach((line, i) => {
        fragment.appendChild(document.createTextNode(line));
        if (i < lines.length - 1) fragment.appendChild(document.createElement("br"));
      });
      range.insertNode(fragment);
    }
    const html = editorRef.current?.innerHTML ?? "";
    notifyChange(html);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      insertHTML("<br>");
    }
  };

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
  };

  const toolbarButtons = [
    {
      icon: Heading1Icon,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
    },
    {
      icon: Heading2Icon,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
    },
    {
      icon: Heading3Icon,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
    },
    { icon: BoldIcon, command: "bold", title: "Bold" },
    { icon: ItalicIcon, command: "italic", title: "Italic" },
    { icon: UnderlineIcon, command: "underline", title: "Underline" },
    { icon: ListIcon, command: "insertUnorderedList", title: "Bullet List" },
    {
      icon: ListOrderedIcon,
      command: "insertOrderedList",
      title: "Numbered List",
    },
    {
      icon: QuoteIcon,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar Toggle */}
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <button
          type="button"
          onClick={toggleToolbar}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isToolbarVisible ? "Hide" : "Show"} Formatting
        </button>
      </div>

      {/* Rich Text Toolbar */}
      {isToolbarVisible && (
        <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button) => (
              <button
                key={button.command + (button.value || "")}
                type="button"
                onClick={() => execCommand(button.command, button.value)}
                title={button.title}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 transition-colors"
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}

            {/* Link Button */}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter URL:");
                if (url) {
                  execCommand("createLink", url);
                }
              }}
              title="Insert Link"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* Unlink Button */}
            <button
              type="button"
              onClick={() => execCommand("unlink")}
              title="Remove Link"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 transition-colors"
            >
              <UnlinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wrapper forces LTR context so typing is never reversed */}
      <div dir="ltr" lang="en" style={{ direction: "ltr", unicodeBidi: "isolate" }} className="rounded-md">
        <div
          ref={editorRef}
          id="rich-text-editor"
          contentEditable
          dir="ltr"
          lang="en"
          dangerouslySetInnerHTML={{ __html: stripBidiControls(stringValue) }}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[400px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 max-w-none text-left"
          style={{
            minHeight: `${rows * 1.5}rem`,
            maxHeight: "600px",
            overflowY: "auto",
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "isolate",
          }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• Use the formatting toolbar above to style your content</p>
        <p>
          • You can also use keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic),
          Ctrl+U (Underline)
        </p>
        <p>• Press Shift+Enter for line breaks</p>
        <p>• HTML tags are supported for advanced formatting</p>
      </div>
    </div>
  );
};

export default RichTextEditor;
