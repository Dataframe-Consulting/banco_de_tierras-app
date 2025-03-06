import { useState, useCallback, useRef, useEffect } from "react";

interface UseToggleMenu<T = HTMLElement> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ref: React.RefObject<T | null>;
}
const useToggleMenu = <T extends HTMLElement>(): UseToggleMenu<T> => {
  const ref = useRef<T>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-ignore-outside-click]")) {
        return;
      }

      if (ref.current && !ref.current.contains(target)) {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return { isOpen, toggle, open, close, ref };
};

export default useToggleMenu;
