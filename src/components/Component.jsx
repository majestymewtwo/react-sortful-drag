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

const Component = ({
  id,
  number,
  index,
  text,
  type,
  content,
  children,
  updateContent,
  isInRoot,
  removeElement,
}) => {
  const textRef = useRef(null);

  const handleChange = () => {
    const data = {
      id: id,
      type: type,
      number: number,
      text: textRef.current.innerHTML,
      children: content,
    };
    updateContent(data);
  };

  return (
    <Item
      isGroup={children ? true : false}
      isUsedCustomDragHandlers
      identifier={id}
      index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div className={`w-full ${isInRoot && "border-2"} rounded-md bg-white`}>
          <div
            className={`flex items-start gap-2 ${
              isInRoot && children && children.length > 0 && "border-b-2"
            } px-3`}>
            {number && number.length > 0 && (
              <h1 className='font-semibold py-2'>{number}</h1>
            )}
            <ContentEditable
              data-ph={"Type Something.."}
              spellCheck={false}
              html={text}
              disabled={false}
              onChange={handleChange}
              innerRef={textRef}
              className='focus:outline-none w-full py-2'
            />
            <div className='py-2'>
              <img
                className='cursor-pointer size-4'
                src='/assets/remove.png'
                alt='remove'
                onClick={() => removeElement(id)}
              />
            </div>
          </div>
          {children && <div className='pl-4'>{children}</div>}
        </div>
      </div>
    </Item>
  );
};

export default Component;
