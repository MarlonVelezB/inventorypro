import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-onBackground mb-2">Page Not Found</h2>
        <p className="text-onBackground/70 mb-8">
          The page you're looking for doesn't exist. Let's get you back!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button type="primary" onClick={() => window.history?.back()} icon={<Icon name='ArrowLeft'/>}>Go Back</Button>
            <Button type="primary" onClick={handleGoHome} icon={<Icon name='ArrowLeft'/>}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
