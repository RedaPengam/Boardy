import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Label from './Label';
import Modal from './Modal';
import axios from 'axios';
import { 
    fetchTable, fetchItem, deleteItem, fetchCount,
    urlUserStoryBoards, urlStickers
} from '../API';

export default function Sticker(props) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------

    const urlSticker = props.urlSticker;
    const urlPlanningBoard = props.urlPlanningBoard;

    const id = props.id;
    const id_PB = props.id_PB;
    const id_USB = props.id_USB;
    const id_user = props.id_user;
    const [id_currentColumn, setId_currentColumn] = useState(props.id_currentColumn);
    const [title, setTitle] = useState(props.title);
    const [detail, setDetail] = useState(props.detail);
    const [kind, setKind] = useState(props.kind);

    const urlColumn = props.urlColumn;
    const setColumn = props.setColumn;
    const [countToDo, setCountToDo] = useState(0);
    const [countDoing, setCountDoing] = useState(0);
    const [countDone, setCountDone] = useState(0);
    const [labels, setLabels] = useState([]);
    const onDragStart = props.onDragStart;

    const [modalOpen, setModalOpen] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();
    
    /* setter */
    function setSticker(receivedSticker) {
        setTitle(receivedSticker.title);
        setDetail(receivedSticker.detail);
        setCountToDo(0);
        setCountDoing(0);
        setCountDone(0);
        setKind(receivedSticker.kind);
        if (receivedSticker.kind === "User Story Sticker") {
            fetchCount(urlStickers + "&count=y&kind=TS&isInitial=1&isTerminal=0&id_board=" + id_USB, setCountToDo);
            fetchCount(urlStickers + "&count=y&kind=TS&isInitial=0&isTerminal=0&id_board=" + id_USB, setCountDoing);
            fetchCount(urlStickers + "&count=y&kind=TS&isInitial=0&isTerminal=1&id_board=" + id_USB, setCountDone);
        }        
    }
 
    // ------------------------ methods ------------------------------------------------------------------------------------------------

    /* TELLS if Sticker is from UserStoryBoard */
    function isFromUserStoryBoard() {
        if (kind === "Task Sticker") {
            return true;
        } else if (kind === "User Story Sticker") {
            return false;
        }
    };

    /* MODIFICATION Sticker */
    const onSubmit = (data) => {

        // création Sticker
        var formNewSticker = new FormData();
        var newId_currentColumn = "";
        var newTitle = "";
        var newDetail = "";
        
        // si la donnée du form existe on la prend, sinon on remet l'ancienne
        if (data.id_currentColumn) {newId_currentColumn = data.id_currentColumn;} else {newId_currentColumn = id_currentColumn;}
        if (data.title) {newTitle = data.title;} else {newTitle = title;}
        if (data.detail) {newDetail = data.detail;} else {newDetail = detail;}
        formNewSticker.append('id_currentColumn', newId_currentColumn);
        formNewSticker.append('title', newTitle);
        formNewSticker.append('detail', newDetail);
        
        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST Sticker
        promise.then(res => {
            if (kind === "Task Sticker") {
                console.log("POST in USB : ", newTitle, newDetail, newId_currentColumn, kind);
                axios.post(urlSticker + "&board=USB" + "&id_user=" + id_user, formNewSticker)
                .then(res => console.log(res))
                .catch(error => {console.log(error)});
            } else if (kind === "User Story Sticker") {
                console.log("POST in PB : ", newTitle, newDetail, newId_currentColumn, kind);
                axios.post(urlSticker + "&board=PB&id_board=" + id_USB + "&id_user=" + id_user, formNewSticker)
                .then(res => console.log(res))
                .catch(error => {console.log(error)}); 
            }
            return res;
        });
        // MAJ Stickers
        promise.then(res => {
            if (kind === "User Story Sticker") {
                fetchTable(urlStickers + "&board=PB&id_board=" + id_PB + "&id_currentColumn=" + id + "&id_user=" + id_user, props.setStickers);
            } else if (kind === "Task Sticker") {
                fetchTable(urlStickers + "&board=USB&id_board=" + id_USB + "&id_currentColumn=" + id + "&id_user=" + id_user, props.setStickers);
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
            toggleModal();
        });
    };
    
    /* SET Modal on/off */
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    
    /* VIEW functions */
    function viewTask() {
        return (
            <>
                {/* header du Sticker */}
                <div className="sticker-header">
                    <div className="sticker-header-title">
                        {title}
                    </div>
                    {/* création du bouton d'options du Sticker*/}
                    <div className="sticker-header-options" onClick={toggleModal}>
                        <button className="sticker-header-options-dots-button">
                            <svg width="18" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* description du Sticker */}
                <div className="sticker-description">
                    {detail}
                </div>
            </>
        );
    };
    function viewUserStory() {
        return (
            <>
                {/* header du Sticker */}
                <div className="sticker-header">
                    <div className="sticker-header-title">
                        {/* création du lien vers la UserStoryBoard & propriétés utiles transmises dans state*/}
                        <Link className="link"
                            to={{
                                pathname: "/UserStoryBoard/" + title,
                                state: {
                                    urlUserStoryBoard: urlUserStoryBoards  + "&id=" + id_USB,
                                    urlPlanningBoard: urlPlanningBoard,
                                    id: id_USB,
                                    id_PB: id_PB,
                                    id_user: id_user,                                                                 
                                    titlePB: props.titlePB,
                                    titleUSB: title,
                                }                    
                            }}
                        >{title}</Link>
                    </div>
                    {/* bouton d'options du Sticker*/}
                    <div className="sticker-header-options" onClick={toggleModal}>
                        <button className="sticker-header-options-dots-button">
                            <svg width="18" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* description du Sticker */}
                <div className="sticker-description">
                    {detail}
                </div>
                 
                {/* infos du Sticker */}
                <div className="sticker-infos">
                    <div className="sticker-infos-item">
                        <div className="sticker-infos-item-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" rx="4" fill="#FFF85C"/>
                                <circle cx="8" cy="8" r="2" fill="#5A5A65"/>
                            </svg>
                        </div>
                        {countToDo + " To Do"}
                    </div>
                    <div className="sticker-infos-item">
                        <div className="sticker-infos-item-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" rx="4" fill="#DAFF45"/>
                                <circle cx="8" cy="8" r="2" fill="#5A5A65"/>
                            </svg>
                        </div>
                        {countDoing + " Doing"}
                    </div>
                    <div className="sticker-infos-item">
                        <div className="sticker-infos-item-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" rx="4" fill="#45FF8F"/>
                                <circle cx="8" cy="8" r="2" fill="#5A5A65"/>
                            </svg>
                        </div>
                        {countDone + " Done"}
                    </div>
                </div> 
            </>
        );
    };
    function viewDeleteButtonUSB() {
        return (
            <button className="modal-delete-button" 
                    onClick={() => {
                        // promise to run async functions IN ORDER
                        var promise = new Promise((resolve, reject) => {
                            axios.delete(urlSticker + "&board=USB").catch(error => {console.log(error)});
                            resolve(1);
                        });
                        // MAJ Stickers
                        promise.then(res => {
                            fetchTable(urlStickers + "&board=USB" + "&id_board=" + id_USB + "&id_currentColumn=" + id_currentColumn + "&id_user=" + id_user, props.setStickers);
                            return res;
                        });
                        // MAJ Column
                        promise.then(res => {
                            fetchItem(props.urlColumn, props.setColumn);
                            return res;
                        });
                    }}
                >
                    Delete ?
                </button>
        )
    };
    function viewDeleteButtonPB() {
        return (
            <button className="modal-delete-button"
                onClick={() => {
                    // promise to run async functions IN ORDER
                    var promise = new Promise((resolve, reject) => {
                        axios.delete(urlSticker + "&board=PB&id_USB=" + id_USB).catch(error => {console.log(error)});
                        resolve(1);
                    });
                    // MAJ Stickers
                    promise.then(res => {
                        fetchTable(urlStickers + "&board=USB&id_board=" + id_USB + "&id_currentColumn=" + id_currentColumn + "&id_user=" + id_user, props.setStickers);
                        return res;
                    });
                    // MAJ Column
                    promise.then(res => {
                        fetchItem(props.urlColumn, props.setColumn);
                        return res;
                    });
                    promise.then(res => {
                        toggleModal();
                        return res;
                    });
                }}
            >
                Delete ?
            </button>
        )
    }

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        fetchItem(urlSticker, setSticker);
    }, []);
    
    // ------------------------ view ------------------------------------------------------------------------------------------------

    return (
        <div className="sticker" id={id} draggable="true" onDragStart={onDragStart}>

            {/* VIEW TaskSticker || UserStorySticker */}
            {isFromUserStoryBoard() && viewTask()}
            {!isFromUserStoryBoard() && viewUserStory()}

            {/* labelssssssssssssssssssssssssssssss de tache/colonne du Sticker */}
            <div className="label-list">
                {/* {labels.map((item) =>
                    <Label draggable="true"
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        color={item.color}
                        assignees={item.assignees}
                    />
                )} */}
                <button className="label-plus-button">
                    <svg width="10" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5.5V19.5" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12.5H19" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            
            {/* Modal pour modifier le Sticker */}
            <Modal open={modalOpen} title={"Modifier - " + title} toggleModal={toggleModal}>
                <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                    <label className="modal-form-label">Titre</label>
                    <input className="modal-form-input" type="text" placeholder="Mon supra Sticker" {...register("title", {required: false, maxLength: 42})} />
                    <label className="modal-form-label">Description</label>
                    <input className="modal-form-input" type="text" placeholder="Petite description sympa" {...register("detail", {required: false, maxLength: 200})} />
                    <label className="modal-form-label">Déplacer sur la colonne id :</label>
                    <input className="modal-form-input" type="int" placeholder="id = ..." {...register("id_currentColumn", {required: false, maxLength: 11})} />
                    <input className="modal-form-input" type="submit" value="Modifier !" />
                </form>
                {/* création du bouton pour supprimer le Sticker */}
                {isFromUserStoryBoard() && viewDeleteButtonUSB()}
                {!isFromUserStoryBoard() && viewDeleteButtonPB()}
            </Modal>              

        </div>
    );
};
