import React from "react";
import { dotsSVG } from "./Component";
import { DragHandleComponent, Item } from "react-sortful";

const Table = ({ id, index, rows, cols }) => {
  return (
    <Item isUsedCustomDragHandlers identifier={id} index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div className='bg-white border p-2 rounded-md w-full'>
          {rows} and {cols}
        </div>
      </div>
    </Item>
  );
};

export default Table;
