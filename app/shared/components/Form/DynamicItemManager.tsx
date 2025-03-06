"use client";

import { useDynamicItemManager } from "@/app/shared/hooks";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";

interface IItem {
  key: string;
  name: string;
}

interface DynamicItemManagerProps {
  items: IItem[];
  renderForm: (
    index: number,
    items: IItem[],
    onSelect: (index: number, itemKey: string) => void
  ) => React.ReactNode;
}

const DynamicItemManager: React.FC<DynamicItemManagerProps> = ({
  items,
  renderForm,
}) => {
  const {
    itemCounter,
    selectedItems,
    handleIncrease,
    handleDecrease,
    handleItemSelect,
  } = useDynamicItemManager<string>();

  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: itemCounter }).map((_, index) => {
        const filteredItems = items.filter(
          (item) =>
            !selectedItems.includes(item.key) ||
            item.key === selectedItems[index]
        );

        return renderForm(index, filteredItems, handleItemSelect);
      })}
      <div className="flex gap-2 items-center justify-end mt-4">
        <button type="button" onClick={handleIncrease}>
          <PlusCircle />
        </button>
        {itemCounter > 1 && (
          <button type="button" onClick={handleDecrease}>
            <MinusCircle />
          </button>
        )}
        <span>{itemCounter > 1 && `(${itemCounter} total)`}</span>
      </div>
    </div>
  );
};

export default DynamicItemManager;
