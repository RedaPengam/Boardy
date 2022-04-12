import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({titlePage, urlPath, urlItem, titleLink, user, color}) {

    function createImage() {
        var base64blob = user.picture;
        var image = document.createElement('img');
        image.className = "header-user-info-pic";
        image.src = 'data:image/png;base64,'+ base64blob;        
        const pic = document.querySelector('#pic');
        pic.appendChild(image);
    }

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        createImage();
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------
    
    return (
        <div className="header">

            {/* navigation et user stuff */}
            <div className="header-info">

                {/* navigation */}
                <div className="header-info-nav">
                    {
                        color &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={color} class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                        </svg>
                    }

                    <Link className="link" to={{pathname: "/PlanningBoardSelection"}}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
                        </svg> */}
                        Planning Boards
                    </Link>

                    <Link className="link" to={{ pathname: urlPath, state: {url: urlItem} }}>
                        {titleLink}
                    </Link>

                    {titlePage}

                </div>
                
                {/* user stuff */}
                <div className="header-info-user">

                    <div className="header-info-user-vertical-container">
                        <div className="header-info-user-title">
                            {user.firstname}
                        </div>
                        <div className="header-info-user-sub-title">
                            <button className="header-info-user-button">
                                <Link className="link" to={{pathname: "/"}}>
                                    Logout
                                </Link>
                            </button>
                        </div>
                    </div>

                    <div className="header-info-user-pic-cropper" id="pic">
                    </div>
                
                </div>

            </div>

            {/* ligne décorative */}
            <hr className="header-hr" style={{color: color + "00"}}/>
        </div>
    );
};
