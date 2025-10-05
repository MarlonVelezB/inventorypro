import { Icon } from "../../components";
import type { PageInfo } from "../../types/componentTypes";

const LoginFeatures = () => {
  const features: PageInfo[] = [
    {
      icon: "Package",
      title: "Gestión de Productos",
      description:
        "Registra y administra tu inventario con múltiples precios y características personalizadas",
    },
    {
      icon: "Warehouse",
      title: "Multi-Almacén",
      description:
        "Controla el stock en múltiples ubicaciones con asignación inteligente de inventario",
    },
    {
      icon: "Users",
      title: "Gestión de Clientes",
      description:
        "Administra información completa de clientes con códigos únicos y datos de contacto",
    },
    {
      icon: "FileText",
      title: "Pre-facturación",
      description:
        "Genera pre-facturas con cálculos automáticos de IVA, descuentos y totales",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Potencia tu Negocio
        </h2>
        <p className="text-muted-foreground">
          Optimiza la gestión de inventario con nuestras herramientas
          profesionales
        </p>
      </div>
      <div className="grid gap-6">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-card/50 rounded-lg border border-border/50 hover:bg-card transition-smooth"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {feature?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm font-medium text-success">
            Seguridad Garantizada
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tus datos están protegidos con encriptación de nivel empresarial y
          respaldo automático en la nube.
        </p>
      </div>
    </div>
  );
};

export default LoginFeatures;
