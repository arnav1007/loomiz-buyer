import React from 'react';

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        🚧 Page Under Construction
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6">
        We're working hard to bring you something awesome. <br />
        Please check back soon!
      </p>
      <p className="text-md text-gray-500 italic">
        Sorry for the inconvenience.
      </p>
    </div>
  );
};

export default UnderConstruction;
