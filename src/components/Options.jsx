import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { randomId } from "../utils/math";

const dataArray = [
  {
    id: "section",
    text: "",
    type: "section",
    key: "",
    placeholder: "Enter Section here",
    children: [],
  },
  {
    id: "sub-section",
    text: "",
    type: "sub-section",
    key: "",
    placeholder: "Enter Sub-Section here",
    children: [],
  },
  {
    id: "sub-sub-section",
    text: "",
    type: "sub-sub-section",
    key: "",
    placeholder: "Enter Sub-Subsection here",
    children: [],
  },
  {
    id: "sub-paragraph",
    text: "",
    type: "sub-paragraph",
    key: "",
    placeholder: "Enter Sub-Paragraph here",
    children: [],
  },
  {
    id: "paragraph",
    text: "",
    placeholder: "Enter Paragraph here",
    type: "section",
    key: "",
    children: [],
  },
  {
    id: "text",
    text: "",
    type: "text",
    placeholder: "Enter Text here",
    key: "",
    children: undefined,
  },
  {
    id: "table",
    caption: "",
    rows: 0,
    cols: 0,
    data: undefined,
    type: "table",
    key: "",
    children: undefined,
    options: {
      isWide: false,
      isLong: false,
      width: 0,
      position: "1",
    },
  },
];

const data = new Map(dataArray.map((obj) => [obj.id, obj]));

const Options = ({ addElement }) => {
  const handleAddElement = (type) => {
    const newItem = { ...data.get(type) };
    if (newItem.type !== "text") {
      const text = { ...data.get("text") };
      text.id = `${text.id}-${Date.now()}`;
      text.key = randomId();
      if (!newItem.children) {
        newItem.children = [];
      }
      newItem.children = [text];
    }
    addElement(newItem);
  };

  const handleAddTable = ({ rows, cols }) => {
    const tableItem = { ...data.get("table") };
    tableItem.rows = rows;
    tableItem.cols = cols;
    addElement(tableItem);
  };

  return (
    <div className='p-4 space-y-3 w-1/6'>
      {[...data.values()].map((item) => {
        if (item.type !== "table")
          return (
            <div
              className='border p-2 rounded-sm flex items-center justify-between bg-white'
              key={item.id}>
              <h2>{item.type}</h2>
              <button
                onClick={() => handleAddElement(item.type)}
                className='bg-gray-200 text-sm p-2 rounded-md hover:bg-gray-400'>
                Add
              </button>
            </div>
          );
      })}
      <SelectTable addTable={handleAddTable} />
    </div>
  );
};

const SelectTable = ({ addTable }) => {
  const [table, setTable] = useState({
    rows: 0,
    cols: 0,
  });

  const handleCellClick = () => {
    addTable(table);
  };

  const resetTable = () => {
    setTable({
      rows: 0,
      cols: 0,
    });
  };

  return (
    <DropdownMenu.Root onOpenChange={resetTable}>
      <DropdownMenu.Trigger className='w-full focus:outline-none'>
        <div className='border p-2 rounded-sm flex items-center justify-between bg-white'>
          <h2>table</h2>
          <div className='bg-gray-200 text-sm p-2 rounded-md hover:bg-gray-400'>
            Add
          </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className='p-4 bg-white rounded-md w-full grid grid-cols-10'>
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <DropdownMenu.Item
                className={`size-4 border col-span-1 focus:outline-none ${
                  row + 1 <= table.rows && col + 1 <= table.cols
                    ? "bg-blue-600"
                    : ""
                }`}
                key={`${row}-${col}`}
                onMouseEnter={() =>
                  setTable({
                    rows: row + 1,
                    cols: col + 1,
                  })
                }
                onClick={() => handleCellClick(row, col)}
              />
            ))
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Options;
