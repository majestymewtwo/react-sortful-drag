import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dotsSVG } from "./Component";
import { DragHandleComponent, Item } from "react-sortful";
import {
  EditorComponent,
  ReactComponentExtension,
  Remirror,
  ThemeProvider,
  useCommands,
  useRemirror,
  useRemirrorContext,
} from "@remirror/react";
import { TableExtension } from "@remirror/extension-tables";
import "prosemirror-view/style/prosemirror.css";

const extensions = () => [new ReactComponentExtension(), new TableExtension()];

const Table = ({ id, index, rows, cols, data, updateState }) => {
  const handleUpate = (state) => {
    const data = {
      id: id,
      rows: rows,
      cols: cols,
      state: state,
      type: "table",
      placeholder: "Enter Text here",
      children: undefined,
    };
    updateState(data);
  };

  return (
    <Item isUsedCustomDragHandlers identifier={id} index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div className='bg-white border p-2 rounded-md w-full'>
          <RemirrorTable
            updateDataState={handleUpate}
            rows={rows}
            cols={cols}
            data={data}
          />
        </div>
      </div>
    </Item>
  );
};

const RemirrorTable = ({ rows, cols, data, updateDataState }) => {
  const handleStateChange = (event) => {
    const newState = event.state.toJSON();
    updateDataState(newState);
  };

  const handleError = () => {
    alert("Invalid State");
  };

  const { manager, state } = useRemirror({
    extensions,
    content: data ? data.doc : null,
    onError: handleError,
  });

  return (
    <div>
      <h1>
        {rows} - {cols}
      </h1>
      <Remirror
        onChange={handleStateChange}
        manager={manager}
        initialContent={state}>
        <EditorComponent />
        <Commands rows={rows} cols={cols} data={data} />
      </Remirror>
    </div>
  );
};

const Commands = ({ rows, cols, data }) => {
  const { commands } = useRemirrorContext({ autoUpdate: false });
  const tableRef = useRef(null);

  useEffect(() => {
    if (!tableRef.current && !data) {
      commands.createTable({
        rowsCount: rows,
        columnsCount: cols,
        withHeaderRow: false,
      });
      tableRef.current = true;
    }
  }, []);

  return null;
};

export default Table;
