import React from 'react';

export default function Modal({ open, title, children, toggleModal }) {

    // ------------------------ view ------------------------------------------------------------------------------------------------

    if (!open) return null
    
    return (
        <div className="modal">

            {/* fond semi-transparent du Modal */}
            <div className="modal-overlay"></div>

            {/* contenu du Modal */}
            <div className="modal-content">
                <div className="modal-title">{title}</div>
                {children}
                <button className="modal-exit-button" onClick={toggleModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ff5248" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                     </svg>
                </button>
            </div>
            
        </div>
    )
}
