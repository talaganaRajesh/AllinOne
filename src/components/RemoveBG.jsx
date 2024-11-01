import React, { useState } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-800">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

// Button Component
const Button = ({ children, onClick, disabled = false, className = '', variant = 'primary' }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {children}
    </button>
  );
};

// Alert Component
const Alert = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-blue-50 text-blue-700",
    destructive: "bg-red-50 text-red-700"
  };
  
  return (
    <div className={`p-4 rounded-md ${variants[variant]}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <p className="text-sm">
    {children}
  </p>
);

const RemoveBG = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeBgFromImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image_file', imageFile);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'HBaPXxX9eYWu8hmVN6zSHvyP',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
  
    try {
      const imageFile = await fetch(image)
        .then((res) => res.blob())
        .then((blob) => new File([blob], 'image.png', { type: 'image/png' }));
  
      const processedImageUrl = await removeBgFromImage(imageFile);
      setProcessedImage(processedImageUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error processing image:', error);
      setLoading(false);
      alert('Error processing image. Please make sure you have internet connection.');
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.download = 'removed-background.png';
      link.href = processedImage;
      link.click();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-5">
      <CardHeader>
        <CardTitle>AI Background <span className='text-green-600'>Remover</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-input"
            />
            <label
              htmlFor="image-input"
              className="flex flex-col items-center cursor-pointer"
            >
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-64 mb-4 rounded-lg"
                />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
              )}
              <span className="text-sm text-gray-500">
                Click to upload an image
              </span>
            </label>
          </div>

          {/* Action Button */}
          <Button
            onClick={processImage}
            disabled={!image || loading}
            className="w-full bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Remove Background
              </>
            )}
          </Button>

          {/* Processed Image Result */}
          {processedImage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
              <img
                src={processedImage}
                alt="Processed"
                className="w-full rounded-lg"
              />
              <Button
                onClick={downloadImage}
                className="mt-2 bg-green-600 text-white"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RemoveBG;