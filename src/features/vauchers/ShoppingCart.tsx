import { Button, Input, Image } from "antd";
import { Icon } from "../../components";
import { getPrice } from "../../utils/utils";
import type { ProductImage } from "../../types/business.types";

interface ShoppingCartProps {
  cartItems: any[];
  onQuantityChange: (itemId: string | number, newQuantity: number) => void;
  onRemoveItem: (itemId: string | number) => void;
  className?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onQuantityChange,
  onRemoveItem,
  className = "",
}) => {
  const handleQuantityChange = (
    itemId: string | number,
    newQuantity: string
  ) => {
    const item = cartItems?.find((item) => item?.id === itemId);
    if (!item) return;

    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      onRemoveItem(itemId);
      return;
    }

    if (quantity > item?.availableStock) {
      alert(
        `Stock insuficiente. Solo hay ${item?.availableStock} unidades disponibles.`
      );
      return;
    }

    onQuantityChange(itemId, quantity);
  };

  const getTotalItems = () => {
    return cartItems?.reduce((total, item) => total + item?.quantity, 0);
  };

  if (cartItems?.length === 0) {
    return (
      <div
        className={`bg-(--color-card) border border-(--color-border) rounded-lg p-6 ${className}`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Icon
            name="ShoppingCart"
            size={20}
            className="text-(--color-primary)"
          />
          <h3 className="text-lg font-semibold text-foreground">
            Shopping Cart
          </h3>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            0 products
          </span>
        </div>

        <div className="text-center py-8">
          <Icon
            name="ShoppingCart"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="text-muted-foreground mb-2">The cart is empty</p>
          <p className="text-sm text-muted-foreground">
            Search and add products to create the pre-invoice
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-(--color-card) border border-(--color-border) rounded-lg ${className}`}
    >
      <div className="p-4 border-b border-(--color-border)">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon
              name="ShoppingCart"
              size={20}
              className="text-(--color-primary)"
            />
            <h3 className="text-lg font-semibold text-(--color-foreground)">
              Shopping Cart
            </h3>
          </div>
          <span className="bg-[var(--color-primary)]/10 text-(--color-primary) text-sm px-3 py-1 rounded-full">
            {getTotalItems()} products
          </span>
        </div>
      </div>
      <div className="p-4">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--color-border)">
                  <th className="text-left py-3 text-sm font-medium text-(--color-muted-foreground) w-24">
                    Product
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-(--color-muted-foreground) w-24">
                    Quantity
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-(--color-muted-foreground) w-24">
                    Price
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-(--color-muted-foreground) w-24">
                    Total
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-(--color-muted-foreground) w-16">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b border-(--color-border) last:border-b-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-15 h-12 bg-(--color-muted) rounded-lg overflow-hidden flex items-center justify-center">
                          <Image.PreviewGroup
                            items={item?.images.map(
                              (imagen: ProductImage) => imagen.url
                            )}
                          >
                            <Image
                              src={
                                item?.images?.[0]?.url ||
                                "/assets/images/no_image.png"
                              }
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "/assets/images/no_image.png";
                              }}
                              className="w-full h-full object-cover rounded-lg cursor-pointer"
                              preview={{
                                mask: <Icon name="Eye" />,
                              }}
                            />
                          </Image.PreviewGroup>
                        </div>

                        <div>
                          <p className="font-medium text-(--color-foreground) text-sm">
                            {item?.name}
                          </p>
                          <p className="text-xs text-(--color-muted-foreground)">
                            SKU: {item?.sku}
                          </p>
                          {/* <p className="text-xs text-(--color-success)">
                        {item?.availableStock} available
                      </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <Input
                        type="number"
                        min="1"
                        max={item?.availableStock}
                        value={item?.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item?.id, e?.target?.value)
                        }
                        className="w-10 text-center"
                      />
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-(--color-foreground)">
                      {/* ${item?.price?.toFixed(2)} */}$
                      {getPrice(item?.prices)}
                    </td>
                    <td className="py-4 text-right text-sm font-semibold text-(--color-primary)">
                      ${item?.lineTotal?.toFixed(2)}
                    </td>
                    <td className="py-4 text-center">
                      <Button
                        variant="outlined"
                        onClick={() => onRemoveItem(item?.id)}
                        icon={<Icon name="Trash2" size={16} />}
                        className="text-(--color-destructive) hover:text-[var(--color-destructive)]/80"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {cartItems?.map((item) => (
            <div
              key={item?.id}
              className="bg-muted/50 border border-border rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/images/no_image.png";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {item?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item?.sku}
                      </p>
                      <p className="text-xs text-success">
                        {item?.availableStock} available
                      </p>
                    </div>
                    <Button
                      variant="outlined"
                      onClick={() => onRemoveItem(item?.id)}
                      icon={<Icon name="Trash2" size={16} />}
                      className="text-destructive hover:text-destructive/80"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Quantity:
                      </span>
                      <Input
                        type="number"
                        min="1"
                        max={item?.availableStock}
                        value={item?.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item?.id, e?.target?.value)
                        }
                        className="w-16 text-center"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        ${item?.price?.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        ${item?.lineTotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
