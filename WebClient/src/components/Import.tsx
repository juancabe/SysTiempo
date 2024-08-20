import React from 'react';

interface ImportProps {
  // define your props here
}

const Import: React.FC<ImportProps> = (props) => {
  const [inputFile, setInputFile] = React.useState<File | null>(null);

  return (
    <div>
      <h1>Import</h1>
    </div>
  );
};

export default Import;
