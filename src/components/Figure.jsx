import React, { useEffect, useRef, useState } from "react";
import { Item, DragHandleComponent } from "react-sortful";
import { randomId } from "../utils/math";
import settingsIcon from "../assets/Settings.svg";
import addImagesIcon from "../assets/addImagesIcon.svg";
import * as Popover from "@radix-ui/react-popover";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
  options,
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
  const [figureOptions, setFigureOptions] = useState(options);

  const handleChange = () => {
    const data = {
      id: id,
      type: type,
      number: number,
      key: keyValue,
      caption: figureCaption,
      images: figureImages,
      children: undefined,
      options: figureOptions,
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

  const handleOptionsUpdate = (options) => {
    setFigureOptions(options);
  };

  useEffect(() => {
    handleChange();
  }, [figureImages, figureCaption, figureOptions]);

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
            <div className='flex items-center gap-2 w-full'>
              <h1 className='font-semibold py-2'>Figure {number}:</h1>
              <Settings
                id={id}
                isWide={figureOptions.isWide}
                width={figureOptions.width}
                position={figureOptions.position}
                number={number}
                updateOptions={handleOptionsUpdate}
              />
            </div>
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
                  <img src={addImagesIcon} alt='add-images' />
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

const Settings = ({ id, isWide, number, width, position, updateOptions }) => {
  const [options, setOptions] = useState({
    isWide: isWide,
    width: width,
    position: position,
  });

  const toggleSwitch = (name) => {
    setOptions((prev) => {
      const newState = { ...prev };
      newState[name] = !newState[name];
      if (name === "isWide") {
        if (!newState[name] && newState.width > 5) {
          newState.width = 5;
        }
      }
      return newState;
    });
  };

  const handleSlider = (value) => {
    setOptions((prev) => ({
      ...prev,
      width: value[0],
    }));
  };

  const handlePositionChange = (e) => {
    setOptions((prev) => ({
      ...prev,
      position: e.target.innerText,
    }));
  };

  useEffect(() => {
    updateOptions(options);
  }, [options]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <img src={settingsIcon} alt='options' />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side='right'
          sideOffset={4}
          className='bg-white rounded-sm border shadow relative text-xs space-y-1 w-[20vw]'>
          <h1 className='font-semibold p-2'>Figure {number} Settings</h1>
          <hr className='w-full' />
          <div className='flex justify-between items-center gap-4 p-3'>
            <ToggleOption
              title='Wide Figure'
              name='isWide'
              active={options.isWide}
              onToggle={toggleSwitch}
            />
          </div>
          <WidthSlider
            isWide={options.isWide}
            width={options.width}
            onSlide={handleSlider}
          />
          <PositionMenu
            id={id}
            position={options.position}
            handleChange={handlePositionChange}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const ToggleOption = ({ name, title, active, onToggle }) => {
  return (
    <div className='flex items-center gap-4'>
      <h1>{title}</h1>
      <Switch.Root
        checked={active}
        onCheckedChange={() => onToggle(name)}
        className={`w-[39px] h-[20px] ${
          active ? "bg-blue-500" : "bg-gray-400"
        } rounded-full relative  focus: data-[state=checked]:bg-fieldPrimary cursor-default'
                id='airplane-mode`}>
        <Switch.Thumb
          className={`block w-[15px] h-[15px] bg-white rounded-full  transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]`}
        />
      </Switch.Root>
    </div>
  );
};

const WidthSlider = ({ width, onSlide, isWide }) => {
  const [display, setDisplay] = useState(width);

  const updateDisplay = (value) => {
    setDisplay(value[0]);
  };

  useEffect(() => {
    setDisplay(width);
  }, [isWide]);

  return (
    <div className='grid grid-cols-12 gap-4 p-3 items-center'>
      <h1 className='col-span-4'>Figure Width</h1>
      <Slider.Root
        onValueChange={updateDisplay}
        onValueCommit={onSlide}
        className='relative flex items-center rounded-md bg-gray-300 touch-none col-span-7 h-1'
        defaultValue={[display]}
        max={isWide ? 7.5 : 5}
        step={0.1}>
        <Slider.Track className='relative grow h-1'>
          <Slider.Range className='absolute bg-blue-500 rounded-full h-full' />
        </Slider.Track>
        <Slider.Thumb className='block size-4 bg-blue-600 rounded-full focus:outline-none' />
      </Slider.Root>
      <h1 className='col-span-1'>{display}</h1>
    </div>
  );
};

const PositionMenu = ({ id, position, handleChange }) => {
  return (
    <div className='flex items-center justify-between p-3'>
      <label htmlFor={`position-${id}`} className='w-1/3'>
        Figure Position
      </label>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center justify-end gap-1 w-24 p-1 border text-right focus:outline-none'>
          <h1>{position}</h1>
          <img
            className={`cursor-pointer w-3 h-2`}
            src='/assets/minimise.png'
            alt='remove'
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white border rounded-sm text-xs text-right w-24'>
            <DropdownMenu.Item
              onSelect={handleChange}
              className={`${
                position === "1" && "bg-gray-200 text-blue-500"
              } p-1 hover:bg-gray-100 cursor-pointer`}>
              1
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={handleChange}
              className={`${
                position === "2" && "bg-gray-200 text-blue-500"
              } p-1 hover:bg-gray-100 cursor-pointer`}>
              2
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={handleChange}
              className={`${
                position === "3" && "bg-gray-200 text-blue-500"
              } p-1 hover:bg-gray-100 cursor-pointer`}>
              3
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default Figure;
