import type * as React from "react";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ModalProps,
  NativeSyntheticEvent,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useBackground } from "~/lib/context/background";

type CustomModalProps = ModalProps & {
  noCloseButton?: boolean;
};

export const CustomModal: React.FC<CustomModalProps> = ({
  children,
  visible,
  ...props
}) => {
  const { addBlur, removeBlur } = useBackground();

  const [hasAddedBlur, setHasAddedBlur] = useState(false);

  useEffect(() => {
    if (visible) {
      addBlur();
      setHasAddedBlur(true);
    }
  }, [visible, addBlur, removeBlur, setHasAddedBlur]);

  useEffect(() => {
    return () => {
      if (hasAddedBlur && visible) {
        removeBlur();
        setHasAddedBlur(false);
      }
    };
  }, [hasAddedBlur, removeBlur, visible]);
  return (
    <View className="flex-1 justify-center items-center h-0">
      <Modal
        visible={visible}
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
  visible,
  ...props
}) => {
  const { className, ...rest } = props;

  const handleOnRequestClose = () => {
    if (onRequestClose) {
      onRequestClose();
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsModalOpen(true);
    }
  }, [visible, setIsModalOpen]);

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setIsModalOpen(false), 0);
    }
  }, [visible, setIsModalOpen]);

  return (
    <CustomModal
      {...rest}
      visible={isModalOpen}
      onRequestClose={handleOnRequestClose}
    >
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
                    "bg-white dark:bg-primary-darker rounded-3xl rounded-b-none p-6 pt-6",
                    className,
                  )}
                  {...rest}
                >
                  <View
                    className={
                      "h-[6px] bg-neutral-900/30 w-16 rounded-xl mx-auto mb-4 "
                    }
                  ></View>
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

export const FullHeightModal = ({
  children,
  onRequestClose,
  noCloseButton = false,
  ...props
}: CustomModalProps) => {
  return (
    <CustomModal
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onRequestClose}
      {...props}
    >
      <View className="flex-1 justify-end">
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: width,
            height: height,
          }}
          intensity={30}
          tint="dark"
          experimentalBlurMethod={"dimezisBlurView"}
        />
        <View className="bg-primary-light dark:bg-primary-darker rounded-t-3xl h-[85%] p-6 relative">
          {!noCloseButton && (
            <TouchableOpacity
              onPress={onRequestClose}
              className="absolute right-6 top-6"
            >
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          )}
          {children}
        </View>
      </View>
    </CustomModal>
  );
};

export const FullScreenModal = ({
  children,
  onRequestClose,
  noCloseButton = false,
  cardClassname,
  ...props
}: CustomModalProps & { cardClassname?: string }) => {
  const onClose = (e: NativeSyntheticEvent<any>): void => {
    if (onRequestClose) {
      onRequestClose(e);
    }
  };
  return (
    <CustomModal
      animationType={"fade"}
      presentationStyle={"overFullScreen"}
      onRequestClose={onClose}
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
        <Card
          className={cn(
            "h-min relative p-6 justify-center items-center max-w-[90vw]",
            cardClassname,
          )}
        >
          {!noCloseButton && (
            <TouchableOpacity
              onPress={onClose}
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
