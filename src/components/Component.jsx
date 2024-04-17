import React, { useEffect, useRef, useState } from "react";
import { Item, DragHandleComponent } from "react-sortful";
import commonStyles from "../common.module.css";
import ContentEditable from "react-contenteditable";
import { randomId } from "../utils/math";

/* Drag control SVG */
export const dotsSVG = (
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
  keyValue,
  content,
  children,
  placeholder,
  updateContent,
  isInRoot,
  removeElement,
}) => {
  const textRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [close, setClose] = useState(false);

  const handleChange = () => {
    const data = {
      id: id,
      type: type,
      number: number,
      key: keyValue,
      placeholder: placeholder,
      text: textRef.current.innerHTML,
      children: content,
    };
    updateContent(data);
  };

  const toggleView = () => {
    setVisible((visible) => !visible);
  };

  const toggleClose = () => {
    setClose((close) => !close);
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
        <div
          className={`w-full ${
            isInRoot ? "border-2 rounded-md" : index !== 0 && "border-t-2"
          } bg-white`}>
          <div
            onMouseEnter={toggleClose}
            onMouseLeave={toggleClose}
            className={`flex items-center gap-2 ${
              type !== "text" ? "text-gray-600" : "text-sm"
            } ${
              isInRoot &&
              visible &&
              children &&
              children.length > 0 &&
              "border-b-2"
            } px-3`}>
            {number && number.length > 0 && (
              <h1 className='font-semibold py-2 w-[3%] text-center'>
                {number}
              </h1>
            )}
            <ContentEditable
              data-ph={placeholder}
              spellCheck={false}
              html={text}
              disabled={false}
              onChange={handleChange}
              innerRef={textRef}
              className={`focus:outline-none ${
                children ? "w-[85%]" : "w-[95%]"
              } py-2`}
            />
            <div className='py-2 w-[5%] flex justify-center' title='Remove'>
              {close && (
                <img
                  className='cursor-pointer size-4'
                  src='/assets/remove.png'
                  alt='remove'
                  onClick={() => removeElement(id)}
                />
              )}
            </div>
            {children && (
              <div className='py-2 w-[5%] flex justify-center'>
                <img
                  className={`cursor-pointer w-4 h-2 ${
                    visible && "rotate-180"
                  }`}
                  src='/assets/minimise.png'
                  alt='remove'
                  onClick={toggleView}
                />
              </div>
            )}
          </div>
          {visible && children && <div className='pl-4 pr-1'>{children}</div>}
        </div>
      </div>
    </Item>
  );
};

export default Component;
