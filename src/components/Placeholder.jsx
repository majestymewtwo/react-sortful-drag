import React from "react";
import { DragHandleComponent } from "react-sortful";
import commonStyles from "../common.module.css";

/* Drag control SVG */
const dotsSVG = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
    <circle cx='18' cy='12' r='3' />
    <circle cx='18' cy='24' r='3' />
    <circle cx='18' cy='36' r='3' />
    <circle cx='30' cy='12' r='3' />
    <circle cx='30' cy='24' r='3' />
    <circle cx='30' cy='36' r='3' />
  </svg>
);

const Placeholder = ({ style, isGroup, title }) => {
  return (
    <div
      className={`${style} p-2 border rounded-sm shadow-sm ${
        isGroup ? "bg-green-50" : "bg-yellow-50"
      }`}>
      <div className='flex items-center gap-2'>
        <DragHandleComponent className={commonStyles.dragHandle}>
          {dotsSVG}
        </DragHandleComponent>
        <input
          spellCheck={false}
          className='focus:outline-none w-full bg-inherit'
          name='title'
          defaultValue={title}
        />
      </div>
    </div>
  );
};

export default Placeholder;
