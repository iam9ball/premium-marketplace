'use client'
import React from 'react';
import {FaLinkedin} from "react-icons/fa";
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaGithub } from 'react-icons/fa6';

const Footer = () => {
  return (
      <div className="bg-black text-gray-400 w-full min-h-[480px] flex flex-col justify-end items-center relative  p-20 md:flex-row md:justify-around md:items-end">
      <div className="flex flex-col items-start w-full md:w-1/3 space-y-4">
        <h3 className="text-2xl font-medium">Work of art</h3>
        <p className="text-base">Made with <span className="text-[#BA6573]">❤</span> by Iam9ball </p>
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-gray-800 rounded-md flex justify-center items-center">
           <FaLinkedin/>
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-md flex justify-center items-center">
           <FaSquareXTwitter/>
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-md flex justify-center items-center">
            <FaGithub/>
          </div>
        </div>
        <p className="text-gray-500 text-sm">2024 © All Rights Reserved</p>
      </div>
      <div className="flex flex-col items-start w-full md:w-1/4 space-y-4 bg-[#121212] rounded-md p-4 mt-8 md:mt-0">
        <p className="text-base font-medium">About</p>
        <p className="text-base">Our mission</p>
        <p className="text-base">Privacy Policy</p>
        <p className="text-base">Terms of service</p>
      </div>
      <div className="flex flex-col items-start w-full md:w-1/4 space-y-4 bg-[#121212] rounded-md p-4 mt-8 md:mt-0">
        <p className="text-base font-medium">Services</p>
        <p className="text-base">Products</p>
        <p className="text-base">Join our team</p>
        <p className="text-base">Partner with us</p>
      </div>
      </div>
  );
};

export default Footer;