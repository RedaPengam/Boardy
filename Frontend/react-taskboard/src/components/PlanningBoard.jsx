import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Column from './Column';
import Modal from './Modal';
import Header from './Header';
import axios from 'axios';
import { 
    fetchTable, fetchItem,
    urlColumns 
} from '../API';

export default function PlanningBoard({user}) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------
    
    const location = useLocation(); // pour la récupération des propriétés passées depuis Link (équivalent à props pour un Link)
    const urlPlanningBoard = location.state.url;

    const id_user = user.id;
    const [id, setId] = useState(0);
    const [title, setTitle] = useState("");
    const [color, setColor] = useState(0);
 
    const [columns, setColumns] = useState([]);
    
    const [modalOpen, setModalOpen] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();
    const boardStyle = (color) => ({backgroundColor: (color)});

    /* setter */
    function setPlanningBoard(receivedBoard) {

        setId(receivedBoard.id);
        setTitle(receivedBoard.title);
        setColor(receivedBoard.color);
        
        fetchTable(urlColumns + "&board=PB&id_board=" + receivedBoard.id + "&id_user=" + id_user, setColumns);
    };
    
    // ------------------------ methods ------------------------------------------------------------------------------------------------
     
    /* CREATION Column */
    const onSubmit = (data) => {

        // creation de la Colonne
        var formNewColumn = new FormData();
        formNewColumn.append('id_PB', id);
        formNewColumn.append('id_USB', 0);
        formNewColumn.append('id_user', user.id);
        formNewColumn.append('title', data.title);
        formNewColumn.append('color',  color); 
        formNewColumn.append('columnTimescale', data.columnTimescale);
        formNewColumn.append('isInitial', 0);
        formNewColumn.append('isTerminal', 0);
        formNewColumn.append('kind', "Planning Board");

        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST Column
        promise.then(res => {
            console.log("POST", data.title, color, data.columnTimescale);
            axios.post(urlColumns, formNewColumn).catch(error => {console.log(error)});
            return res;
        });
        // MAJ PlanningBoard
        promise.then(res => {
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

    /* actions exécutées une fois le composant monté */
    useEffect(() => {
        fetchItem(urlPlanningBoard, setPlanningBoard);
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------

    return (
        <>
            {/* paramétrage header */}
            <Header titlePage={"/ " + title} user={user} color={color} />
            {/* composant */}
            <div className="board" style={{backgroundColor: color + "99"}}>

                {/* Columns du PlanningBoard */}
                {columns.map((item) =>
                    <Column draggable="true" style={{opacity: 1}}
                        key={item.id} // pour éviter msg console
                        setColumns={setColumns} // pour pouvoir MAJ les Columns si on suppr la présente
                        setPlanningBoard={setPlanningBoard} // pour pouvoir MAJ les Columns si on suppr la présente
                        urlPlanningBoard={urlPlanningBoard} // pour pouvoir MAJ les Columns si on suppr la présente
                        urlColumn={urlColumns + "&id=" + item.id}
                        id={item.id}
                        id_PB={item.id_PB}
                        id_USB={item.id_USB}
                        id_user={item.id_user}
                        title={item.title}
                        color={color}
                        columnTimescale={item.columnTimescale}
                        isInitial={item.isInitial}
                        isTerminal={item.Terminal}
                        kind={item.kind}       
                        titlePB={title} // props pour USB
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
                <Modal open={modalOpen} title={"Nouvelle Période"} toggleModal={toggleModal}>
                    <form className="modal-form" onSubmit={handleSubmit(onSubmit)} >
                        <label className="modal-form-label">Titre</label>
                        <input className="modal-form-input" type="text" placeholder="Période n° ..." {...register("title", {required: true, maxLength: 80})} />
                        <label className="modal-form-label">Echelle de temps par colonne en semaines</label>
                        <input className="modal-form-input" type="number" placeholder="Entrer un nombre" {...register("columnTimescale", {required: true, maxLength: 80})} />
                        <input className="modal-form-input" type="submit" value="Ajouter !" />
                    </form>
                </Modal>

            </div>
        </>
    );
};
