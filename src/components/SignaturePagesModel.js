import React, { useState } from 'react';
import Modal from 'react-modal';

const PageSelectionModal = ({ isOpen, onClose, totalPages, selectedPages, onSave }) => {
    const [pages, setPages] = useState(selectedPages || []);

    const handleCheckboxChange = (page) => {
        setPages((prev) =>
            prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
        );
    };

    const handleSave = () => {
        onSave(pages);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Select Pages"
            style={{
                content: {
                    maxWidth: '400px',
                    margin: 'auto',
                    padding: '20px',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            <h3>Select Pages</h3>
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <label key={index} style={{ display: 'block', marginBottom: '10px' }}>
                        <input
                            type="checkbox"
                            checked={pages.includes(index + 1)}
                            onChange={() => handleCheckboxChange(index + 1)}
                        />
                        Page {index + 1}
                    </label>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={onClose} style={{ marginRight: '10px' }}>
                    Cancel
                </button>
                <button onClick={handleSave} style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default PageSelectionModal;
