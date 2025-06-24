import { Alert, Platform } from "react-native";
import { colors } from "~/lib/theme";

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

const createDialog = (
  title: string,
  description?: string,
  options?: AlertButton[],
): HTMLDialogElement => {
  const dialog = document.createElement("dialog");
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "8px";
  dialog.style.border = "none";
  dialog.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  dialog.style.maxWidth = "400px";
  dialog.style.width = "90%";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.backgroundColor = "#fff";
  dialog.style.color = "#333";

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;
  titleElement.style.marginTop = "0";
  titleElement.style.marginBottom = description ? "10px" : "20px";
  titleElement.style.color = "#333";
  dialog.appendChild(titleElement);

  if (description) {
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;
    descriptionElement.style.marginBottom = "20px";
    descriptionElement.style.fontSize = "14px";
    descriptionElement.style.lineHeight = "1.5";
    descriptionElement.style.color = "#555";
    dialog.appendChild(descriptionElement);
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "flex-end";
  buttonContainer.style.gap = "10px";
  dialog.appendChild(buttonContainer);

  options?.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text || "";
    button.style.padding = "10px 15px";
    button.style.borderRadius = "5px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.fontWeight = "bold";
    button.style.transition = "background-color 0.2s ease, transform 0.1s ease";

    if (option.style === "cancel") {
      button.style.backgroundColor = "#e0e0e0";
      button.style.color = "#333";
      button.onmouseover = () => (button.style.backgroundColor = "#d0d0d0");
      button.onmouseout = () => (button.style.backgroundColor = "#e0e0e0");
    } else if (option.style === "destructive") {
      button.style.backgroundColor = "#dc3545";
      button.style.color = "#fff";
      button.onmouseover = () => (button.style.backgroundColor = "#c82333");
      button.onmouseout = () => (button.style.backgroundColor = "#dc3545");
    } else {
      button.style.backgroundColor = colors.primary.DEFAULT;
      button.style.color = "#fff";
      button.onmouseover = () => (button.style.opacity = "0.9");
      button.onmouseout = () => (button.style.opacity = "1");
    }

    button.onmousedown = () => (button.style.transform = "scale(0.98)");
    button.onmouseup = () => (button.style.transform = "scale(1)");

    button.addEventListener("click", () => {
      option.onPress?.();
      dialog.close();
      dialog.addEventListener("transitionend", () => dialog.remove(), {
        once: true,
      });
    });
    buttonContainer.appendChild(button);
  });

  return dialog;
};

const alertWeb = (
  title: string,
  description?: string,
  options?: AlertButton[],
  _extra?: Record<string, any>,
): void => {
  const dialog = createDialog(title, description, options);
  document.body.appendChild(dialog);
  dialog.showModal();
};

const alert = Platform.OS === "web" ? alertWeb : Alert.alert;

export default alert;
