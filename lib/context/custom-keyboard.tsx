import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type CustomKeyboardContextType = {
  result: string;
  displayExpression: string;
  setResult: (value: string) => void;
  setDisplayExpression: (value: string) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const CustomKeyboardContext = createContext<
  CustomKeyboardContextType | undefined
>(undefined);

export function CustomKeyboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [result, setResult] = useState("");
  const [displayExpression, setDisplayExpression] = useState("");

  return (
    <CustomKeyboardContext.Provider
      value={{
        isVisible,
        setIsVisible,
        result,
        setResult,
        displayExpression,
        setDisplayExpression,
      }}
    >
      {children}
    </CustomKeyboardContext.Provider>
  );
}

export function useCustomKeyboard() {
  const context = useContext(CustomKeyboardContext);
  if (context === undefined) {
    throw new Error(
      "useCustomKeyboard must be used within a CustomKeyboardProvider",
    );
  }
  return context;
}

const calculatorButtons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ",", "=", "+"],
  ["C", "⌫"],
];

export const CustomKeyboard = () => {
  const { isVisible, setDisplayExpression, setResult } = useCustomKeyboard();

  const [expression, setExpression] = useState("");

  if (!isVisible) {
    return null;
  }

  const handleInputChange = (text: string) => {
    // Allow only numbers, operators, comma, and spaces
    if (!/^[\d+\-*/(),\.\s]*$/.test(text)) {
      return;
    }

    setExpression(text);
    setDisplayExpression(text);

    const evaluatedResult = evaluateExpression(text);
    if (evaluatedResult !== null) {
      setResult(evaluatedResult);
    } else {
      setResult("");
    }
  };

  const handleCalculatorInput = (input: string) => {
    let newExpression = expression;

    if (input === "C") {
      // Clear all
      newExpression = "";
    } else if (input === "⌫") {
      // Backspace - remove last character
      newExpression = newExpression.slice(0, -1);
    } else if (input === "=") {
      // Evaluate and set result
      const evaluatedResult = evaluateExpression(newExpression);
      if (evaluatedResult !== null) {
        newExpression = evaluatedResult;
      }
    } else {
      // Append input to expression
      if (["+", "-", "*", "/"].includes(input)) {
        // Replace last operator if exists
        const lastChar = newExpression.slice(-1);
        if (["+", "-", "*", "/"].includes(lastChar)) {
          newExpression = newExpression.slice(0, -1) + input;
        } else {
          newExpression += input;
        }
      } else {
        newExpression += input;
      }
    }

    handleInputChange(newExpression);
  };

  const evaluateExpression = (expr: string) => {
    try {
      // Remove spaces and replace comma with dot for calculation
      const sanitizedExpr = expr.replace(/\s/g, "").replace(/,/g, ".");

      // Basic validation
      if (!/^[\d+\-*/(),.\s]+$/.test(sanitizedExpr)) {
        return null;
      }

      // Split by operators to get numbers
      const numbers = sanitizedExpr
        .split(/([+\-*/])/g)
        .filter((n) => n.trim() !== "");

      if (numbers.length === 1) {
        // Single number case
        return parseFloat(numbers[0]).toFixed(2).replace(/\./g, ",");
      } else if (numbers.length === 3) {
        // Operation case: number operator number
        const num1 = parseFloat(numbers[0]);
        const operator = numbers[1];
        const num2 = parseFloat(numbers[2]);

        let result;
        switch (operator) {
          case "+":
            result = num1 + num2;
            break;
          case "-":
            result = num1 - num2;
            break;
          case "*":
            result = num1 * num2;
            break;
          case "/":
            result = num1 / num2;
            break;
          default:
            return null;
        }

        return result.toFixed(2).replace(/\./g, ",");
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <View className=" gap-1 p-4 bg-white w-[100vw] z-50  bottom-0 absolute left-0 right-0">
      {calculatorButtons.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-1">
          {row.map((button) => (
            <Button
              key={button}
              onPress={() => handleCalculatorInput(button)}
              className={`flex-1 h-12 ${button === "=" ? "bg-primary" : ""}`}
              variant={["C", "⌫"].includes(button) ? "destructive" : "default"}
            >
              <Text
                className={`text-lg ${["C", "⌫"].includes(button) ? "text-destructive-foreground" : "text-primary-foreground"}`}
              >
                {button}
              </Text>
            </Button>
          ))}
        </View>
      ))}
    </View>
  );
};
