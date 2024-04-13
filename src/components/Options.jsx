import React from "react";

// Array of objects to be converted into the map
const dataArray = [
  {
    id: "subsection",
    title: "Sub-Section",
    content: "This is a sub-section",
    children: undefined,
  },
  {
    id: "section",
    title: "Section",
    content: "This is a section",
    children: [],
  },
  {
    id: "subparagraph",
    title: "Sub-Paragraph",
    content: "This is a sub-paragraph",
    children: [],
  },
  {
    id: "paragraph",
    title: "Paragraph",
    content: "This is a paragraph",
    children: [],
  },
];

const data = new Map(dataArray.map((obj) => [obj.id, obj]));

const Options = ({ addElement }) => {
  return (
    <div className='p-4 space-y-3 w-1/4'>
      {[...data.values()].map((item) => (
        <div
          className='border p-2 rounded-sm flex items-center justify-between'
          key={item.id}>
          <h2>{item.title}</h2>
          <button
            onClick={() => addElement(item)}
            className='bg-gray-200 text-sm p-2 rounded-md hover:bg-gray-400'>
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default Options;
