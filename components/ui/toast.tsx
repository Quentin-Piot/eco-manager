import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors } from "~/lib/theme";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.secondary.light,
        backgroundColor: colors.secondary.DEFAULT,
        borderRadius: 16,
        paddingVertical: 0,
        height: 50,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: "600",
        color: "white",
      }}
      text2Style={{
        fontSize: 14,
        color: colors.primary.dark,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error,
        backgroundColor: colors.error,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: "white",
      }}
      text2Style={{
        fontSize: 14,
        color: "white",
      }}
    />
  ),
};

export const showToast = ({
  type = "success",
  title,
  message,
}: {
  type?: "success" | "error";
  title: string;
  message?: string;
}) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "bottom",
    visibilityTime: 3000,
    bottomOffset: 85,
  });
};
