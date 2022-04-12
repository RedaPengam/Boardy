import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Column from './Column';
import Modal from './Modal';
import Header from './Header';
import axios from 'axios';
import { 
    fetchTable, fetchItem,
    urlColumns
} from '../API';

export default function UserStoryBoard({user}) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------
   
    const location = useLocation(); // pour la récupération des propriétés passées depuis Link (équivalent à props pour un Link)
    const urlUserStoryBoard = location.state.urlUserStoryBoard;
    const urlPlanningBoard = location.state.urlPlanningBoard;
    const titlePB = location.state.titlePB;
    const titleUSB = location.state.titleUSB;
    
    const id_PB = location.state.id_PB;
    const id_user = user.id;
    const [id, setId] = useState(0);
    const [color, setColor] = useState(0);
 
    const [columns, setColumns] = useState([]);
    
    const [modalOpen, setModalOpen] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();
    const boardStyle = (color) => ({backgroundColor: (color),});
   
    /* setter */
    function setUserStoryBoard(receivedBoard) {
        
        setId(receivedBoard.id);
        setColor(receivedBoard.color);

        fetchTable(urlColumns + "&board=USB&id_board=" + receivedBoard.id + "&id_user=" + id_user, setColumns);
    };

    // ------------------------ methods ------------------------------------------------------------------------------------------------

    /* CREATION Column */
    const onSubmit = (data) => {

        // creation de la Colonne
        var formNewColumn = new FormData();
        formNewColumn.append('id_PB', id_PB);
        formNewColumn.append('id_USB', id);
        formNewColumn.append('id_user', id_user);
        formNewColumn.append('title', data.title);
        formNewColumn.append('color', color);
        formNewColumn.append('columnTimescale', 0);
        formNewColumn.append('isInitial', data.isInitial);
        formNewColumn.append('isTerminal', data.isTerminal);
        formNewColumn.append('kind', "User Story Board");

        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST Column
        promise.then(res => {
            console.log("POST", data.title, color, data.isInitial, data.isTerminal);
            axios.post(urlColumns, formNewColumn).catch(error => {console.log(error)});
            return res;
        });
        // MAJ PlanningBoard
        promise.then(res => {            
            fetchItem(urlUserStoryBoard, setUserStoryBoard);
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

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        fetchItem(urlUserStoryBoard, setUserStoryBoard);
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------
     
    return (
        <>
            {/* paramétrage du header */}
            <Header 
                titlePage={"/ " + titleUSB}
                urlPath={"../PlanningBoard/" + titlePB}
                urlItem={urlPlanningBoard}
                titleLink={"/ " + titlePB} 
                user={user}
                color={color}     
            />
            {/* composant */}
            <div className="board" style={{backgroundColor: color + "99"}}>

                {/* Columns du UserStoryBoard */}
                {columns.map((item) =>
                    <Column draggable="true"
                        key={item.id} // pour éviter msg console
                        setColumns={setColumns}
                        setUserStoryBoard={setUserStoryBoard}
                        urlUserStoryBoard={urlUserStoryBoard}
                        urlColumn={urlColumns + "&id=" + item.id}
                        id={item.id}
                        id_PB={item.id_PB}
                        id_USB={item.id_USB}
                        id_user={item.id_user}
                        title={item.title}
                        color={color}
                        columnTimescale={item.columnTimescale}
                        isInitial={item.isInitial}
                        isTerminal={item.isTerminal}
                        kind={item.kind}
                    />
                )}

                {/* bouton d'ajout de Column */}
                <div className="board-plus-button" onClick={toggleModal}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5.5V19.5" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12.5H19" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Modal pour ajouter une Column */}
                <Modal open={modalOpen} title={"Nouvelle Colonne"} toggleModal={toggleModal}>
                    <form className="modal-form" onSubmit={handleSubmit(onSubmit)} >
                        <label className="modal-form-label">Titre</label>
                        <input className="modal-form-input" type="text" placeholder="Review" {...register("title", {required: true, maxLength: 80})} />
                        <label className="modal-form-label">Colonne initiale</label>
                        <div className="modal-form-horizontal-container">
                            <input className="modal-form-check" type="radio" id="i-yes" {...register("isInitial", { required: true })} value={1} />
                            <label className="modal-form-label" >Yes</label>  
                            <input className="modal-form-check" type="radio" id="i-no" {...register("isInitial", { required: true })} value={0} />
                            <label className="modal-form-label" >No</label>
                        </div>
                        <label className="modal-form-label" style={{marginTop: "20px"}}>Colonne terminale</label>
                        <div className="modal-form-horizontal-container">
                            <input className="modal-form-check" type="radio" id="f-yes" {...register("isTerminal", { required: true })} value={1} />
                            <label className="modal-form-label" htmlFor="t-yes">Yes</label>
                            <input className="modal-form-check" type="radio" id="f-no" {...register("isTerminal", { required: true })} value={0} />
                            <label className="modal-form-label" htmlFor="t-no">No</label>
                        </div>            
                        <input className="modal-form-input" type="submit" value="Ajouter !" />
                    </form>
                </Modal>

            </div>
        </>
    );
};
