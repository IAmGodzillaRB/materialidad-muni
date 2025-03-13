import { Card, Image } from 'antd';

interface CardSeccionProps {
  titulo: string;
  imagen: string;
}

const CardSeccion = ({ titulo, imagen }: CardSeccionProps) => {
  return (
    <Card hoverable className="text-center">
      <Image src={imagen} alt={titulo} preview={false} width={64} height={64} />
      <h3 className="mt-2">{titulo}</h3>
    </Card>
  );
};

export default CardSeccion;