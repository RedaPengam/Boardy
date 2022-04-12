import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import Modal from './Modal';
import axios from 'axios';
import { 
    fetchTable, fetchItem, deleteItem, fetchCount,
    urlPlanningBoards, urlColumns, urlStickers
} from '../API';

export default function PlanningCard(props) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------

    const id_PB = props.id_PB;
    const urlPlanningBoard = props.urlPlanningBoard;

    const id_user = props.id_user;
    const [planningBoard, setPlanningBoard] = useState([]);
    const [countColumns, setCountColumns] = useState(0);
    const [countUSS, setCountUSS] = useState(0);
    const [countUSSDone, setUSSDone] = useState(0);
    const msgNothing = "Il n'y a pas grand chose ici...\nça ne bosse pas assez !\nN'hésite pas à ajouter un Planning Board\nvia le bouton juste à droite";
            

    const [modalOpen, setModalOpen] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();    
    const cardStyle = (color) => ({backgroundColor: (color)});

    /* setter */
    function setPlanningCard(receivedBoard) {
        setPlanningBoard(receivedBoard);
        fetchCount(urlColumns + "&count=y&id_board=" + id_PB, setCountColumns);
        fetchCount(urlStickers + "&count=y&kind=USS&id_board=" + id_PB, setCountUSS);
        fetchCount(urlStickers + "&count=y&kind=USS&id_board=" + id_PB, setCountUSS);
    };

    // ------------------------ methods ------------------------------------------------------------------------------------------------

    /* MODIFICATION PlanningBoard */
    const onSubmit = (data) => {
        
        // création PlanningBoard
        var formNewBoard = new FormData();
        var newTitle = "";
        var newColor = "";
        var newColumnTimescale = 0;
        // si la donnée du form existe on la prend, sinon on remet l'ancienne
        if (data.title) {newTitle = data.title;} else {newTitle = planningBoard.title;}
        if (data.color === "#000000") {newColor = planningBoard.color;} else {newColor = data.color;}
        if (data.columnTimescale) {newColumnTimescale = data.columnTimescale;} else {newColumnTimescale = planningBoard.columnTimescale;}
        formNewBoard.append('title', newTitle);
        formNewBoard.append('color', newColor);
        formNewBoard.append('columnTimescale', newColumnTimescale);

        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST PlanningBoard
        promise.then(res => {
            axios.post(urlPlanningBoard, formNewBoard).catch(error => {console.log(error)});
            return res;
        });
        // MAJ PlanningBoards
        promise.then(res => {
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, props.setPlanningBoards);
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, props.setPlanningBoards);
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, props.setPlanningBoards);
            return res;
        });
        // MAJ PlanningBoard
        promise.then(res => {
            fetchItem(urlPlanningBoard, setPlanningBoard);
            fetchItem(urlPlanningBoard, setPlanningBoard);
            fetchItem(urlPlanningBoard, setPlanningBoard);
            return res;
        });
        // fermeture Modal
        promise.then(res => {
            toggleModal();
            return res;
        });
    };

    /* SET Modal on/off */
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    function popup(msg) {
        setTimeout(alert(msg), 20000);
    };

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        fetchItem(urlPlanningBoard, setPlanningCard);
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------
  
    {/* carte blague si aucun Planning Board n'a été créé par l'utilisateur */}
    if (planningBoard.length < 1) {
        return (
            <div className="planning-card">

                <div className="planning-card-horizontal-container" style={{fontWeight:"bold"}}>
                    <div className="link">
                        Lien vers Planning Board
                    </div>

                    {/* bouton d'options du PlanningBoard */}
                    <button className="planning-card-dots-button" onClick={toggleModal}>
                        <svg width="18" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="planning-card-vertical-container">
                    Ceci est une Planning Card.
                    <br/>
                    Ici s'affichent quelques infos sur le Planning Board.
                    <br/>
                    Il n'a pas grand chose ici...
                    ça ne bosse pas assez !
                    N'hésite pas à ajouter un Planning Board
                    via le bouton juste à droite
                </div>

            </div>
        );
    } else {
        return (

            <div className="planning-card" style={cardStyle(planningBoard.color)}>

                <div className="planning-card-horizontal-container">
                    {/* lien vers le PlanningBoard & propriété(s) utile(s) transmise(s) dans state*/}
                    <Link className="link"
                        to={{
                            pathname: "/PlanningBoard/" + planningBoard.title,
                            state: {
                                url: urlPlanningBoard
                            }                    
                        }}
                    >
                        {planningBoard.title}
                    </Link>

                    {/* bouton d'options du PlanningBoard */}
                    <button className="planning-card-dots-button" onClick={toggleModal}>
                        <svg width="18" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="planning-card-vertical-container">
                    {/* ID : {planningBoard.id} */}
                    <br></br>
                    Nombre de périodes : {countColumns}
                    <br></br>
                    Nombre d'User Stories : {countUSS}
                </div>

                {/* Modal pour modifier le PlanningBoard */}
                <Modal open={modalOpen} title={"Modifier - " + planningBoard.title} toggleModal={toggleModal}>
                    {/* form pour modifier le PlanningBoard */}
                    <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-form-container-horizontal">
                            <div className="modal-form-container-title">
                                <label className="modal-form-label">Titre</label>
                                <input className="modal-form-input" type="text" placeholder="Planning Board Mega 3000" {...register("title", {required: false, maxLength: 80})} />
                            </div>
                            <div className="modal-form-container-color">
                                <label className="modal-form-label">Couleur</label>
                                <input className="modal-form-input" type="color" {...register("color", {required: false, maxLength: 10})} />
                            </div>
                        </div>
                        <label className="modal-form-label">Echelle de temps par colonne en semaines</label>
                        <input className="modal-form-input" type="number" placeholder="3" {...register("columnTimescale", {required: false})} />
                        <input className="modal-form-input" type="submit" value="Modifier !" />
                    </form>
                    {/* bouton pour supprimer le PlanningBoard */}
                    <button className="modal-delete-button" 
                        onClick={() => {
                            deleteItem(urlPlanningBoard, urlPlanningBoards + "&id_user=" + id_user, fetchTable, props.setPlanningBoards)
                            toggleModal(); 
                        }}
                    >
                        Delete ?
                    </button>
                </Modal>
                      
            </div>
        );

    };
};