import React from 'react';

// Define las props, por si quieres que el mensaje de error sea dinámico
interface ServerErrorScreenProps {
  errorCode?: number; // Podría ser 500, 503, etc.
  supportEmail?: string; 
}

const ServerErrorScreen: React.FC<ServerErrorScreenProps> = ({ 
  errorCode = 500, 
  supportEmail = 'soporte@tuempresa.com' 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center p-8 md:p-12 lg:p-16 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full">
        {/* Sección Visual/Icono */}
        <div className="mb-8">
          {/* Un número grande o un icono representativo */}
          <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {errorCode}
          </h1>
          {/*  */}
        </div>

        {/* Sección de Mensaje Central */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Vaya! Algo salió mal en el servidor.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Parece que hemos encontrado un pequeño problema técnico. No te preocupes, no es tu culpa.
        </p>

        {/* Sección de Acciones y Contacto */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            🔄 Intentar de Nuevo
          </button>
          <a
            href="/"
            className="block sm:inline-block w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg ml-0 sm:ml-4 transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🏡 Ir a la Página de Inicio
          </a>
        </div>
        
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Si el problema persiste, contacta a soporte en <a href={`mailto:${supportEmail}`} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 font-medium">{supportEmail}</a>
        </p>
      </div>
    </div>
  );
};

export default ServerErrorScreen;