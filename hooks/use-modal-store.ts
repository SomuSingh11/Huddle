// The useModal hook provides centralized control over the modal dialogs in your application,
// allowing you to open and close modals and track the currently active modal type.

import { Server } from "@prisma/client";
import { create } from "zustand"; // The create function from Zustand is used to create a custom store that manages state.

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer";

// Define the shape of the data that can be associated with a modal : Ex: We open up a invite Modal that needs information about the Server.
interface ModalData {
  server?: Server;
}

interface ModalStore {
  type: ModalType | null; // This keeps track of which modal is currently open.
  data: ModalData; // Data associated with the currently open modal
  isOpen: boolean; // A boolean that indicates whether any modal is open (true) or closed.
  onOpen: (type: ModalType, data?: ModalData) => void; // A function to open a modal of a specific type. When this function is called, it sets the isOpen flag to true and the type to the passed modal type.
  onClose: () => void; // A function to close the modal. It sets the isOpen flag to false and resets the type to null.
}

// Create the Zustand store to manage modal state
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }), // Update store to open a modal with the specified type and data
  onClose: () => set({ type: null, isOpen: false }),
}));
