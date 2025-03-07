import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC<{
  collapsed: boolean;
  isMobile: boolean;
  onItemClick: () => void;
}> = ({ collapsed, isMobile, onItemClick }) => {
  const { logout } = useAuth(); // Obtener la función de logout del contexto
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/usuarios/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Definir los elementos del menú
  const menuItems = [
    {
      key: 'control-municipios',
      icon: <DashboardOutlined style={{ color: '#ffffff' }} />, // Color blanco para el ícono
      label: (
        <Link to="/home/control-municipios" onClick={onItemClick} style={{ color: '#ffffff' }}>
          Control de Municipios
        </Link>
      ),
    },
    {
      key: 'municipios',
      icon: <DashboardOutlined style={{ color: '#ffffff' }} />, // Color blanco para el ícono
      label: (
        <Link to="/home/municipios" onClick={onItemClick} style={{ color: '#ffffff' }}>
          Municipios
        </Link>
      ),
    },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-[#00274d] border-r-2 border-[#004c99] shadow-lg ${
        collapsed && !isMobile ? 'w-20' : 'w-64'
      }`}
      style={{
        position: isMobile ? 'fixed' : 'static',
        height: '100vh',
        zIndex: 1,
        transition: isMobile ? 'transform 0.3s ease-in-out' : 'width 0.3s ease-in-out',
        transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-[#004c99]">
        <img
          src={collapsed && !isMobile ? '/Isotipo-blanco.png' : '/logo-blanco.png'}
          alt="Logo"
          className={collapsed && !isMobile ? 'w-28' : 'w-28'}
        />
      </div>

      {/* Menú */}
      <Menu
        theme='dark'
        mode="inline"
        className="flex-1"
        inlineCollapsed={collapsed && !isMobile}
        items={menuItems}
        style={{ backgroundColor: '#00274d', color: '#ffffff' }} // Fondo y color de texto personalizado
      />

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-[#004c99]">
        <button
          onClick={handleLogout}
          className="w-full bg-slate-200 text-white font-bold py-2 px-4 rounded flex items-center justify-center hover:bg-[#003366] transition-colors"
        >
          <LogoutOutlined className="text-xl" />
          {!collapsed && <span className="ml-2 ">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;