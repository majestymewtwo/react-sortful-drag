import React, { useEffect, useRef, useState } from "react";
import { dotsSVG } from "./Component";
import { DragHandleComponent, Item } from "react-sortful";
import "prosemirror-view/style/prosemirror.css";
import codeIcon from "../assets/custom.svg";
import editorIcon from "../assets/Editor.svg";

const Equation = ({
  id,
  index,
  keyValue,
  data,
  number,
  isInRoot,
  updateData,
  removeElement,
}) => {
  const [showEditor, setShowEditor] = useState(true);
  const [equationData, setEquationData] = useState(data);
  const [close, setClose] = useState(false);
  const mf = useRef(null);
  const textAreaRef = useRef(null);

  const handleChange = () => {
    const data = {
      id: id,
      type: "equation",
      key: keyValue,
      number: number,
      data: equationData,
      children: undefined,
    };
    updateData(data);
  };

  const toggleEditor = () => {
    setShowEditor((editor) => !editor);
  };

  const toggleClose = () => {
    setClose((close) => !close);
  };

  const handleDataChangeByRef = () => {
    setEquationData(mf.current.getValue());
  };

  const handleDataChangeByInput = (e) => {
    setEquationData(e.target.value);
  };

  useEffect(() => {
    if (mf.current) {
      mf.current.setValue(equationData);
      mf.current.mathVirtualKeyboardPolicy = "manual";
    }
  }, [index, showEditor]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const { scrollHeight } = textAreaRef.current;
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, equationData, showEditor]);

  useEffect(() => {
    handleChange();
  }, [equationData]);

  return (
    <Item isUsedCustomDragHandlers identifier={id} index={index}>
      <div className='flex gap-2'>
        <DragHandleComponent className='size-7 cursor-pointer py-1'>
          {dotsSVG}
        </DragHandleComponent>
        <div
          className={`bg-white ${
            isInRoot && "border"
          } py-2 px-4 gap-2 rounded-md w-full`}
          onMouseEnter={toggleClose}
          onMouseLeave={toggleClose}>
          <div className='flex items-center justify-between'>
            <div className='flex gap-6 items-center'>
              <h1 className='text-black font-semibold'>{`Equation ${
                number ?? " "
              }`}</h1>
              <Option
                icon={showEditor ? codeIcon : editorIcon}
                title={"Toggle editor"}
                handlePress={toggleEditor}
              />
            </div>
            <div>
              {close && (
                <img
                  className='cursor-pointer size-4'
                  src='/assets/remove.png'
                  alt='remove'
                  title='Remove'
                  onClick={() => removeElement(id)}
                />
              )}
            </div>
          </div>
          {showEditor && (
            <div>
              <math-field
                ref={mf}
                math-mode-space='\:'
                smart-mode='on'
                onInput={handleDataChangeByRef}
              />
            </div>
          )}
          {!showEditor && (
            <>
              <textarea
                ref={textAreaRef}
                spellCheck={false}
                value={equationData}
                onChange={handleDataChangeByInput}
                rows={1}
                className='p-3 border-2 rounded-sm focus:outline-none bg-gray-100 resize-none w-full'
              />
              <math-field className='preview' editable={false}>
                {equationData}
              </math-field>
            </>
          )}
        </div>
      </div>
    </Item>
  );
};

const Option = ({ icon, title, invert, utilityFunction, handlePress }) => {
  const handleOnClick = () => {
    handlePress(utilityFunction);
  };

  return (
    <button
      className={`${invert && "invert"}`}
      title={title}
      onClick={handleOnClick}>
      <img className='size-4' src={icon} alt={title} />
    </button>
  );
};

export default Equation;
