import { useState } from "react";

interface UseDynamicItemManagerResult<T> {
  itemCounter: number;
  selectedItems: T[];
  handleIncrease: () => void;
  handleDecrease: () => void;
  handleItemSelect: (index: number, itemKey: T) => void;
}

const useDynamicItemManager = <
  T extends string,
>(): UseDynamicItemManagerResult<T> => {
  const [itemCounter, setItemCounter] = useState(1);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const handleIncrease = () => {
    setItemCounter((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setItemCounter((prev) => {
      if (prev > 1) {
        setSelectedItems((current) => {
          const updated = [...current];
          updated.pop();
          return updated;
        });
        return prev - 1;
      }
      return prev;
    });
  };

  const handleItemSelect = (index: number, itemKey: T) => {
    setSelectedItems((current) => {
      const updated = [...current];
      updated[index] = itemKey;
      return updated;
    });
  };

  return {
    itemCounter,
    selectedItems,
    handleIncrease,
    handleDecrease,
    handleItemSelect,
  };
};

export default useDynamicItemManager;
