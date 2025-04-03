import { PropsWithChildren } from "react";
import { View } from "react-native";

function MainLayout({ children }: PropsWithChildren) {
  return <View className={"w-full h-full bg-background"}>{children}</View>;
}

export default MainLayout;
