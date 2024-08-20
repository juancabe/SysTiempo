import React, { useState, useEffect } from 'react';
import { FileInput, Label } from 'flowbite-react';

interface ImportProps {
  // define your props here
}

const Import: React.FC<ImportProps> = (props) => {
  const [inputFile, setInputFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].name.endsWith('.json')) {
      setInputFile(e.target.files[0]);
    } else {
      setInputFile(null);
    }
  };

  return (
    <div className="w-screen flex justify-center">
      <div className="w-1/2 max-w-md">
        <div>
          <h1 className="text-center text-xl py-5">Import</h1>
        </div>
        <div className="flex flex-col text-center">
          <div className="py-10">
            <Label
              htmlFor="dropzone-file"
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  [espData.json]-like file
                </p>
              </div>
              <FileInput
                id="dropzone-file"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          <div className="py-10">
            <p>
              {inputFile ? (
                <span className="text-green-500 dark:text-green-400">
                  {inputFile.name} uploaded
                </span>
              ) : (
                <span className="text-red-500 dark:text-red-400">
                  No file uploaded
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="text-center py-3"></div>
      </div>
    </div>
  );
};

export default Import;
