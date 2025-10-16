# 🐻 Zustand para Juniors: Creando un Store Paso a Paso

¡Felicidades por elegir **Zustand**! Es una librería increíblemente sencilla para la gestión de estado. Aquí tienes tu guía rápida.

## ¿Por qué Zustand? 🤔

Simplicidad: Su API es mínima y fácil de entender.

No boilerplate: Requiere muy poco código de configuración.

Hooks: Utiliza la filosofía de hooks de React, lo que lo hace familiar y eficiente.

## Conceptos Clave

| Concepto     | Significado                                                          | Analogía Simple                                          |
| :----------- | :------------------------------------------------------------------- | :------------------------------------------------------- |
| **Store**    | El contenedor central que guarda el estado y las acciones.           | El _cajón_ de tu escritorio.                             |
| **State**    | Los datos que almacena el _Store_ (ej: `count: 0`).                  | El _contenido_ dentro del cajón.                         |
| **Actions**  | Las funciones que defines para **cambiar** el estado.                | Las _instrucciones_ para mover o modificar el contenido. |
| **Selector** | La forma en que tu componente "mira" y extrae una parte del _State_. | El _ojo_ que solo mira el lapicero en el cajón.          |

---

## 1 Instalación

```bash
npm install zustand
# o
yarn add zustand
```

## 🛠️ 2. Creación del Store (Contador Básico)

Definiremos nuestro estado inicial y las funciones para manipularlo. Este código típicamente reside en un archivo llamado `useCounterStore.js`.

```javascript
// useCounterStore.js
import { create } from "zustand";

// 1. Uso de 'create' para definir el store
const useCounterStore = create((set) => ({
  // 2. Estado inicial
  count: 0,
  title: "Mi Contador Zustand",

  // 3. Acciones (funciones para modificar el estado)
  // 'set' es la función que Zustant nos da para actualizar el estado
  increment: () => set((state) => ({ count: state.count + 1 })),

  decrement: () => set((state) => ({ count: state.count - 1 })),

  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

### Explicación del Código:

- create((set) => ({...})): La función create recibe una función que retorna un objeto. Este objeto contiene el estado y las acciones.
- set: Es la función clave de Zustand. La usas para mezclar (fusionar) el nuevo estado con el estado actual.
- Puedes pasarle un objeto con el nuevo estado (set({ count: 0 })).
- O puedes pasarle una función (set((state) => ({...}))) que recibe el estado actual (state) y retorna el nuevo estado. Esto es crucial cuando el nuevo estado depende del estado anterior (como en increment).

## 3. Consumo en un Componente React

El store se consume en cualquier componente mediante el hook generado (useCounterStore).

```javascript
// CounterComponent.jsx
// CounterComponent.jsx
import useCounterStore from "./useCounterStore";

function CounterComponent() {
  // 1. Selector: Extraer solo las partes del estado que necesitamos
  // Esto evita que el componente se renderice si solo cambia 'title' y no 'count'
  const count = useCounterStore((state) => state.count);
  const title = useCounterStore((state) => state.title);

  // 2. Selector para las Acciones: Extraer las funciones
  const { increment, decrement, reset } = useCounterStore();

  // Nota: También puedes extraer todo en una línea si quieres:
  // const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <h2>
        {title}
        [Image of a bear paw print]
      </h2>
      <p>Valor Actual: ⚛️ **{count}**</p>
      <button onClick={increment}>Aumentar (+)</button>
      <button onClick={decrement} style={{ margin: "0 10px" }}>
        Disminuir (-)
      </button>
      <button onClick={reset}>Resetear</button>
    </div>
  );
}

export default CounterComponent;
```

### Explicación del Código:

- useCounterStore((state) => state.count): Esto es un selector. Le estás diciendo a Zustand: "dame solo la propiedad count del estado". Zustand es inteligente; solo re-renderizará el componente si el valor de count cambia.

## 🎯 Casos de Uso Comunes

Zustand es ideal para casi cualquier aplicación React, pero brilla en:

- Estado Global Simple: Datos del usuario autenticado, configuraciones de tema (dark/light mode), etc.
- Estado Complejo con Muchas Acciones: Carrito de compras, estado de un formulario complejo, etc.
- Estado de Componentes Lejanos: Cuando necesitas que dos componentes muy separados compartan el mismo estado sin pasar props a través de muchos niveles.

# 🎣 RHF, Yup y TypeScript: Formulario Profesional para Juniors

Esta guía combina **React Hook Form (RHF)** para el rendimiento, **Yup** para la validación de esquemas (que es mucho más potente que la validación nativa de RHF), y **TypeScript (TS)** para asegurar el tipado de los datos.

## 1. Conceptos Clave Adicionales

| Concepto          | Función Principal                                                          | Rol en RHF + Yup                                                                     |
| :---------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Yup**           | Una librería para construir esquemas de validación de objetos.             | Define _qué_ forma deben tener los datos y los mensajes de error.                    |
| **`resolver`**    | Una opción de RHF para integrar librerías de validación externas como Yup. | Conecta el esquema de Yup con el hook `useForm()`.                                   |
| **`yupResolver`** | Un _adapter_ (paquete) que hace que Yup funcione con RHF.                  | Traduce los errores de Yup al formato que RHF necesita.                              |
| **TypeScript**    | Lenguaje que añade tipado estático a JavaScript.                           | Asegura que los datos del formulario (`data`) siempre tengan la estructura correcta. |

---

## 2. Implementación Paso a Paso (Login con Yup y TS)

Utilizaremos un formulario simple con `email` y `password`.

### 2.1. Instalación de Dependencias

Necesitas el paquete principal de RHF, Yup, y el _resolver_ específico para RHF.

```bash
# Instala RHF y Yup
npm install react-hook-form yup

# Instala el paquete que conecta Yup con RHF
npm install @hookform/resolvers
# o
yarn add react-hook-form yup @hookform/resolvers
```

### 2.2. Definición del Esquema (Yup) y Tipos (TS)

Crea un archivo (ej., validationSchema.ts) para definir las reglas de validación y el tipo de dato esperado.

```javascript
// validationSchema.ts
import * as yup from "yup";

// 1. DEFINICIÓN DEL TIPO (TypeScript Interface)
// Esto asegura que la función onSubmit SIEMPRE recibirá un objeto con estas propiedades
export interface ILoginFormInputs {
  email: string;
  password: string;
}

// 2. DEFINICIÓN DEL ESQUEMA DE VALIDACIÓN (Yup)
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("El email es obligatorio.")
    .email("Debe ser un formato de email válido."),

  password: yup
    .string()
    .required("La contraseña es obligatoria.")
    .min(6, "Mínimo 6 caracteres para la contraseña."),
});
```

### 2.3. Componente con RHF, Yup y TS

Ahora, integramos todo en el componente (LoginForm.tsx).

```javascript
// LoginForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // Importamos el resolver
import { loginSchema, ILoginFormInputs } from './validationSchema';

function LoginForm() {
  // 1. Inicialización de useForm CON TIPADO Y RESOLVER
  // Especificamos el tipo <ILoginFormInputs> para que TypeScript sepa qué datos esperamos.
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginFormInputs>({
    // 2. CONEXIÓN CLAVE: Aquí se integra el esquema de Yup
    resolver: yupResolver(loginSchema),
  });

  // 3. Función onSubmit (ahora 'data' está tipada gracias a TypeScript)
  const onSubmit = (data: ILoginFormInputs) => {
    console.log('Validación exitosa, datos:', data);
    // TS sabe que 'data' tiene 'email' y 'password'
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* CAMPO DE EMAIL */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          // RHF se encarga de la conexión
          {...register("email")}
        />
        {/* Los errores vienen directamente de Yup */}
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      {/* CAMPO DE CONTRASEÑA */}
      <div style={{ marginTop: '15px' }}>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          {...register("password")}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
      </div>

      <button type="submit" style={{ marginTop: '20px' }}>
        Iniciar Sesión
      </button>
    </form>
  );
}

export default LoginForm;¬
```

### 4. Beneficios de Usar Yup y TS

| Herramienta | Beneficio |
| :--- | :--- |
| **Yup** | **Separación de Responsabilidades:** Las reglas de validación están fuera del componente, manteniéndolo limpio. Ideal para reglas complejas o que se repiten. |
| **TypeScript** | **Seguridad de Tipos:** Garantiza que los datos recibidos en `onSubmit` coincidan exactamente con el esquema validado por Yup, eliminando errores comunes en tiempo de ejecución. |
| **RHF** | **Rendimiento:** Sigue garantizando que el componente no se re-renderice en cada pulsación de tecla, ya que la validación se dispara solo en eventos importantes (`blur`, `submit`) y a través del `resolver`. |