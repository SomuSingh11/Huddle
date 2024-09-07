"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";

import { useEffect, useState } from "react";

export const ModalProvider = () => {
  // TO Suppress Hydration ---- Preventing modals to be rendered on server side
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
    </>
  );
};
