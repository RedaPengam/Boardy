import React, { useState } from 'react';

export default function Label(props) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------

    const [id, setId] = useState(props.id);
    const [title, setTitle] = useState(props.title);
    const [color, setColor] = useState(props.color);
 
    // ------------------------ methods ------------------------------------------------------------------------------------------------
    
    // ------------------------ view ------------------------------------------------------------------------------------------------

    return (
        <div className="label">
            {title}
        </div>
    );
};
