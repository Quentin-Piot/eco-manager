import React, { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";

type BackgroundContextType = {
  blurredCount: number;
  isBlurred: boolean;
  addBlur: () => void;
  removeBlur: () => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blurredCount, setBlurredCount] = useState(0);

  const addBlur = useCallback(() => {
    setBlurredCount((count) => count + 1);
  }, []);

  const removeBlur = useCallback(() => {
    setBlurredCount((count) => Math.max(0, count - 1));
  }, []);

  const isBlurred = blurredCount > 0;

  return (
    <BackgroundContext.Provider
      value={{ blurredCount, isBlurred, addBlur, removeBlur }}
    >
      {isBlurred && (
        <View
          className={"absolute top-0 left-0 w-full h-full z-50"}
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        />
      )}
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
