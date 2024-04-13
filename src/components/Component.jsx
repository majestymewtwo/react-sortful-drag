import React, { useEffect, useRef, useState } from "react";
import { Item, DragHandleComponent } from "react-sortful";
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

const Component = ({ id, index, title, content, children, updateContent }) => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const handleChange = () => {
    const data = {
      id: id,
      title: titleRef.current.innerHTML,
      content: contentRef.current.innerHTML,
      children: children,
    };
    updateContent(data);
  };

  return (
    <Item
      isGroup={children ? true : false}
      isUsedCustomDragHandlers
      identifier={id}
      index={index}>
      <div className='flex p-4 gap-4 border rounded-md'>
        <DragHandleComponent className='size-7'>{dotsSVG}</DragHandleComponent>
        <div className='w-full'>
          <div
            spellCheck={false}
            onBlur={handleChange}
            onKeyDown={handleChange}
            ref={titleRef}
            className='focus:outline-none w-full p-2'
            suppressContentEditableWarning
            contentEditable>
            {title}
          </div>
          <div
            spellCheck={false}
            onBlur={handleChange}
            onKeyDown={handleChange}
            ref={contentRef}
            className='focus:outline-none w-full p-2'
            suppressContentEditableWarning
            contentEditable>
            {content}
          </div>
          <div className='ml-8'>{children}</div>
        </div>
      </div>
    </Item>
  );
};

export default Component;
