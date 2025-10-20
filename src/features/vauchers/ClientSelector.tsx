import { Input } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../components';

// ========================================
// INTERFACES Y TIPOS
// ========================================

/**
 * Props del componente ClientSelector
 * @property selectedClient - Cliente actualmente seleccionado (puede ser null)
 * @property onClientSelect - Callback que se ejecuta cuando se selecciona/deselecciona un cliente
 * @property className - Clases CSS adicionales para el contenedor principal
 */
interface ClientSelectorProps {
  selectedClient: any;
  onClientSelect: (client: any) => void;
  className?: string; // Agregado "?" para hacerlo opcional
}

/**
 * Estructura de un cliente
 */
interface Client {
  id: number;
  name: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  code: string;
}

// ========================================
// DATOS MOCK
// ========================================

/**
 * Lista de clientes de ejemplo
 * En producción, esto vendría de una API o base de datos
 */
const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    name: "María García López",
    dni: "12345678A",
    email: "maria.garcia@email.com",
    phone: "+34 666 123 456",
    address: "Calle Mayor 123, Madrid",
    code: "CLI-001"
  },
  {
    id: 2,
    name: "Juan Pérez Martín",
    dni: "87654321B",
    email: "juan.perez@email.com",
    phone: "+34 677 987 654",
    address: "Avenida Libertad 45, Barcelona",
    code: "CLI-002"
  },
  {
    id: 3,
    name: "Ana Rodríguez Silva",
    dni: "11223344C",
    email: "ana.rodriguez@email.com",
    phone: "+34 688 555 777",
    address: "Plaza España 8, Valencia",
    code: "CLI-003"
  },
  {
    id: 4,
    name: "Carlos Fernández Ruiz",
    dni: "55667788D",
    email: "carlos.fernandez@email.com",
    phone: "+34 699 111 222",
    address: "Calle Sol 67, Sevilla",
    code: "CLI-004"
  }
];

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  selectedClient, 
  onClientSelect, 
  className = '' 
}) => {
  // ========================================
  // ESTADOS
  // ========================================
  
  /**
   * searchTerm: Almacena el texto que el usuario escribe en el input
   * Se usa para filtrar la lista de clientes
   */
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * isDropdownOpen: Controla si el dropdown de resultados está visible
   * true = dropdown visible, false = dropdown oculto
   */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  /**
   * filteredClients: Lista de clientes filtrados según el término de búsqueda
   * Se actualiza cada vez que cambia searchTerm
   */
  const [filteredClients, setFilteredClients] = useState<Client[]>(MOCK_CLIENTS);

  // ========================================
  // REFS
  // ========================================
  
  /**
   * dropdownRef: Referencia al contenedor del dropdown
   * Se usa para detectar clicks fuera del componente y cerrarlo
   * useRef mantiene la referencia sin causar re-renders
   */
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ========================================
  // EFFECTS
  // ========================================
  
  /**
   * Effect para cerrar el dropdown cuando se hace click fuera
   * Se ejecuta solo una vez al montar el componente
   * 
   * CÓMO FUNCIONA:
   * 1. Agrega un listener al documento para detectar clicks
   * 2. Si el click es fuera del dropdown, lo cierra
   * 3. Al desmontar el componente, limpia el listener
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verificamos si el click fue fuera del dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Agregamos el listener al documento
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup: removemos el listener al desmontar
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // [] significa que solo se ejecuta al montar/desmontar

  /**
   * Effect para filtrar clientes cuando cambia el término de búsqueda
   * Se ejecuta cada vez que searchTerm cambia
   * 
   * CÓMO FUNCIONA:
   * 1. Si hay texto de búsqueda, filtra los clientes
   * 2. Busca coincidencias en: nombre, DNI, código y email
   * 3. Si no hay búsqueda, muestra todos los clientes
   */
  useEffect(() => {
    if (searchTerm.trim()) {
      // Filtramos clientes que coincidan con el término de búsqueda
      const filtered = MOCK_CLIENTS.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      // Si no hay búsqueda, mostramos todos
      setFilteredClients(MOCK_CLIENTS);
    }
  }, [searchTerm]); // Se ejecuta cuando searchTerm cambia

  // ========================================
  // HANDLERS (Manejadores de eventos)
  // ========================================
  
  /**
   * Maneja el cambio en el input de búsqueda
   * Se ejecuta en cada tecla presionada
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true); // Abrimos el dropdown al escribir
  };

  /**
   * Maneja la selección de un cliente del dropdown
   * Actualiza el estado y cierra el dropdown
   */
  const handleClientSelect = (client: Client) => {
    onClientSelect(client); // Notificamos al componente padre
    setSearchTerm(client.name); // Mostramos el nombre en el input
    setIsDropdownOpen(false); // Cerramos el dropdown
  };

  /**
   * Limpia la selección actual
   * Resetea todos los estados relacionados
   */
  const handleClearSelection = () => {
    onClientSelect(null); // Deseleccionamos el cliente
    setSearchTerm(''); // Limpiamos el input
    setIsDropdownOpen(false); // Cerramos el dropdown
  };

  /**
   * Abre el dropdown cuando el input recibe foco
   * Mejora la UX mostrando opciones inmediatamente
   */
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // ========================================
  // RENDER
  // ========================================
  
  return (
    // Contenedor principal con referencia para detectar clicks externos
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="space-y-4">
        
        {/* HEADER: Título y botón de limpiar */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Selección de Cliente
          </h3>
          
          {/* Botón para limpiar - solo visible si hay cliente seleccionado */}
          {selectedClient && (
            <button
              onClick={handleClearSelection}
              className="text-sm text-destructive hover:text-destructive/80 transition-smooth"
            >
              Limpiar selección
            </button>
          )}
        </div>

        {/* INPUT DE BÚSQUEDA con icono */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar cliente por nombre, DNI, código o email..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            className="pr-10" // Padding derecho para el icono
          />
          {/* Icono de búsqueda posicionado absolutamente */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon name="Search" size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* TARJETA DEL CLIENTE SELECCIONADO */}
        {/* Solo se muestra si hay un cliente seleccionado */}
        {selectedClient && (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              
              {/* Información del cliente */}
              <div className="space-y-2">
                {/* Nombre del cliente */}
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {selectedClient.name}
                  </span>
                </div>
                
                {/* Grid con datos del cliente (DNI, email, phone, código) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="CreditCard" size={14} />
                    <span>DNI: {selectedClient.dni}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={14} />
                    <span>{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={14} />
                    <span>{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Hash" size={14} />
                    <span>Código: {selectedClient.code}</span>
                  </div>
                </div>
                
                {/* Dirección */}
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={14} className="mt-0.5" />
                  <span>{selectedClient.address}</span>
                </div>
              </div>
              
              {/* Avatar circular */}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
            </div>
          </div>
        )}

        {/* DROPDOWN DE RESULTADOS */}
        {/* Solo visible cuando isDropdownOpen es true */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-(--color-popover) border border-(--color-border) rounded-lg dropdown-shadow z-50 max-h-80 overflow-y-auto">
            
            {/* Mensaje cuando no hay resultados */}
            {filteredClients.length === 0 ? (
              <div className="p-4 text-center text-(--color-muted-foreground)">
                <Icon name="Search" size={24} className="mx-auto mb-2" />
                <p>No se encontraron clientes</p>
              </div>
            ) : (
              // Lista de clientes filtrados
              <div className="py-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="w-full px-4 py-3 text-left hover:bg-(--color-muted) transition-smooth border-b border-(--color-border) last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {/* Nombre y código del cliente */}
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-(--color-foreground)">
                            {client.name}
                          </span>
                          <span className="text-xs bg-[var(--color-primary)]/10 text-(--color-primary) px-2 py-0.5 rounded">
                            {client.code}
                          </span>
                        </div>
                        {/* DNI y email */}
                        <div className="flex items-center space-x-4 text-sm text-(--color-muted-foreground)">
                          <span>DNI: {client.dni}</span>
                          <span>{client.email}</span>
                        </div>
                      </div>
                      {/* Icono de flecha */}
                      <Icon name="ChevronRight" size={16} className="text-(--color-muted-foreground)" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSelector;