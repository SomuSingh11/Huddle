// The useModal hook provides centralized control over the modal dialogs in your application,
// allowing you to open and close modals and track the currently active modal type.

import { create } from "zustand"; // The create function from Zustand is used to create a custom store that manages state.

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null; // This keeps track of which modal is currently open.
  isOpen: boolean; // A boolean that indicates whether any modal is open (true) or closed.
  onOpen: (type: ModalType) => void; // A function to open a modal of a specific type. When this function is called, it sets the isOpen flag to true and the type to the passed modal type.
  onClose: () => void; // A function to close the modal. It sets the isOpen flag to false and resets the type to null.
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
