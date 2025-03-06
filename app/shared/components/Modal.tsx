"use client";

import { XMark } from "@/app/shared/icons";
import { useDisableScroll } from "@/app/shared/hooks";
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const menuRef = useRef(null);

  useDisableScroll(isOpen);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed flex items-center justify-center bg-black/75 inset-0 z-50">
      <div
        className="relative rounded-lg shadow-lg w-[80%] md:w-1/2 h-auto max-h-[80%] overflow-y-auto overflow-x-hidden bg-white"
        ref={menuRef}
      >
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 sticky top-0 pt-2 pr-2 w-full flex justify-end"
        >
          <XMark />
        </button>
        <div className="px-4 pb-4 md:px-8 md:pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
