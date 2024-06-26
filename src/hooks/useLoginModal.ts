import { createGlobalState } from "react-hooks-global-state";

const initialState: {
  isOpen: boolean;
  isLogedIn: boolean;
} = {
  isOpen: false,
  isLogedIn: false,
};

const { useGlobalState } = createGlobalState(initialState);

export const useLoginModal = () => {
  const [isOpen, setIsOpen] = useGlobalState("isOpen");
  const [isLogedIn, setIsLogedIn] = useGlobalState("isLogedIn");

  return {
    isOpen,
    isLogedIn,
    setIsLogedIn,
    openLoginModal: () => setIsOpen(true),
    closeLoginModal: () => setIsOpen(false),
  };
};
