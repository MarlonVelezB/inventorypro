import { LoginFeatures, LoginForm, LoginHeader } from "../features/auth";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <LoginHeader />
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Right Panel - Features (Hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-muted/30 px-8 py-12">
          <div className="w-full max-w-lg">
            <LoginFeatures />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} InventoryPro. Todos los derechos
              reservados.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-smooth">
                Términos de Servicio
              </button>
              <button className="hover:text-foreground transition-smooth">
                Política de Privacidad
              </button>
              <button className="hover:text-foreground transition-smooth">
                Soporte
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
