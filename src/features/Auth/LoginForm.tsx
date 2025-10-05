import { Button, Checkbox, type CheckboxProps } from "antd";
import { Icon } from "../../components";
import InputComponet from "../../components/ui/Input";

const LobginForm = () => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  return (
    // onSubmit={handleSubmit}
    <form className="space-y-6">
      <div className="space-y-4">
        <InputComponet
          id="user"
          size="large"
          placeholder="large size"
          prefix={<Icon name="User" />}
          label="User Name"
        />
        <InputComponet
          id="password"
          type="password"
          size="large"
          placeholder="large size"
          prefix={<Icon name="KeyRound" />}
          label="Password"
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox onChange={onChange}>Recordar Sesion</Checkbox>
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-smooth focus:outline-none focus:underline"
        >
          ¿Olvidé mi contraseña?
        </button>
      </div>

      <Button
        className="w-full"
        type="primary"
        icon={<Icon name="LogIn" />}
        size="large"
      >
        Iniciar Sesion
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-500">¿No tienes cuenta? </span>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 transition-all duration-200 focus:outline-none underline-offset-4 hover:underline"
        >
          Registrarse
        </button>
      </div>
    </form>
  );
};

export default LobginForm;
