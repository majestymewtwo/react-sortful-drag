import { List, Item, DragHandleComponent } from "react-sortful";
import commonStyles from "./common.module.css";
import Component from "./components/Component";
import { useCallback, useEffect, useState } from "react";

/* Dropping line Styles */
const renderDropLineElement = (injectedProps) => (
  <div
    ref={injectedProps.ref}
    className={commonStyles.dropLine}
    style={injectedProps.style}
  />
);

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

/* Main Component */
export default function NestedVertical({ items, updateList }) {
  const [list, setList] = useState([...items]);
  const [active, setActive] = useState({
    identifier: null,
    groupIdentifier: null,
    index: null,
    isGroup: null,
  });

  /* Ghost of item when dragged */
  const renderGhost = useCallback(
    ({ groupIdentifier, index }) => {
      let item;
      if (!groupIdentifier) {
        item = list[index];
      } else {
        const group = list.find((val) => val.id === groupIdentifier);
        item = group.children[index];
      }
      return <h1>{item.title}</h1>;
    },
    [list]
  );

  /* When item is dragged onto a group */
  const renderPlaceholder = useCallback(
    (props) => {
      return (
        <div style={props.style} className='p-3 border flex items-center gap-4'>
          <DragHandleComponent className='size-7'>
            {dotsSVG}
          </DragHandleComponent>
        </div>
      );
    },
    [list]
  );

  const renderStackGroup = useCallback(
    (props) => {
      if (active.isGroup)
        return <div style={props.style} className='bg-red-50' />;
      return <div style={props.style} className='bg-green-50' />;
    },
    [list, active]
  );

  const moveArray = (arr, pos, next) => {
    if (pos == next) return;
    const item = arr.splice(pos, 1)[0];
    arr.splice(next, 0, item);
  };

  const onDragEnd = useCallback(
    ({
      identifier,
      groupIdentifier,
      index,
      nextGroupIdentifier,
      nextIndex,
      isGroup,
    }) => {
      if (index === nextIndex && groupIdentifier === nextGroupIdentifier) {
        console.log("Element placed on same position");
        return;
      }
      if (isGroup && nextGroupIdentifier) {
        console.log("Cannot place group inside another group");
        return;
      }

      let newList = [...list];
      if (!nextGroupIdentifier) {
        if (!isGroup && groupIdentifier) {
          let draggedItem;
          const currentGroup = newList.find(
            (val) => val.id === groupIdentifier
          );
          draggedItem = currentGroup.children.find(
            (item) => item.id === identifier
          );
          currentGroup.children = currentGroup.children.filter(
            (item) => item.id !== identifier
          );
          newList.splice(nextIndex, 0, draggedItem);
        } else {
          moveArray(newList, index, nextIndex);
        }
      } else if (nextGroupIdentifier === groupIdentifier) {
        const currentGroup = newList.find((val) => val.id === groupIdentifier);
        moveArray(currentGroup.children, index, nextIndex);
      } else {
        let draggedItem;
        if (groupIdentifier) {
          const currentGroup = newList.find(
            (val) => val.id === groupIdentifier
          );
          draggedItem = currentGroup.children.find(
            (item) => item.id === identifier
          );
          currentGroup.children = currentGroup.children.filter(
            (item) => item.id !== identifier
          );
        } else {
          draggedItem = newList[index];
          newList.splice(index, 1);
        }
        const nextGroup = newList.find((val) => val.id === nextGroupIdentifier);
        nextGroup.children.splice(nextIndex, 0, draggedItem);
      }
      setList(newList);
      updateList(newList);
    },
    [list]
  );

  const renderElement = (item, index) => {
    if (!item) return;

    if (item.children)
      return (
        <Component key={index} id={item.id} index={index} title={item.title}>
          {item.children.map((child, index) => renderElement(child, index))}
        </Component>
      );
    return (
      <Component
        key={index}
        id={item.id}
        index={index}
        title={item.title}
        children={undefined}
      />
    );
  };

  const onDragStart = (meta) => {
    setActive(meta);
  };

  useEffect(() => {
    setList(items);
  }, [items]);

  return (
    <List
      className='w-2/3'
      renderGhost={renderGhost}
      renderPlaceholder={renderPlaceholder}
      renderStackedGroup={renderStackGroup}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      isDisabled={false}
      renderDropLine={renderDropLineElement}>
      <div className='p-4'>
        {list.map((item, index) => renderElement(item, index))}
      </div>
    </List>
  );
}
