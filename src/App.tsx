import React from 'react';
import XmlUploader from './components/XmlUploader';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <XmlUploader />
        </div>
    );
};

export default App;