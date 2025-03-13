import { Card, Image } from 'antd';
import { Municipio } from '../../types/Municipio';
import DEFAULT_IMAGE from '../../../public/images/default-municipio.webp';

interface MunicipioCardProps {
  municipio: Municipio;
  onClick: () => void;
}

const MunicipioCard = ({ municipio, onClick }: MunicipioCardProps) => {
  return (
    <Card
      hoverable
      cover={
        <Image
          src={municipio.imagen || DEFAULT_IMAGE}
          alt={municipio.denominacion}
          height={150}
          style={{ objectFit: 'cover' }}
          preview={false}
        />
      }
      className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <Card.Meta
        title={municipio.denominacion}
        description={
          <div>
            <p><strong>RFC:</strong> {municipio.rfc}</p>
          </div>
        }
      />
    </Card>
  );
};

export default MunicipioCard;