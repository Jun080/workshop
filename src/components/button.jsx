import React from 'react';

const IconButton = ({ label, url }) => {
  const isCVButton = label === 'CV';

  return (
    <a href={url} 
    download={isCVButton ? 'Morgane Dassonville cv.pdf' : undefined}
    target='_blank' 
    rel='noopener noreferrer' 
    className='my-3 p-6 w-96 h-5 flex items-center justify-center border bg-light-green rounded'>
      <div className='flex items-center w-24'>
        <span className='ml-4'>{label}</span>
      </div>
    </a>
  );
};

export default IconButton;