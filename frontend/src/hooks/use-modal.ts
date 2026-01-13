import { useCallback, useEffect, useState } from "react";

type UseModalOptions = Partial<{
  defaultOpen: boolean;
  hash: string;
}>;

export const useModal = ({
  defaultOpen = false,
  hash,
}: UseModalOptions = {}) => {
  const [isOpen, setIsOpen] = useState(() => {
    if (hash && typeof window !== "undefined") {
      return window.location.hash === `#${hash}`;
    }
    return defaultOpen;
  });

  const onOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!hash) return;

      if (open) {
        window.location.hash = hash;
      } else if (window.location.hash === `#${hash}`) {
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    },
    [hash],
  );

  useEffect(() => {
    if (!hash) return;

    const handleHashChange = () => {
      setIsOpen(window.location.hash === `#${hash}`);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [hash]);

  return { isOpen, onOpenChange };
};
