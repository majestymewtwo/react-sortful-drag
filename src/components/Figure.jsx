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

const Figure = ({
  id,
  number,
  index,
  caption,
  images,
  type,
  keyValue,
  updateContent,
  isInRoot,
  removeElement,
}) => {
  const textRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [close, setClose] = useState(false);
  const [figureCaption, setFigureCaption] = useState(caption);
  const [figureImages, setFigureImages] = useState(images);

  const handleChange = () => {
    const data = {
      id: id,
      type: type,
      number: number,
      key: keyValue,
      caption: figureCaption,
      images: figureImages,
      children: undefined,
    };
    updateContent(data);
  };

  const toggleView = () => {
    setVisible((visible) => !visible);
  };

  const toggleClose = () => {
    setClose((close) => !close);
  };

  const updateImages = (e) => {
    const newImage = e.target.files[0];
    if (newImage.type.slice(0, 5) !== "image") return;
    const data = {
      id: randomId(),
      image: newImage,
      label: "",
    };
    setFigureImages((prev) => [...prev, data]);
  };

  const onDropHandler = (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      const newImage = e.dataTransfer.items[0].getAsFile();
      if (newImage.type.slice(0, 5) !== "image") return;
      const data = {
        id: randomId(),
        image: newImage,
        label: "",
      };
      setFigureImages((prev) => [...prev, data]);
    }
  };

  const dragHandler = (e) => {
    e.preventDefault();
  };

  const removeImage = (id) => {
    setFigureImages((figure) => figure.filter((image) => image.id !== id));
  };

  const handleLabelChange = (id, newLabel) => {
    let updatedImages = [...figureImages];
    const updatedData = updatedImages.find((image) => image.id === id);
    updatedData.label = newLabel;
    setFigureImages(updatedImages);
  };

  const handleCaptionChange = (e) => {
    setFigureCaption(e.target.value);
  };

  useEffect(() => {
    handleChange();
  }, [figureImages, figureCaption]);

  return (
    <Item
      isGroup={false}
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
            } px-3`}>
            <h1 className='font-semibold py-2 w-full'>Figure {number}:</h1>
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
            <div className='py-2 w-[5%] flex justify-center'>
              <img
                className={`cursor-pointer w-4 h-2 ${visible && "rotate-180"}`}
                src='/assets/minimise.png'
                alt='remove'
                onClick={toggleView}
              />
            </div>
          </div>
          {visible && (
            <>
              <div className='p-4'>
                <label
                  onDragOver={dragHandler}
                  onDragLeave={dragHandler}
                  onDrop={onDropHandler}
                  className={`flex flex-col items-center justify-center h-40 rounded-md border-gray-300 border-2 border-dashed bg-gray-100 text-gray-500 font-semibold`}
                  htmlFor={`figure-image-upload-${id}`}>
                  <h1>
                    Drag & Drop or{" "}
                    <span className='text-blue-600 cursor-pointer hover:underline'>
                      Choose File
                    </span>{" "}
                    to upload
                  </h1>
                  <p className='text-xs text-gray-400'>Max file size 30 MB</p>
                </label>
                <input
                  id={`figure-image-upload-${id}`}
                  type='file'
                  onChange={updateImages}
                  className='hidden'
                />
              </div>
              {figureImages.length > 0 && (
                <div className='grid grid-cols-3 place-items-center gap-2 p-4'>
                  {figureImages.map((figure) => (
                    <SubFigures
                      key={figure.id}
                      image={figure.image}
                      id={figure.id}
                      label={figure.label}
                      removeImage={removeImage}
                      onChange={handleLabelChange}
                    />
                  ))}
                </div>
              )}
              <div className='p-4'>
                <input
                  type='text'
                  placeholder='Enter Caption'
                  className='w-full bg-gray-100  text-gray-600 text-sm p-2 rounded-md focus:outline-none'
                  defaultValue={figureCaption}
                  onChange={handleCaptionChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Item>
  );
};

const SubFigures = ({ id, image, label, removeImage, onChange }) => {
  const handleChange = (e) => {
    const text = e.target.value;
    onChange(id, text);
  };

  return (
    <div className='h-full flex flex-col justify-between col-span-1'>
      <img
        className='cursor-pointer size-4'
        src='/assets/remove.png'
        alt='remove'
        onClick={() => removeImage(id)}
      />
      <img src={URL.createObjectURL(image)} alt={image} />
      <input
        type='text'
        onChange={handleChange}
        defaultValue={label}
        placeholder='Enter Label'
        className='w-full bg-gray-100 text-gray-600 text-sm p-2 rounded-md focus:outline-none'
      />
    </div>
  );
};

export default Figure;
