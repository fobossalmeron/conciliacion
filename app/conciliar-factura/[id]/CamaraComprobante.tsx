'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../components/Button';

interface CamaraComprobanteProps {
  onCapture: (file: File, preview: string) => void;
}

export default function CamaraComprobante({ onCapture }: CamaraComprobanteProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "environment"
  };

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "comprobante.jpg", { type: "image/jpeg" });
            onCapture(file, imageSrc);
          });
      }
    }
  }, [onCapture]);

  return (
    <div className="mt-2">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        className="w-full h-auto bg-gray-300"
      />
      {isCameraReady && (
        <Button
          onClick={capture}
          variant="primary"
          className="mt-2"
        >
          Capturar comprobante
        </Button>
      )}
    </div>
  );
}
