import React from 'react';
import { Card } from 'antd';
import './CardSeccion.css';

interface CardSeccionProps {
  titulo: string;
  imagen: string;
  className?: string;
}

const CardSeccion: React.FC<CardSeccionProps> = ({ titulo, imagen, className }) => {
  return (
    <Card
      hoverable
      cover={<img alt={titulo} src={imagen} className="card-image" />}
      className={`card-seccion ${className || ''}`}
    >
      <Card.Meta
        title={<span className="card-title">{titulo}</span>}
      />
    </Card>
  );
};

export default CardSeccion;