import React, { useCallback, useEffect, useRef, useState } from "react";
import { dotsSVG } from "./Component";
import { DragHandleComponent, Item } from "react-sortful";
import "prosemirror-view/style/prosemirror.css";
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
import { debounce } from "lodash";

import * as Popover from "@radix-ui/react-popover";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";

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

const Table = ({
  id,
  index,
  keyValue,
  caption,
  rows,
  cols,
  data,
  number,
  options,
  updateData,
  removeElement,
}) => {
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState(null);
  const [showEditor, setShowEditor] = useState(true);
  const [tableOptions, setTableOptions] = useState(options);
  const [tableCaption, setTableCaption] = useState(caption);
  const [close, setClose] = useState(false);

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
    let docNode;
    if (data) {
      docNode = schema.nodeFromJSON(data);
    } else {
      docNode = schema.nodes.doc.create(
        null,
        schema.nodes.table.createAndFill(
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
        )
      );
    }
    const editorState = EditorState.create({
      doc: docNode,
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

  const updateDataDebounced = useCallback(
    debounce(() => {
      handleChange();
    }, 500),
    [updateData]
  );

  const handleChange = () => {
    if (editorView) {
      const data = {
        id: id,
        rows: rows,
        cols: cols,
        caption: tableCaption,
        data: editorView.state.doc.toJSON(),
        type: "table",
        options: tableOptions,
        key: keyValue,
        number : number,
        children: undefined,
      };
      updateData(data);
    }
  };

  const updateOptions = (options) => {
    setTableOptions(options);
  };

  const updateCaption = (e) => {
    setTableCaption(e.target.value);
  };

  const executeCommand = (command) => {
    if (editorView) {
      command(editorView.state, editorView.dispatch, editorView);
      editorView.focus();
      updateDataDebounced();
    }
  };

  const toggleEditor = () => {
    setShowEditor((editor) => !editor);
  };

  const toggleClose = () => {
    setClose((close) => !close);
  };

  useEffect(() => {
    handleChange();
  }, [tableCaption, tableOptions]);

  return (
    <Item isUsedCustomDragHandlers identifier={id} index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div
          className='bg-white border p-2 rounded-md w-full'
          onMouseEnter={toggleClose}
          onMouseLeave={toggleClose}>
          <div className='flex items-center justify-between'>
            <div className='flex gap-6 items-center'>
              <h1 className='text-black font-semibold w-20'>{`Table ${
                number ?? " "
              }`}</h1>
              <Option
                icon={showEditor ? codeIcon : editorIcon}
                title={"Toggle editor"}
                handlePress={toggleEditor}
              />
              <Option
                icon={addRowBeforeIcon}
                title={"Add Row Before"}
                utilityFunction={addRowBefore}
                handlePress={executeCommand}
              />
              <Option
                icon={addRowAfterIcon}
                title={"Add Row After"}
                utilityFunction={addRowAfter}
                handlePress={executeCommand}
              />
              <Option
                icon={addColumnBeforeIcon}
                title={"Add Col Before"}
                utilityFunction={addColumnBefore}
                handlePress={executeCommand}
              />
              <Option
                icon={addColumnAfterIcon}
                title={"Add Col After"}
                utilityFunction={addColumnAfter}
                handlePress={executeCommand}
              />
              <Option
                icon={deleteRowIcon}
                title={"Delete Row"}
                utilityFunction={deleteRow}
                handlePress={executeCommand}
              />
              <Option
                icon={deleteColumnIcon}
                title={"Delete Col"}
                utilityFunction={deleteColumn}
                handlePress={executeCommand}
              />
              <Option
                icon={mergeCellsIcon}
                title={"Merge Cells"}
                utilityFunction={mergeCells}
                handlePress={executeCommand}
              />
              <Option
                icon={splitCellIcon}
                title={"Split Cells"}
                utilityFunction={splitCell}
                handlePress={executeCommand}
              />
              <Option
                icon={undoIcon}
                title={"Undo"}
                utilityFunction={undo}
                invert={true}
                handlePress={executeCommand}
              />
              <Option
                icon={redoIcon}
                title={"Redo"}
                utilityFunction={redo}
                invert={true}
                handlePress={executeCommand}
              />
              <Settings
                isLong={options.isLong}
                isWide={options.isWide}
                number={number}
                width={options.width}
                position={options.position}
                updateOptions={updateOptions}
              />
            </div>
            <div>
              {close && (
                <img
                  className='cursor-pointer size-4'
                  src='/assets/remove.png'
                  alt='remove'
                  title='Remove'
                  onClick={() => removeElement(id)}
                />
              )}
            </div>
          </div>
          <input
            type='text'
            placeholder='Caption'
            value={tableCaption}
            onChange={updateCaption}
            spellCheck={false}
            className='text-sm w-full mb-1 p-2 bg-[#f5f5f5a3] outline-none text-black rounded text-justify cursor-text'
          />
          <div
            spellCheck={false}
            onKeyDown={updateDataDebounced}
            ref={editorRef}
            className='editor-content'
          />
        </div>
      </div>
    </Item>
  );
};

const Option = ({ icon, title, invert, utilityFunction, handlePress }) => {
  const handleOnClick = () => {
    handlePress(utilityFunction);
  };

  return (
    <button
      className={`${invert && "invert"}`}
      title={title}
      onClick={handleOnClick}>
      <img className='size-4' src={icon} alt={title} />
    </button>
  );
};

const Settings = ({
  isWide,
  number,
  isLong,
  width,
  position,
  updateOptions,
}) => {
  const [options, setOptions] = useState({
    isWide: isWide,
    isLong: isLong,
    width: width,
    position: position,
  });

  const toggleSwitch = (name) => {
    setOptions((prev) => {
      const newState = { ...prev };
      newState[name] = !newState[name];
      if (name === "isWide") {
        if (!newState[name] && newState.width > 5) {
          newState.width = 5;
        }
      }
      return newState;
    });
  };

  const handleSlider = (value) => {
    setOptions((prev) => ({
      ...prev,
      width: value[0],
    }));
  };

  useEffect(() => {
    updateOptions(options);
  }, [options]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <img src={settingsIcon} alt='options' />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side='right'
          sideOffset={4}
          className='bg-white rounded-sm border shadow relative text-xs space-y-1 w-[20vw]'>
          <h1 className='font-semibold p-2'>Table {number} Settings</h1>
          <hr className='w-full' />
          <div className='flex justify-between items-center gap-4 p-2'>
            <ToggleOption
              title='Wide Table'
              name='isWide'
              active={options.isWide}
              onToggle={toggleSwitch}
            />
            <ToggleOption
              title='Long Table'
              name='isLong'
              active={options.isLong}
              onToggle={toggleSwitch}
            />
          </div>
          <WidthSlider
            isWide={options.isWide}
            width={options.width}
            onSlide={handleSlider}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const ToggleOption = ({ name, title, active, onToggle }) => {
  return (
    <div className='flex items-center gap-4'>
      <h1>{title}</h1>
      <Switch.Root
        checked={active}
        onCheckedChange={() => onToggle(name)}
        className={`w-[39px] h-[20px] ${
          active ? "bg-blue-500" : "bg-gray-400"
        } rounded-full relative  focus: data-[state=checked]:bg-fieldPrimary cursor-default'
                id='airplane-mode`}>
        <Switch.Thumb
          className={`block w-[15px] h-[15px] bg-white rounded-full  transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]`}
        />
      </Switch.Root>
    </div>
  );
};

const WidthSlider = ({ width, onSlide, isWide }) => {
  const [display, setDisplay] = useState(width);

  const updateDisplay = (value) => {
    setDisplay(value[0]);
  };

  useEffect(() => {
    setDisplay(width);
  }, [isWide]);

  return (
    <div className='grid grid-cols-12 gap-4 p-2 items-center'>
      <h1 className='col-span-4'>Table Width</h1>
      <Slider.Root
        onValueChange={updateDisplay}
        onValueCommit={onSlide}
        className='relative flex items-center rounded-md bg-gray-300 touch-none col-span-7 h-1'
        defaultValue={[display]}
        max={isWide ? 7.5 : 5}
        step={0.1}>
        <Slider.Track className='relative grow h-1'>
          <Slider.Range className='absolute bg-blue-500 rounded-full h-full' />
        </Slider.Track>
        <Slider.Thumb className='block size-4 bg-blue-600 rounded-full focus:outline-none' />
      </Slider.Root>
      <h1 className='col-span-1'>{display}</h1>
    </div>
  );
};

export default Table;
