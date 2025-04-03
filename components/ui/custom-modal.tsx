import type * as React from "react";
import {
  Dimensions,
  Modal,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

type CustomModalProps = ModalProps & {
  noCloseButton?: boolean;
};

export const CustomModal: React.FC<CustomModalProps> = ({
  children,
  ...props
}) => {
  return (
    <View className="flex-1 justify-center items-center h-0">
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
        {...props}
      >
        {children}
      </Modal>
    </View>
  );
};

type BottomModalProps = CustomModalProps & {
  closeOnClickOutside?: boolean;
  onRequestClose?: () => void;
};

export const BottomModal: React.FC<BottomModalProps> = ({
  children,
  closeOnClickOutside = true,
  onRequestClose,
  ...props
}) => {
  const { className, ...rest } = props;

  const handleOnRequestClose = () => {
    if (onRequestClose) {
      onRequestClose();
    }
  };

  return (
    <CustomModal {...rest} onRequestClose={handleOnRequestClose}>
      <View className="flex-1 justify-end">
        {closeOnClickOutside ? (
          <TouchableWithoutFeedback onPress={handleOnRequestClose}>
            <View className="flex-1 justify-end">
              <TouchableWithoutFeedback
                onPress={(event) => {
                  event.stopPropagation();
                }}
              >
                <View
                  className={cn(
                    "bg-primary-light dark:bg-primary-darker rounded-3xl p-6 shadow-lg shadow-primary-darker",
                    className,
                  )}
                  {...rest}
                >
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View className="flex-1 justify-end">
            <View
              className={cn(
                "bg-primary-light dark:bg-primary-darker rounded-3xl p-6",
                className,
              )}
              {...rest}
            >
              {children}
            </View>
          </View>
        )}
      </View>
    </CustomModal>
  );
};

const { width, height } = Dimensions.get("window");

export const FullScreenModal = ({
  children,
  onRequestClose,
  noCloseButton = false,
  ...props
}: CustomModalProps) => {
  return (
    <CustomModal
      animationType={"fade"}
      presentationStyle={"overFullScreen"}
      onRequestClose={onRequestClose}
      {...props}
    >
      <BlurView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
        }}
        className="justify-center items-center"
        intensity={30}
        tint="dark"
        experimentalBlurMethod={"dimezisBlurView"}
      />
      <View className={"flex-1 justify-center items-center"}>
        <Card className={"h-[320px] relative p-6"}>
          {!noCloseButton && (
            <TouchableOpacity
              onPress={onRequestClose}
              className={"absolute right-8 top-8"}
            >
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          )}
          {children}
        </Card>
      </View>
    </CustomModal>
  );
};
