import React, { useEffect, useRef, useState } from "react";
import { Item, DragHandleComponent } from "react-sortful";
import commonStyles from "../common.module.css";
import ContentEditable from "react-contenteditable";

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
      <div className='flex p-4 gap-4 border-2 rounded-md'>
        <DragHandleComponent className='size-7'>{dotsSVG}</DragHandleComponent>
        <div className='w-full'>
          <div className='flex items-center gap-2'>
            <h1 className='font-semibold'>{index + 1}</h1>
            <ContentEditable
              spellCheck={false}
              html={title}
              disabled={false}
              onChange={handleChange}
              innerRef={titleRef}
              className='focus:outline-none w-full p-2'
            />
          </div>
          <ContentEditable
            spellCheck={false}
            html={content}
            disabled={false}
            onChange={handleChange}
            innerRef={contentRef}
            className='focus:outline-none w-full p-2'
          />
          <div>{children}</div>
        </div>
      </div>
    </Item>
  );
};

export default Component;
