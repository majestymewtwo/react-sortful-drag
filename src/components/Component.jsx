import React, { useState } from "react";
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

const Component = ({ id, index, title, children }) => {
  return (
    <Item
      isGroup={children ? true : false}
      isUsedCustomDragHandlers
      identifier={id}
      index={index}>
      <div className='p-3 border flex items-center gap-4'>
        <DragHandleComponent className='size-7'>{dotsSVG}</DragHandleComponent>
        <h1>{title}</h1>
      </div>
      <div className='ml-8'>{children}</div>
    </Item>
  );
};

export default Component;
