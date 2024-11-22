import React, { useCallback, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import TextInput, { TextInputProps } from "../basic/TextInput";

export interface FormTextInputProps extends TextInputProps {
  name: string;
  trimText?: boolean;
  regExp?: RegExp;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  trimText,
  regExp,
  ...props
}): JSX.Element => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    control,
    name,
  });

  const previousText = useRef<string>("");

  const handleChange = useCallback(
    (text: string) => {
      let newText = text;
      if (regExp && !regExp?.test(text)) {
        newText = previousText.current;
      }
      if (trimText) {
        const trimmedText = newText.trim();
        previousText.current = trimmedText;
        field.onChange(trimmedText);
      } else {
        previousText.current = newText;
        field.onChange(newText);
      }
      props?.onChangeText && props.onChangeText(newText);
    },
    [field, regExp, trimText]
  );

  return (
    <TextInput
      {...props}
      onChangeText={handleChange}
      //onFocus={field.onFocus}
      onBlur={field.onBlur}
      value={field?.value}
      error={fieldState.error?.message}
    />
  );
};

export default FormTextInput;
