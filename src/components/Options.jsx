import React from "react";

// Array of objects to be converted into the map
const dataArray = [
  {
    id: "section",
    text: "Section",
    type: "section",
    children: [],
  },
  {
    id: "sub-section",
    text: "Sub-Section",
    type: "sub-section",
    children: [],
  },
  {
    id: "sub-sub-section",
    text: "Sub-Sub-Section",
    type: "sub-sub-section",
    children: [],
  },
  {
    id: "sub-paragraph",
    text: "Sub-Paragraph",
    type: "sub-paragraph",
    children: [],
  },
  {
    id: "paragraph",
    text: "Paragraph",
    type: "paragraph",
    children: [],
  },
  {
    id: "text",
    text: "Add your content here",
    type: "text",
    children: undefined,
  },
];

const data = new Map(dataArray.map((obj) => [obj.id, obj]));

const Options = ({ addElement }) => {
  const handleAddElement = (type) => {
    const newItem = { ...data.get(type) };
    if (newItem.type !== "text") {
      const text = { ...data.get("text") };
      text.id = `${text.id}-${Date.now()}`;
      if (!newItem.children) {
        newItem.children = [];
      }
      newItem.children = [text];
    }
    addElement(newItem);
  };

  return (
    <div className='p-4 space-y-3 w-1/4'>
      {[...data.values()].map((item) => (
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
      ))}
    </div>
  );
};

export default Options;
