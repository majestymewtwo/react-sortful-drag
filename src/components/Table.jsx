import React, { useEffect, useRef, useState } from "react";
import { dotsSVG } from "./Component";
import { DragHandleComponent, Item } from "react-sortful";
import PropTypes from "prop-types";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema as baseSchema } from "prosemirror-schema-basic";
import {
  tableNodes,
  columnResizing,
  tableEditing,
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
  mergeCells,
  splitCell,
  goToNextCell,
} from "prosemirror-tables";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import addRowAfterIcon from "../assets/Insert Row After.svg";
import addRowBeforeIcon from "../assets/Insert Row Before.svg";
import addColumnAfterIcon from "../assets/Insert Column After.svg";
import addColumnBeforeIcon from "../assets/Insert Column Before.svg";
import deleteRowIcon from "../assets/Delete Row.svg";
import deleteColumnIcon from "../assets/Delete Column.svg";
import mergeCellsIcon from "../assets/Merge.svg";
import splitCellIcon from "../assets/Split.svg";
import undoIcon from "../assets/Undo.svg";
import redoIcon from "../assets/Redo.svg";
import removeIcon from "../assets/Remove.svg";
import codeIcon from "../assets/custom.svg";
import editorIcon from "../assets/Editor.svg";
import settingsIcon from "../assets/Settings.svg";

const schema = new Schema({
  nodes: baseSchema.spec.nodes.append(
    tableNodes({
      tableGroup: "block",
      cellContent: "block+",
      cellAttributes: {
        background: {
          default: null,
          getFromDOM(dom) {
            return dom.style.backgroundColor || null;
          },
          setDOMAttr(value, attrs) {
            if (value) attrs.style = `background-color: ${value};`;
          },
        },
      },
    })
  ),
  marks: baseSchema.spec.marks,
});

const Table = ({ id, index, rows, cols, number }) => {
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState(null);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    console.log("Rerender");
  }, []);

  useEffect(() => {
    if (!showEditor) {
      return;
    }
    const tableNode = schema.nodes.table.createAndFill(
      null,
      Array.from({ length: rows }, () =>
        schema.nodes.table_row.createAndFill(
          null,
          Array.from({ length: cols }, () =>
            schema.nodes.table_cell.createAndFill(
              null,
              schema.nodes.paragraph.createAndFill()
            )
          )
        )
      )
    );

    const doc = schema.nodes.doc.create(null, tableNode ? [tableNode] : []);
    const editorState = EditorState.create({
      doc,
      plugins: [
        columnResizing(),
        tableEditing(),
        history(),
        keymap({
          ...baseKeymap,
          "Mod-z": undo,
          "Mod-y": redo,
          "Mod-Shift-z": redo,
          Tab: goToNextCell(1),
          "Shift-Tab": goToNextCell(-1),
        }),
      ],
    });

    const view = new EditorView(editorRef.current, {
      state: editorState,
      dispatchTransaction(transaction) {
        let newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });
    setEditorView(view);
    return () => view.destroy();
  }, [id, rows, cols, showEditor]);

  const executeCommand = (command) => {
    if (editorView) {
      command(editorView.state, editorView.dispatch, editorView);
      editorView.focus();
    }
  };

  return (
    <Item isUsedCustomDragHandlers identifier={id} index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div className='bg-white border p-2 rounded-md w-full'>
          <label className='text-black font-semibold'>{`Table ${number} ${rows}-${cols}`}</label>
          <input
            type='text'
            id={`Caption ${number}`}
            placeholder='Caption'
            className='text-sm w-full mb-1 p-2 bg-[#f5f5f5a3] outline-none text-black rounded text-justify cursor-text'
          />
          <div ref={editorRef} className='editor-content' />
        </div>
      </div>
    </Item>
  );
};

export default Table;
