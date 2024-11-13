// ImageModal.js
import React from 'react';
import './ImageModal.css'; // You can create a CSS file for styling

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Payment Proof" className="modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;