import React from 'react';
import { Card } from 'antd';

interface CardSeccionProps {
  titulo: string;
  imagen: string;
  texto?: string;
}

const CardSeccion: React.FC<CardSeccionProps> = ({ titulo, imagen, texto }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={titulo}
          src={imagen}
          style={{ width: '100%', height: '250px', objectFit: 'cover', padding: '1rem' }}
        />
      }
      className="shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 bg-blue-800"
    >
      <Card.Meta
        title={titulo}
        description={texto}
      />
    </Card>
  );
};

export default CardSeccion;