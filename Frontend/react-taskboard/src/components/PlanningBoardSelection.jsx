import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PlanningCard from './PlanningCard';
import Modal from './Modal';
import Header from './Header';
import axios from 'axios';
import { 
    fetchTable, postMultipleItems, getLastItemId, getLastItemIdThenPost,
    urlPlanningBoards, urlColumns
} from '../API';
import { withRouter } from 'react-router';

function PlanningBoardSelection({user}) {

    // ------------------------ constructor ------------------------------------------------------------------------------------------------

    const id_user = user.id;

    const [planningBoards, setPlanningBoardsArray] = useState([]);
    
    const [modalOpen, setModalOpen] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();
    
    const [cacheLastPBId, setCacheLastPBId] = useState(0);

    /* setter */
    function setPlanningBoards(receivedBoards) {

        var promise = new Promise((resolve, reject) => {
            setPlanningBoardsArray(receivedBoards);
            resolve(receivedBoards.length);
        });
        promise.then(res => {
            if (res === 0) {setCacheLastPBId(0);}
            return res;
        });
        promise.then(res => {
            getLastItemId(urlPlanningBoards + "&last=y" + "&id_user=" + id_user, cacheLastPBId, setCacheLastPBId);
            return res;
        });
    }

    // ------------------------ methods ------------------------------------------------------------------------------------------------

    /* CREATION PlanningBoard */
    const onSubmit = (data) => {

        // création PlanningBoard
        var formNewBoard = new FormData();
        var newColumnNumber = 0;
        var newColumnTimescale = 0;
        
        // si la donnée du form existe on la prend, sinon on la met vide (création PB vide)
        if (data.columnNumber) {newColumnNumber = data.columnNumber;} else {newColumnNumber = 0;}
        if (data.columnTimescale) {newColumnTimescale = data.columnTimescale;} else {newColumnTimescale = 0;}
        formNewBoard.append('id_user', id_user);
        formNewBoard.append('title', data.title);
        formNewBoard.append('color', data.color);

        // promise to run async functions IN ORDER
        var promise = new Promise((resolve, reject) => {
            resolve(1);
        });
        // POST PlanningBoard
        promise.then(res => {
            axios.post(urlPlanningBoards, formNewBoard)
            .then(res => {console.log("PB posted", res);})
            .catch(error => {console.log("PB NOT posted ", error);});
            return res;
        });
        // GET last PlanningBoard id & POST Columns
        promise.then(res => {
            
            function postColumns(id_lastPB) {

                // creation Columns
                var formColumns = new FormData();
                var columns = [];                
                for (let i = 1 ; i <= eval(newColumnNumber) ; i ++) {
                    // creation Column
                    var jsonNewColumn = JSON.stringify({
                        "id_PB": id_lastPB,
                        "id_USB": 0,
                        "id_user": user.id,
                        "title": "Période " + i,
                        "color": data.color, 
                        "columnTimescale": newColumnTimescale,
                        "isInitial": 0,
                        "isTerminal": 0,
                        "kind": "Planning Board"                      
                    });
                    // console.log("on push colonne", i);
                    columns.push(jsonNewColumn);
                }
                // console.log(JSON.stringify(columns));

                // POST Columns
                formColumns.append('columns', JSON.stringify(columns));
                postMultipleItems(urlColumns + "&multiple=y" + "&board=PB", formColumns);
            };

            getLastItemIdThenPost(urlPlanningBoards + "&last=y" + "&id_user=" + id_user, cacheLastPBId, setCacheLastPBId, postColumns);
            
            return res;
        });
        // MAJ PlanningBoards
        promise.then(res => {
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, setPlanningBoards);
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, setPlanningBoards);
            fetchTable(urlPlanningBoards + "&id_user=" + id_user, setPlanningBoards);
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
        fetchTable(urlPlanningBoards + "&id_user=" + id_user, setPlanningBoards, id_user);
    }, []);

    // ------------------------ view ------------------------------------------------------------------------------------------------

    return (
        <>
            {/* paramétrage header */}
            <Header user={user} />
            {/* composant */}
            <div className="planning-board-selection">

                {/* background */}
                <svg className="planning-board-selection-background" width="1168" height="283" viewBox="0 0 1168 283" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1027.54 134.108C1029.33 133.889 1031.24 133.967 1032.9 134.674C1036.44 136.18 1037.45 140.37 1037.4 143.775C1037.35 147.44 1036.57 151.443 1039.35 154.397C1040.63 155.754 1042.22 156.793 1043.48 158.176C1044.82 159.653 1045.87 161.344 1046.65 163.159C1048.08 166.494 1048.79 170.415 1047.48 173.913C1046.32 176.993 1043.43 179.773 1044.05 183.275C1044.71 186.928 1048.38 189.721 1050.68 192.442C1053.28 195.522 1055.68 199.457 1056.07 203.496C1056.45 207.366 1054.77 211.28 1052.19 214.205C1047.03 220.051 1039.28 222.917 1031.46 222.899C1028.14 222.891 1024.39 222.741 1021.52 220.955C1020.64 220.403 1020.17 219.783 1019.64 218.922C1019.17 218.15 1018.55 217.648 1017.83 217.102C1016.24 215.901 1015.1 214.284 1014.37 212.473C1011.53 205.441 1013.8 196.741 1017.77 190.497C1018.71 189.017 1019.48 187.593 1019.02 185.83C1018.55 183.989 1017.37 182.329 1016.34 180.746C1015.31 179.182 1014.14 177.69 1013.34 176C1012.5 174.228 1012.27 172.373 1012.42 170.435C1012.69 166.793 1014.26 163.433 1016.49 160.504C1018.63 157.683 1021.14 154.984 1021.14 151.288C1021.15 147.371 1018.54 143.886 1019.65 139.903C1020.11 138.254 1021.04 136.562 1022.53 135.573C1023.96 134.625 1025.85 134.314 1027.54 134.108Z" fill="#DDE3E9"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1026.37 140.371C1026.4 139.845 1027.02 139.529 1027.51 139.667C1028.16 139.847 1028.15 140.452 1028.13 140.99C1028.08 142.645 1028.32 144.253 1028.71 145.858C1029.54 149.196 1031.06 152.272 1032.27 155.479C1033.48 158.682 1034.05 161.99 1033.34 165.38C1032.67 168.577 1031.62 171.69 1030.94 174.891C1030.34 177.712 1029.7 180.686 1030.61 183.5C1031.5 186.208 1033.45 188.414 1034.85 190.861C1037.76 195.928 1039.05 201.548 1039.22 207.333C1039.3 210.018 1039.23 212.729 1038.61 215.363C1038.25 216.88 1037.77 218.93 1036.47 219.977C1035.87 220.46 1034.85 220.627 1034.35 219.912C1033.87 219.241 1034.29 218.203 1034.44 217.488C1035.09 214.393 1035.22 211.23 1035.06 208.088C1034.91 205.044 1034.55 202.005 1033.6 199.098C1032.71 196.4 1031.36 193.977 1029.77 191.617C1028.16 189.212 1026.48 186.802 1025.81 183.952C1025.13 181.058 1025.68 178.113 1026.42 175.274C1027.2 172.271 1028.22 169.354 1029.28 166.433C1030.31 163.586 1030.67 160.892 1030.1 157.913C1028.98 152.026 1025.97 146.501 1026.37 140.371Z" fill="#C5CFD6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1074.81 141.251C1077.02 141.925 1079.22 143.012 1080.8 144.717C1084.16 148.342 1083.13 153.821 1081.28 157.823C1079.28 162.131 1076.26 166.46 1077.96 171.402C1078.75 173.674 1080.06 175.732 1080.81 178.021C1081.6 180.468 1081.94 183.016 1081.9 185.569C1081.82 190.258 1080.57 195.262 1077.19 198.717C1074.22 201.759 1069.35 203.535 1068.24 208.003C1067.07 212.664 1069.91 217.883 1071.17 222.299C1072.6 227.297 1073.33 233.199 1071.66 238.18C1070.06 242.954 1066.03 246.706 1061.46 248.821C1052.32 253.047 1041.72 252.397 1032.56 248.303C1028.67 246.565 1024.34 244.429 1021.93 240.825C1021.18 239.71 1020.96 238.735 1020.8 237.442C1020.65 236.283 1020.19 235.364 1019.63 234.342C1018.4 232.097 1017.91 229.588 1018.01 227.066C1018.4 217.272 1025.65 208.164 1033.6 202.848C1035.48 201.588 1037.14 200.306 1037.53 197.982C1037.94 195.557 1037.44 192.982 1037.06 190.571C1036.69 188.187 1036.1 185.814 1036.06 183.397C1036.01 180.865 1036.71 178.548 1037.91 176.333C1040.15 172.171 1043.77 169.015 1047.92 166.709C1051.92 164.488 1056.29 162.606 1058.25 158.238C1060.32 153.608 1059.09 148.124 1062.5 143.994C1063.91 142.284 1065.89 140.766 1068.16 140.375C1070.34 139.999 1072.72 140.617 1074.81 141.251Z" fill="#DDE3E9"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1070.28 148.907C1070.6 148.301 1071.49 148.255 1071.99 148.675C1072.65 149.228 1072.32 149.937 1072.02 150.566C1071.09 152.498 1070.53 154.528 1070.16 156.637C1069.38 161.024 1069.55 165.467 1069.29 169.899C1069.03 174.327 1067.96 178.541 1065.36 182.184C1062.91 185.619 1060.05 188.755 1057.58 192.187C1055.4 195.211 1053.1 198.397 1052.7 202.211C1052.31 205.881 1053.44 209.518 1053.81 213.154C1054.56 220.681 1053.13 228.015 1050.31 234.955C1048.99 238.178 1047.49 241.35 1045.39 244.143C1044.18 245.752 1042.54 247.927 1040.48 248.485C1039.52 248.743 1038.24 248.404 1038.03 247.292C1037.82 246.25 1038.85 245.238 1039.4 244.47C1041.78 241.146 1043.59 237.469 1045.05 233.666C1046.46 229.982 1047.63 226.195 1048.03 222.25C1048.41 218.589 1048.1 215.012 1047.47 211.384C1046.84 207.686 1046.13 203.95 1046.84 200.224C1047.56 196.44 1049.75 193.242 1052.09 190.267C1054.58 187.121 1057.3 184.203 1060.06 181.298C1062.75 178.467 1064.59 175.468 1065.48 171.642C1067.24 164.081 1066.62 155.961 1070.28 148.907Z" fill="#C5CFD6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1006.32 169.059C1010 169.059 1013.24 171.015 1015.47 173.79C1018.08 177.04 1018.61 181.008 1019.67 184.88C1020.2 186.808 1021.11 188.721 1022.7 190.03C1024.15 191.221 1025.98 191.459 1027.71 192.041C1031.18 193.204 1033.97 196.004 1035.08 199.422C1036.42 203.591 1035 207.795 1035.24 212.019C1035.47 215.899 1039.29 218.32 1042.36 220.18C1045.39 222.014 1048.12 223.73 1049.03 227.303C1050 231.093 1050.32 235.322 1048.98 239.066C1046.75 245.298 1040.22 248.043 1033.91 248.469C1028.18 248.855 1020.98 248.248 1016.68 244.085C1014.11 241.593 1013.18 238.108 1013.29 234.641C1013.36 232.485 1013.79 230.349 1014.34 228.265C1014.73 226.789 1015.26 225.318 1015.41 223.792C1015.81 219.733 1012.06 218.953 1008.88 217.838C1004.82 216.422 1001.99 213.746 1000.01 210.018C998.178 206.548 997.407 202.652 998.509 198.83C999.071 196.879 1000.09 195.109 1001.47 193.603C1002.08 192.94 1002.94 192.387 1003.49 191.691C1004 191.041 1003.89 190.198 1003.72 189.437C1002.9 185.919 1000.35 183.006 999.44 179.494C998.618 176.324 999.104 172.38 1002 170.335C1003.25 169.451 1004.79 169.069 1006.32 169.059Z" fill="#C5CFD6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1011.34 178.225C1015.24 182.391 1016.3 188.044 1016.61 193.522C1016.79 196.595 1016.61 199.835 1017.51 202.815C1018.28 205.365 1020.09 207.315 1021.95 209.158C1025.7 212.867 1029.88 216.638 1030.98 222.006C1031.62 225.157 1031.19 228.411 1032.08 231.526C1032.89 234.358 1034.31 237.141 1036.04 239.532C1037.44 241.458 1039.25 242.933 1040.78 244.728C1041.24 245.276 1041.91 246.083 1041.72 246.856C1041.49 247.762 1040.34 248.049 1039.52 247.907C1037.62 247.575 1036.01 245.752 1034.77 244.427C1032.94 242.489 1031.4 240.405 1030.14 238.067C1028.74 235.47 1027.61 232.715 1027.13 229.802C1026.64 226.78 1026.88 223.63 1025.74 220.73C1023.83 215.85 1019.18 212.97 1015.82 209.166C1011.63 204.427 1012.25 198.528 1012.68 192.698C1012.92 189.494 1013.15 185.876 1011.54 182.951C1010.92 181.834 1009.54 180.793 1009.28 179.524C1009.04 178.361 1010.36 177.186 1011.34 178.225Z" fill="#AFB9C5"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1015.5 246.689C1015.5 270.516 1019.38 283 1039.88 283C1060.37 283 1064.25 270.516 1064.25 246.689H1015.5Z" fill="#89C5CC"/>
                    <path d="M49.92 197.21H28.704C28.0147 197.21 27.456 197.771 27.456 198.463V201.595C27.456 202.287 28.0147 202.848 28.704 202.848H49.92C50.6092 202.848 51.168 202.287 51.168 201.595V198.463C51.168 197.771 50.6092 197.21 49.92 197.21Z" fill="#AFB9C5"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M33.696 179.043C36.3749 170.326 37.876 161.138 38.1993 151.479H39.936H41.0487C41.372 161.138 42.8731 170.326 45.552 179.043H49.608C54.9497 179.043 59.28 183.39 59.28 188.753C59.28 194.116 54.9497 198.463 49.608 198.463H29.016C23.6743 198.463 19.344 194.116 19.344 188.753C19.344 183.39 23.6743 179.043 29.016 179.043H33.696Z" fill="#DDE3E9"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.2363 108.052C24.3868 107.351 31.5374 107 38.688 107C45.8386 107 52.9891 107.351 60.1397 108.052L63.024 157.827C54.912 158.606 46.8 158.996 38.688 158.996C30.576 158.996 22.464 158.606 14.352 157.827L17.2363 108.052Z" fill="#C5CFD6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.104 202.848H64.896H78V268H64.896V216.63H13.104V268H0V202.848H13.104Z" fill="#F2F2F2"/>
                    <g clipPath="url(#clip0)">
                    <path d="M1097.12 15.7958L1108.77 4.166C1110.73 2.21005 1113.91 2.2094 1115.87 4.16454C1115.87 4.16502 1115.87 4.16551 1115.87 4.166L1146.87 35.1231C1148.75 37.0012 1149.81 39.5479 1149.81 42.2033V247.244" stroke="#CBCBCB" strokeWidth="8"/>
                    <path d="M1166.12 246.618H1132.88C1131.84 246.618 1130.99 247.459 1130.99 248.496V249.122C1130.99 250.159 1131.84 251 1132.88 251H1166.12C1167.16 251 1168 250.159 1168 249.122V248.496C1168 247.459 1167.16 246.618 1166.12 246.618Z" fill="#AFB9C5"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1104.13 8.97248C1112.21 17.0391 1112.21 30.1177 1104.13 38.1843L1091.71 50.5772L1062.44 21.3654L1074.86 8.97247C1082.94 0.90586 1096.05 0.905861 1104.13 8.97248Z" fill="#C5CFD6"/>
                    <path d="M1074.69 38.5118C1082.77 46.5784 1090.61 51.8297 1092.21 50.2408C1093.8 48.6519 1088.54 40.8246 1080.45 32.758C1072.37 24.6914 1064.53 19.4401 1062.93 21.029C1061.34 22.6179 1066.6 30.4452 1074.69 38.5118Z" fill="#F2F2F2"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="106" height="251" fill="white" transform="translate(1062)"/>
                    </clipPath>
                    </defs>
                </svg>      

                {/* PlanningCards */}
                {planningBoards.length === 0 && <PlanningCard />}
                {planningBoards.map((item) =>
                    <PlanningCard
                        key={item.id} // pour éviter les msg console
                        id_PB={item.id}
                        id_user={id_user}
                        urlPlanningBoard={urlPlanningBoards + "&id=" + item.id}
                        setPlanningBoards={setPlanningBoards}
                    />
                )}

                {/* bouton d'ajout de PlanningBoard */}
                <button className="planning-board-selection-plus-button" onClick={toggleModal}>

                    {/* {cacheLastPBId + " "} */}
                    {/* {"pbc length---" + cachePBLength + " "}
                    {"pb length---" + planningBoards.length} */}

                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5.5V19.5" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12.5H19" stroke="#455266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Modal pour ajouter un PlanningBoard */}
                <Modal open={modalOpen} title="Nouveau Planning Board" toggleModal={toggleModal}>
                    <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-form-container-horizontal">
                            <div className="modal-form-container-title">
                                <label className="modal-form-label">Titre</label>
                                <input className="modal-form-input" type="text" placeholder="Planning Board Mega 3000" {...register("title", {required: true, maxLength: 80})} />
                            </div>
                            <div className="modal-form-container-color">
                                <label className="modal-form-label">Couleur</label>
                                <input className="modal-form-input" type="color" {...register("color", {required: true, maxLength: 10})} />
                            </div>
                        </div>
                        <label className="modal-form-label">Nombre de colonnes</label>
                        <input className="modal-form-input" type="number" placeholder="120 ça fait beaucoup..." {...register("columnNumber", {required: false, min: 0})} />
                        <label className="modal-form-label">Echelle de temps par colonne en semaines</label>
                        <input className="modal-form-input" type="number" placeholder="Entrer un nombre" {...register("columnTimescale", {required: false, min: 1})} />
                        <input className="modal-form-input" type="submit" value="Ajouter !" />
                    </form>
                </Modal>

            </div>
        </>
    );
};

export default withRouter(PlanningBoardSelection);
