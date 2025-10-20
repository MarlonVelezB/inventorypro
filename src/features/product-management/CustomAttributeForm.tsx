import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { Product, ProductTag } from "../../types/business.types";
import InputForm from "../../components/ui/InputForm";
import { Icon } from "../../components";
import { Button, Divider, Input, message, type InputRef } from "antd";
import SelectComponent from "../../components/ui/SelectComponent";
import { useRef, useState } from "react";

const CustomAttributeForm: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Product>();

  const [showInputTag, setShowInputtag] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useRef<InputRef>(null);

  const {
    fields: fieldsAttribute,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "additionalFeatures",
  });

  const {
    fields: fieldsTag,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const handleEditInputConfirm = () => {
    const tagExist = fieldsTag.find(
      (tag: ProductTag) => tag.value.toLowerCase() === newTagValue.toLowerCase()
    );

    if (!tagExist) {
      appendTag({ value: newTagValue });
      messageApi.success("Tag added");
      setNewTagValue("");
      setShowInputtag(false);
    } else {
      messageApi.error("This tag has already been added");
      inputRef.current?.select();
    }
  };

  return (
    <div className="bg-white p-3">
      {contextHolder}
      <div className="space-y-6">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectComponent
              {...field}
              className="w-full"
              keyName="status"
              label="Product Status"
              placeholder="ACTIVE"
              required={false}
              errors={errors}
              defaultValue={{ value: "ACTIVE", label: "Active" }}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "DISCONTINUED", label: "Discontinued" },
              ]}
            />
          )}
        />

        <Divider orientation="left">Product Tags</Divider>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              type="dashed"
              icon={<Icon name="Plus" />}
              onClick={() => setShowInputtag(true)}
              className="text-blue-500 border-blue-500 hover:bg-blue-50 w-fit"
            >
              Add Tag
            </Button>

            {showInputTag && (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={newTagValue}
                  type="text"
                  placeholder="Enter a tag name"
                  onChange={(value) => setNewTagValue(value.target.value)}
                />
                <div className="flex items-center">
                  <Button
                    disabled={!newTagValue}
                    color="primary"
                    variant="text"
                    icon={<Icon name="Check" size={16} />}
                    onClick={handleEditInputConfirm}
                  />
                  <Button
                    color="danger"
                    variant="text"
                    icon={<Icon name="X" size={16} />}
                    onClick={() => setShowInputtag(false)}
                  />
                </div>
              </div>
            )}

            {fieldsTag.length === 0 && (
              <div className="text-center p-2 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 w-full">
                <p className="text-slate-500">No tags defined</p>
              </div>
            )}

            {fieldsTag.map((field: ProductTag, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm font-medium">{field.value}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-blue-100 p-1 rounded-full transition-colors duration-200"
                >
                  <Icon name="Trash" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Divider orientation="left">Product Attributes</Divider>

        <div className="space-y-4">
          {fieldsAttribute.map((field: any, index: number) => (
            <div
              key={field.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  {/* Label del atributo */}
                  <Controller
                    name={`additionalFeatures.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <InputForm
                        {...field}
                        type="text"
                        keyName="label"
                        label="Label"
                        placeholder="e.g. Color, Size, Material"
                        required
                        errors={errors.additionalFeatures?.[index] || {}}
                      />
                    )}
                  />

                  <Controller
                    name={`additionalFeatures.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <InputForm
                        {...field}
                        type="text"
                        keyName="value"
                        label="Value"
                        placeholder="e.g. Blue, XL, 100% Cotton"
                        required
                        errors={errors.additionalFeatures?.[index] || {}}
                      />
                    )}
                  />
                </div>

                {/* Botón eliminar atributo */}
                {fieldsAttribute.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded transition"
                    title="Delete attribute"
                  >
                    <Icon name="Trash2" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button
            type="dashed"
            icon={<Icon name="Plus" />}
            block
            onClick={() =>
              appendAttribute({
                key: "",
                value: "",
              })
            }
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
          >
            Add Attribute
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomAttributeForm;
