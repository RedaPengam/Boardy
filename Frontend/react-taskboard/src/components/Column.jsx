import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Sticker from './Sticker';
import Modal from './Modal';
import axios from 'axios';
import { 
    fetchTable, fetchItem, postMultipleItems, deleteItem, getLastItemIdThenPost,
    urlUserStoryBoards, urlColumns, urlStickers, getLastItemId
} from '../API';

export default function Column(props) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------

    const urlColumn = props.urlColumn;
    const urlPlanningBoard = props.urlPlanningBoard;
    const urlUserStoryBoard = props.urlUserStoryBoard;
    
    const id = props.id;
    const id_PB = props.id_PB;
    const id_USB = props.id_USB;
    const id_user = props.id_user;   
    const [title, setTitle] = useState(props.title);
    const [color, setColor] = useState(0);
    const [columnTimescale, setColumnTimeScale] = useState(props.columnTimescale);
    const [isInitial, setIsInitial] = useState(props.isInitial);
    const [isTerminal, setIsTerminal] = useState(props.isTerminal);
    const [kind, setKind] = useState(props.kind);

    const [stickers, setStickersArray] = useState([]);
    const [cacheLastUSBId, setCacheLastUSBId] = useState(0);
    const [cacheLastUSSId, setCacheLastUSSId] = useState(0);

    const [modalCreationOpen, setModalCreationOpen] = useState(false);
    const [modalModificationOpen, setModalModificationOpen] = useState(false);
    const {register, errors, handleSubmit} = useForm();    
    const {register: register2, errors: errors2, handleSubmit: handleSubmit2} = useForm();
    const [style, setStyle] = useState(null);
    
    /* setters */    
    function setColumn(receivedColumn) {

        var promise = new Promise((resolve, reject) => {
            setTitle(receivedColumn.title);
            setColor(receivedColumn.color);
            setColumnTimeScale(receivedColumn.columnTimescale);
            setIsInitial(receivedColumn.isInitial);
            setIsTerminal(receivedColumn.isTerminal);
            setKind(receivedColumn.kind);
            setStyle({backgroundColor: (receivedColumn.color)})
        });
        promise.then(res => {
            if (res === 0) {setCacheLastUSBId(0);}
            return res;
        });
        promise.then(res => {
            getLastItemId(urlUserStoryBoards + "&last=y" + "&id_user=" + id_user, cacheLastUSBId, setCacheLastUSBId);
            return res;
        });

        if (kind === "Planning Board") {
            // console.log("PB colonne ", title);
            fetchTable(urlStickers + "&board=PB&id_board=" + id_PB + "&id_currentColumn=" + id, setStickers);
        } else if (kind === "User Story Board") {
            // console.log("USB colonne ", title);
            fetchTable(urlStickers + "&board=USB&id_board=" + id_USB + "&id_currentColumn=" + id, setStickers);
        }
    };
    function setStickers(receivedStickers) {
        var promise = new Promise((resolve, reject) => {
            setStickersArray(receivedStickers);
            resolve(receivedStickers.length);
        });
        promise.then(res => {
            if (res === 0) {setCacheLastUSSId(0);}
            return res;
        });
        promise.then(res => {
            getLastItemId(urlStickers + "&last=y" + "&id_user=" + id_user, cacheLastUSSId, setCacheLastUSSId);
            return res;
        });
    };

    // ------------------------ methods ------------------------------------------------------------------------------------------------

    /* TELLS if Column is from UserStoryBoard */
    function isFromUserStoryBoard() {
        if (kind === "User Story Board") {
            return true;
        } else if (kind === "Planning Board") {
            return false;
        }
    };

    /* CREATION Sticker (Task/UserStory + Board) */
    const onSubmitCreation = (data) => {

        if (kind === "User Story Board") { // création TaskSticker
        
            // creation TaskSticker
            var formNewTaskSticker = new FormData();            
            formNewTaskSticker.append('id_PB', id_PB);                  
            formNewTaskSticker.append('id_USB', id_USB);
            formNewTaskSticker.append('id_currentColumn', id);
            formNewTaskSticker.append('id_user', id_user);
            formNewTaskSticker.append('title', data.title);
            formNewTaskSticker.append('detail', data.detail);
            formNewTaskSticker.append('kind', "Task Sticker");
            
            // promise to run async functions IN ORDER
            var promise = new Promise((resolve, reject) => {
                resolve(1);
            });
            // POST TaskSticker
            promise.then(res => {
                axios.post(urlStickers, formNewTaskSticker)
                .then(res => {console.log("Task Sticker posted", res);})
                .catch(error => {console.log("Task Sticker non posté", error);});
                return res;
            });
            // MAJ Stickers
            promise.then(res => {
                console.log("sticker set");
                fetchTable(urlStickers + "&board=USB&id_board=" + id_USB + "&id_currentColumn=" + id + "&id_user=" + id_user, setStickers);
                return res;
            });
            // MAJ Column
            promise.then(res => {
                fetchItem(urlColumn, setColumn);
                return res;
            });
            // fermeture Modal
            promise.then(res => {
                toggleModalCreation();
            });

        } else if (kind === "Planning Board") { // création UserStorySticker & UserStoryBoard
        
            // creation UserStoryBoard
            var formNewUserStoryBoard = new FormData();
            formNewUserStoryBoard.append('id_PB', id_PB);
            formNewUserStoryBoard.append('id_user', id_user);
            formNewUserStoryBoard.append('title', data.title);
            formNewUserStoryBoard.append('color', color);

            // promise to run async functions IN ORDER
            var promise = new Promise((resolve, reject) => {
                resolve(1);
            });
            // POST UserStoryBoard
            promise.then(res => {
                axios.post(urlUserStoryBoards, formNewUserStoryBoard)
                .then(res => {console.log("USB posted", res);})
                .catch(error => {console.log("USB NOT posted ", error);});
                return res;
            });
            // GET last UserStoryBoard id & POST UserStorySticker & POST USB Columns
            promise.then(res => {

                function postUserStorySticker(id_lastUSB) {
                    
                    // creation UserStorySticker
                    var formNewUserStorySticker = new FormData();                  
                    formNewUserStorySticker.append('id_PB', id_PB);                
                    formNewUserStorySticker.append('id_USB', id_lastUSB);
                    formNewUserStorySticker.append('id_currentColumn', id);
                    formNewUserStorySticker.append('id_user', id_user);
                    formNewUserStorySticker.append('title', data.title);
                    formNewUserStorySticker.append('detail', data.detail);
                    formNewUserStorySticker.append('kind', "User Story Sticker");
                    
                    // POST UserStorySticker
                    axios.post(urlStickers, formNewUserStorySticker)
                    .then(res => {console.log("USS posted", res);})
                    .catch(error => {console.log("User Story Sticker non posté", error)});
                };
                function postUserStoryBoardColumns(id_lastUSB) {

                    // creation & POST Columns
                    // promise2.then(res => {
                        var formColumns = new FormData();
                        var columns = [];
                        // creation Column "To Do"
                        var jsonNewColumn1 = JSON.stringify({
                            "id_PB": id_PB,
                            "id_USB": id_lastUSB,
                            "id_user": id_user,
                            "title": "To do",
                            "color": "#FFF85C", 
                            "columnTimescale": 0,
                            "isInitial": 1,
                            "isTerminal": 0,
                            "kind": "User Story Board"  
                        });
                        // creation Column "Doing"
                        var jsonNewColumn2 = JSON.stringify({
                            "id_PB": id_PB,
                            "id_USB": id_lastUSB,
                            "id_user": id_user,
                            "title": "Doing",
                            "color": "#DAFF45", 
                            "columnTimescale": 0,
                            "isInitial": 0,
                            "isTerminal": 0,
                            "kind": "User Story Board"                     
                        });
                        // creation Column "Done"
                        var jsonNewColumn3 = JSON.stringify({
                            "id_PB": id_PB,
                            "id_USB": id_lastUSB,
                            "id_user": id_user,
                            "title": "Done",
                            "color": "#45FF8F", 
                            "columnTimescale": 0,
                            "isInitial": 0,
                            "isTerminal": 1,
                            "kind": "User Story Board"                       
                        });
                        // push columns to columns
                        var promise3 = new Promise((resolve, reject) => {
                            resolve(1);
                        });
                        promise3.then(res => {
                            // console.log("col 1 pushed");
                            columns.push(jsonNewColumn1);
                        });
                        promise3.then(res => {
                            // console.log("col 2 pushed");
                            columns.push(jsonNewColumn2);
                        });
                        promise3.then(res => {
                            // console.log("col 3 pushed");
                            columns.push(jsonNewColumn3);
                        });
                        // POST Columns
                        promise3.then(res => {
                            // console.log(JSON.stringify(columns));
                            formColumns.append('columns', JSON.stringify(columns));
                            postMultipleItems(urlColumns + "&multiple=y" + "&board=USB", formColumns);
                        });
                    // });
                };

                getLastItemIdThenPost(urlUserStoryBoards + "&last=y" + "&id_user=" + id_user, cacheLastUSBId, setCacheLastUSBId, postUserStorySticker);
                getLastItemIdThenPost(urlUserStoryBoards + "&last=y" + "&id_user=" + id_user, cacheLastUSBId, setCacheLastUSBId, postUserStoryBoardColumns);
            });
            // MAJ Stickers
            promise.then(res => {
                console.log("sticker set", res);
                fetchTable(urlStickers + "&board=PB&id_board=" + id_PB + "&id_currentColumn=" + id, setStickers);
                fetchTable(urlStickers + "&board=PB&id_board=" + id_PB + "&id_currentColumn=" + id, setStickers);
                fetchTable(urlStickers + "&board=PB&id_board=" + id_PB + "&id_currentColumn=" + id, setStickers);
                return res;
            });
            // MAJ Column
            promise.then(res => {
                fetchItem(urlColumn, setColumn);
                fetchItem(urlColumn, setColumn);
                fetchItem(urlColumn, setColumn);
                return res;
            });
            // fermeture Modal
            promise.then(res => {
                toggleModalCreation();
                return res;
            });
        };
    };

    /* MODIFICATION Column */
    const onSubmitModification = (data) => {
        // création Column
        var formNewColumn = new FormData();
        var newTitle = "";
        var newColumnTimescale = 0;
        var newIsInitial = 0;
        var newIsTerminal = 0;  
        // si la donnée du form existe on la prend, sinon on remet l'ancienne
        if (data.title) {newTitle = data.title;} else {newTitle = title;}
        if (data.columnTimescale) {newColumnTimescale = data.columnTimescale;} else {newColumnTimescale = columnTimescale;}
        if (data.isInitial) {newIsInitial = data.isInitial;} else {newIsInitial = isInitial;}
        if (data.isTerminal) {newIsTerminal = data.isTerminal;} else {newIsTerminal = isTerminal;}
        formNewColumn.append('title', newTitle);
        formNewColumn.append('columnTimescale', newColumnTimescale);
        formNewColumn.append('isInitial', newIsInitial);
        formNewColumn.append('isTerminal', newIsTerminal);
        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST Column
        promise.then(res => {
            if (kind === "User Story Board") {
                axios.post(urlColumn + "&board=USB" + "&id_user=" + id_user, formNewColumn)
                .catch(error => {console.log(error)});
            } else if (kind === "Planning Board") {
                axios.post(urlColumn + "&board=PB" + "&id_user=" + id_user, formNewColumn)
                .catch(error => {console.log(error)});
            }
            return res;
        });
        // MAJ Column
        promise.then(res => {
            fetchItem(urlColumn, setColumn);
            return res;
        });
        // fermeture Modal
        promise.then(res => {
            toggleModalModification();
        });
    };

    /* MAJ Column */
    const majColumn = () => {
        fetchItem(urlColumn, setColumn);
    };

    /* SET Modals on/off */
    const toggleModalCreation = () => {
        setModalCreationOpen(!modalCreationOpen);
    };
    const toggleModalModification = () => {
        setModalModificationOpen(!modalModificationOpen);
    };


    /* DRAG & DROP */
    const onDragStart = (e) => {
        e.dataTransfer.setData("MyDraggedElementId", e.target.id);
    };
    // var dragSrcEl = null;
    // function handleDragStart(e) {
    //     // Target (this) element is the source node.
    //     this.style.opacity = '0.4';
    //     dragSrcEl = this;
    //     e.dataTransfer.effectAllowed = 'move';
    //     e.dataTransfer.setData('text/html', this.innerHTML);
    // };    
    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        this.classList.add('over');
    };
    function handleDragLeave(e) {
        e.stopPropagation(); // stops the browser from redirecting.
        this.classList.remove('over');  // this / e.target is previous target element.
    };
    // function handleDragOver(e) {
    //     e.preventDefault(); // Necessary. Allows us to drop.
    //     e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    //     return false;
    // };
    // function handleDrop(e) {
    //     // Don't do anything if dropping the same sticker we're dragging.
    //     if (dragSrcEl != this) {
    //         // Set the source sticker's HTML to the HTML of the sticker we dropped on.
    //         dragSrcEl.innerHTML = this.innerHTML;
    //         this.innerHTML = e.dataTransfer.getData('text/html');
    //     }
    //     return false;
    // };      
    // function handleDragEnd(e) {
    //     var stcks = document.querySelectorAll('.sticker');       
    //     // this/e.target is the source node.
    //     [].forEach.call(stcks, function (stck) {
    //         stck.classList.remove('over');
    //     });
    //     this.style.opacity = '1';
    // };
    
    const onDragOver = (e) => {
        e.preventDefault();
        return false;
    };
    const onDrop = (e, id) => {
        e.preventDefault();
        var id_draggedSticker = e.dataTransfer.getData("MyDraggedElementId");
        const listStickers = e.target.querySelector('.stickers');
        listStickers.appendChild(document.getElementById(id_draggedSticker));

        e.target.classList.remove('over');

        console.log('dragend column:', id);

        // creation Sticker (modification id_currenColumn) 
        var formNewSticker = new FormData();
        formNewSticker.append('id_currentColumn', id);
        axios.post(urlStickers + "&id=" + id_draggedSticker + "&move=y" + "&id_user=" + id_user, formNewSticker)
        .then(res => console.log(res))
        .catch(error => {console.log(error)});
    };
    var stcks = document.querySelectorAll('.column');
    [].forEach.call(stcks, function(stck) {
        // stck.addEventListener('dragstart', handleDragStart, false);
        stck.addEventListener('dragenter', handleDragEnter, false);
        // stck.addEventListener('dragover', handleDragOver, false);
        stck.addEventListener('dragleave', handleDragLeave, false);
        // stck.addEventListener('drop', handleDrop, false);
        // stck.addEventListener('dragend', handleDragEnd, false);
    });


    /* VIEW functions */
    function viewModalCreationUserStoryBoard() {
        return (
            <Modal open={modalCreationOpen} title={"Nouvelle Tâche"} toggleModal={toggleModalCreation}>
                <form className="modal-form" onSubmit={handleSubmit(onSubmitCreation)}>
                    <label className="modal-form-label">Titre</label>
                    <input className="modal-form-input" type="text" placeholder="Tâche n°..." {...register("title", {required: true, maxLength: 80})} />
                    <label className="modal-form-label">Description</label>
                    <input className="modal-form-input" type="text" placeholder="Petite description sympa" {...register("detail", {required: false, maxLength: 80})} />
                    <input className="modal-form-input" type="submit" value="Ajouter !" />
                </form>
            </Modal>
        )
    };
    function viewModalCreationPlanningBoard() {
        return (
            <Modal open={modalCreationOpen} title={"Nouvelle User Story"} toggleModal={toggleModalCreation}>
                <form className="modal-form" onSubmit={handleSubmit(onSubmitCreation)}>
                    <label className="modal-form-label">Titre</label>
                    <input className="modal-form-input" type="text" placeholder="User Story n°..." {...register("title", {required: true, maxLength: 42})} />
                    <label className="modal-form-label">Description</label>
                    <input className="modal-form-input" type="text" placeholder="Petite description sympa" {...register("detail", {required: true, maxLength: 200})} />
                    <input className="modal-form-input" type="submit" value="Ajouter !" />
                </form>
            </Modal>        
        )
    };
    function viewModalModificationUserStoryBoard() {
        return (
            <>
                <label className="modal-form-label">Titre</label>
                <input className="modal-form-input" type="text" placeholder="Review" {...register2("title", {required: false, maxLength: 80})} />
                <label className="modal-form-label">Colonne initiale</label>
                <div className="modal-form-horizontal-container">
                    <input className="modal-form-check" type="radio" id="i-yes" {...register2("isInitial", { required: false })} value={1} />
                    <label className="modal-form-label" >Yes</label>  
                    <input className="modal-form-check" type="radio" id="i-no" {...register2("isInitial", { required: false })} value={0} />
                    <label className="modal-form-label" >No</label>
                </div>
                <label className="modal-form-label" style={{marginTop: "20px"}}>Colonne terminale</label>
                <div className="modal-form-horizontal-container">
                    <input className="modal-form-check" type="radio" id="f-yes" {...register2("isTerminal", { required: false })} value={1} />
                    <label className="modal-form-label" htmlFor="t-yes">Yes</label>
                    <input className="modal-form-check" type="radio" id="f-no" {...register2("isTerminal", { required: false })} value={0} />
                    <label className="modal-form-label" htmlFor="t-no">No</label>
                </div>
            </>
        );
    };
    function viewModalModificationPlanningBoard() {
        return (
            <>
                <label className="modal-form-label">Titre</label>
                <input className="modal-form-input" type="text" placeholder="Période n° ..." {...register2("title", {required: false, maxLength: 80})} />
                <label className="modal-form-label">Echelle de temps de la période en semaines</label>
                <input className="modal-form-input" type="number" placeholder="Entrer un nombre" {...register2("columnTimescale", {required: false, maxLength: 80})} /> 
            </>
        );
    };
    function viewHeaderColumnUserStoryBoard() {
        return (
            <>
                <div className="column-header-title" style={style}>
                    {title}
                    {/* {" / ID : " + id} */}
                    <div className="column-header-sub-title">
                        {"ID : " + id}
                    </div>
                </div>
            </>
        )
    };
    function viewHeaderColumnPlanningBoard() {
        return (
            <>
                <div className="column-header-title" style={style}>
                    {title + " " + " : " + columnTimescale + " sem"}
                    {/* {" / ID : " + id} */}
                    <div className="column-header-sub-title">
                        {"ID : " + id}
                    </div>
                </div>
            </>
        )
    };  
    function viewDeleteButtonPB() {
        return (
            <button className="modal-delete-button" 
                onClick={() => {
                    deleteItem(urlColumn, urlColumns + "&board=PB&id_board=" + id_PB + "&id_user=" + id_user + "&id_user=" + id_user, fetchTable, props.setColumns);
                    toggleModalModification();                      
                }}
            >
                Delete ?
            </button>
        )
    };
    function viewDeleteButtonUSB() {
        return (
            <button className="modal-delete-button" 
                onClick={() => {
                    deleteItem(urlColumn, urlColumns + "&board=USB&id_board=" + id_USB, fetchTable, props.setColumns)
                    toggleModalModification();                            
                }}
            >
                Delete ?
            </button>        
        )
    };

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        fetchItem(urlColumn, setColumn);
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------

    return (
        <div className="column" onDragOver={onDragOver} onDrop={(e)=>onDrop(e, id)}>

            {/* header de la Column */}
            <div className="column-header">
                {isFromUserStoryBoard() && viewHeaderColumnUserStoryBoard()}
                {!isFromUserStoryBoard() && viewHeaderColumnPlanningBoard()}
                <div className="column-header-options">
                    {/* bouton pour maj la Column */}
                    <button className="column-header-options-dots-button" onClick={majColumn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                        </svg>
                    </button>
                    {/* bouton d'options de la Column */}
                    <button className="column-header-options-dots-button" onClick={toggleModalModification}>
                        <svg width="18" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>  
                    {/* bouton d'ajout de Sticker */}
                    <button className="column-header-options-plus-button" onClick={toggleModalCreation}>
                        <svg width="8" height="8" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.300945 3.93V2.936H2.97495V0.388H4.02495V2.936H6.69895V3.93H4.02495V6.492H2.97495V3.93H0.300945Z" fill="#4D4D4D" style={{mixBlendMode: 'multiply'}}/>
                        </svg>
                    </button>
                </div>
            </div>            

            {/* Modal CREATION pour ajouter un Sticker */}
            {isFromUserStoryBoard() && viewModalCreationUserStoryBoard()}
            {!isFromUserStoryBoard() && viewModalCreationPlanningBoard()}

            {/* Modal MODIFICATION pour modifier la Column */}
            <Modal open={modalModificationOpen} title={"Modifier - " + title} toggleModal={toggleModalModification}>
                {/* création du form pour modifier la Column */}
                <form className="modal-form" onSubmit={handleSubmit2(onSubmitModification)}>
                    {isFromUserStoryBoard() && viewModalModificationUserStoryBoard()}
                    {!isFromUserStoryBoard() && viewModalModificationPlanningBoard()}
                    <input className="modal-form-input" type="submit" value="Modifier !" />
                </form>
                {/* création du bouton pour supprimer la Column */}
                {isFromUserStoryBoard() && viewDeleteButtonUSB()}
                {!isFromUserStoryBoard() && viewDeleteButtonPB()}
            </Modal>
            
            {/* Stickers Task/UserStory */}
            <div className="stickers">
                {stickers.map((item) =>
                    <Sticker
                        key={item.id} // pour éviter msg console
                        setColumn={setColumn} // pour pouvoir MAJ la Column si on suppr le présent
                        setStickers={setStickers} // pour pouvoir MAJ la Column si on suppr le présent
                        urlColumn={urlColumn} // pour pouvoir MAJ la Column si on suppr le présent
                        urlPlanningBoard={urlPlanningBoard}
                        urlSticker={urlStickers + "&id=" + item.id}
                        id={item.id}
                        id_currentColumn={item.id_currentColumn}
                        id_PB={item.id_PB}
                        id_USB={item.id_USB}
                        id_user={id_user}                      
                        title={item.title}
                        detail={item.detail}
                        kind={item.kind}
                        titlePB={props.titlePB} //props pour USB

                        onDragStart={onDragStart}
                    />
                )}
            </div>
        
        </div>
    );
};
