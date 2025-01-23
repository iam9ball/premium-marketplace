"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  forwardLabel: string | undefined;
  backwardLabel?: string;
  disabled?: boolean;
  forward: () => void;
  backward?: () => void;
  
}


export default function Modal({
  isOpen,
  onClose,
  forward,
  title,
  body,
  footer,
  forwardLabel,
  disabled,
  backward,
  backwardLabel,
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleForward = useCallback(() => {
    if (disabled) {
      return;
    }
    forward();
  }, [disabled, forward]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled) {
      return;
    }
    backward && backward();
  }, [disabled, backward]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-auto">
          <div
            className={`translate duration-300 h-full 
                ${showModal ? `translate-y-6 ` : `translate-y-full`} 
                ${showModal ? `opacity-100` : `opacity-0`}`}
          >
            <div
              className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-
            "
            >
              <div className="flex items-center p-4 rounded-t justify-center relative border-b-[1px]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>

              <div className="relative p-4 flex-auto">{body}</div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-center gap-4 w-full">
                  {backward && backwardLabel && (
                    <Button
                    actionLabel={backwardLabel}
                    classNames="bg-black w-[80%] py-2 rounded-sm text-white" 
                    onClick={handleSecondaryAction}
                    disabled={disabled}
                    />
                  )}
                  { forwardLabel && 
                    <Button
                    actionLabel={forwardLabel}
                    classNames="bg-black w-[80%] py-2 rounded-sm text-white" 
                    disabled={disabled}
                    onClick={handleForward}
                    />
                  }
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
