import { Input } from "antd";
import type React from "react";
import type { InputProps } from "../../types/component.types";

const InputComponet: React.FC<InputProps> = (props) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label htmlFor={props.id}>{props.label}</label>
      {props.type === "password" ? (
        <Input.Password id={props.id} {...props} />
      ) : (
        <Input id={props.id} {...props} />
      )}
    </div>
  );
};

export default InputComponet;
