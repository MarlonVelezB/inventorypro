import type React from "react";
import { Icon } from "../../components";

const LoginHeader: React.FC = () => {
    return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-(--color-blue-primary) rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Package" size={32} color="white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-2">
        InventoryPro
      </h1>
      
      <p className="text-muted-foreground text-lg">
        Sistema de Gestión de Inventario
      </p>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Inicia sesión para acceder a tu panel de control
        </p>
      </div>
    </div>
    );
};

export default LoginHeader;