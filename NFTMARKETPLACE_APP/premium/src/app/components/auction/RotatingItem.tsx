"use client"
import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface RotatingCubeProps {
  frontImage: string | StaticImageData,
  backImage: string | StaticImageData,
  leftImage: string | StaticImageData,
  rightImage: string | StaticImageData,
  topImage: string | StaticImageData,
  bottomImage: string | StaticImageData
}

const RotatingCube = ({ 
  frontImage,
  backImage,
  leftImage,
  rightImage,
  topImage,
  bottomImage 
}: RotatingCubeProps) => {
  return (
    <div className="w-full">
      <div 
        className="w-full max-w-[300px] mx-auto pt-4 sm:pt-8"
        style={{ perspective: '800px' }}
      >
        <div 
          className="relative aspect-square"
          style={{ 
            transformStyle: 'preserve-3d',
            animation: 'rotate 15s linear infinite',
          }}
        >
          {/* Front face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ transform: 'translateZ(150px)' }}
          >
            <Image src={frontImage} alt="Front face" layout="fill" objectFit="cover" priority />
          </div>

          {/* Back face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ transform: 'rotateY(180deg) translateZ(150px)' }}
          >
            <Image src={backImage} alt="Back face" layout="fill" objectFit="cover" />
          </div>

          {/* Left face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              transform: 'rotateY(-90deg) translateX(-150px)',
              transformOrigin: 'left'
            }}
          >
            <Image src={leftImage} alt="Left face" layout="fill" objectFit="cover" />
          </div>

          {/* Right face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              transform: 'rotateY(90deg) translateX(150px)',
              transformOrigin: 'right'
            }}
          >
            <Image src={rightImage} alt="Right face" layout="fill" objectFit="cover" />
          </div>

          {/* Top face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              transform: 'rotateX(-90deg) translateY(-150px)',
              transformOrigin: 'top'
            }}
          >
            <Image src={topImage} alt="Top face" layout="fill" objectFit="cover" />
          </div>

          {/* Bottom face */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              transform: 'rotateX(90deg) translateY(150px)',
              transformOrigin: 'bottom'
            }}
          >
            <Image src={bottomImage} alt="Bottom face" layout="fill" objectFit="cover" />
          </div>

          {/* Shadow element */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,0.5)',
              boxShadow: '0 0 50px 50px rgba(255, 105, 180, 0.5)',
              transform: 'rotateX(90deg) translateZ(-300px) rotateY(180deg)'
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes rotate {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RotatingCube;