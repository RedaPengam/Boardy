


<?php

// ---------------- import de classes ------------------------------------------------------------------------------------------------

require_once './classes/PlanningBoard.php';
require_once './classes/UserStoryBoard.php';
require_once './classes/Column.php';
require_once './classes/Sticker.php';
require_once './classes/Actor.php';
require_once './classes/Verb.php';
require_once './classes/xAPI_Statement.php';

// ---------------- outils de dev ------------------------------------------------------------------------------------------------

// lignes pour éviter le cross origin pb : à retirer lorsque le serveur sera vraiment fonctionnel 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, x-requested-with");
// to get php errors
error_reporting(E_ALL);
ini_set('display_errors', '1');

// ---------------- initialisation des variables pour les requêtes SQL ------------------------------------------------------------------------------------------------

$method = $_SERVER['REQUEST_METHOD']; // définit si la requète axios est : GET || POST

/* variables récupérables
* DEPUIS l'URL de la requête axios
* avec : $_GET['variable'] 
*/

$table = '';
$board = '';
$id_board = '';
$id = '';
$last = '';
$signin = '';

/* variables récupérables
* DEPUIS le FORM de la requête axios 
* avec : $_POST['variable'] 
*/

// Login
$signin_email = '';
$signin_password = '';
// Planning Board
$id_user = '';
$title = '';
$color = '';
$columnNumber = '';
// Column lastsVariables+(or not)=
$id_PB = '';
$id_USB = '';
$columnTimescale = '';
$isInitial = '';
$isTerminal = '';
$kind = '';
// Sticker lastsVariables+(or not)=
$id_currentColumn = '';
$detail = '';

/* variables xAPI
*/
$xAPI_id_login = 'https://brindlewaye.com/xAPITerms/verbs/loggedin/';
$xAPI_detail_login = "Connexion (actor)";
$xAPI_id_create = 'https://activitystrea.ms/schema/1.0/create';
$xAPI_detail_create = "Création (objet) par (actor)";
$xAPI_id_update = 'http://activitystrea.ms/schema/1.0/update';
$xAPI_detail_update = "Modification (objet) par (actor)";
$xAPI_id_move = 'none';
$xAPI_detail_move = "Déplacement (objet) par (actor)";
$xAPI_id_delete = 'https://activitystrea.ms/schema/1.0/delete';
$xAPI_detail_delete = "Suppression (objet) par (actor)";

// ---------------- initialisation des variables pour la connexion à la db ------------------------------------------------------------------------------------------------

$servername = "localhost";
$username = "reda";
$password = "password";
$dbname = "boardy";

// ---------------- connexion à la db ------------------------------------------------------------------------------------------------

$connexion = new mysqli($servername, $username, $password, $dbname);
if ($connexion -> connect_errno) {
    echo "Failed to connect to MySQL: " . $connexion -> connect_error;
    exit();
}

// ---------------- fonctions pour les requêtes SQL ------------------------------------------------------------------------------------------------

function getSet_actor($connexion, $id_user) {
    $sql = "SELECT id, firstname, lastname, email, quality FROM `Users`  
            WHERE id = '$id_user'";
    $query = mysqli_query($connexion, $sql); // runs sql query
    $user = array();
    while ($row = mysqli_fetch_assoc($query)) {
        $user[] = $row['id'];
        $user[] = $row['firstname'];
        $user[] = $row['lastname'];
        $user[] = $row['email'];
        $user[] = $row['quality'];
    }
    $actor = new Actor(
        $user[0],
        $user[1],
        $user[2],
        $user[3],
        $user[4]
    );
    return $actor;
};
function get_stuff($connexion, $sql) {
    $query = mysqli_query($connexion, $sql); // runs sql query
    $stuff = array(); //create an array
    while ($row = mysqli_fetch_assoc($query)) {
        $stuff[] = $row;
    }
    echo json_encode($stuff);
};
function get_stuffBis($connexion, $sql) {
    $query = mysqli_query($connexion, $sql); // runs sql query
    $stuff = array(); //create an array
    while ($row = mysqli_fetch_assoc($query)) {
        $stuff[] = $row;
    }
   return $stuff;
};
function param_get_stuff() {
    if       (empty($_GET['id']) && empty($_GET['last']) && empty($_GET['id_board']) && empty($_GET['count'])) {
        return 1;
    } elseif (!empty($_GET['id']) && empty($_GET['last']) && empty($_GET['id_board']) && empty($_GET['count'])) {
        return 2;
    } elseif (empty($_GET['id']) && !empty($_GET['last']) && empty($_GET['id_board']) && empty($_GET['count'])) {
        return 3;
    } elseif (empty($_GET['id']) && empty($_GET['last']) && !empty($_GET['id_board']) && empty($_GET['count'])) {
        return 4;
    } elseif (empty($_GET['id']) && empty($_GET['last']) && !empty($_GET['id_board']) && !empty($_GET['count'])) {
        return 5;
    }
};
function param_post_stuff() {
    if        (empty($_GET['id']) && empty($_GET['multiple']) && empty($_GET['signin']) && empty($_GET['move'])) { // url = .../?table=Columns
        return 1;
    } else if (empty($_GET['id']) && !empty($_GET['multiple']) && empty($_GET['signin']) && empty($_GET['move'])) { // url = .../?table=Columns&multiple=y
        return 2;
    } else if (!empty($_GET['id']) && empty($_GET['multiple']) && empty($_GET['signin']) && empty($_GET['move'])) { // url = .../?table=Columns&id=id_Column
        return 3;
    } else if (empty($_GET['id']) && empty($_GET['multiple']) && !empty($_GET['signin']) && empty($_GET['move'])) { // url = .../?table=Users&signin=y
        return 4;
    } else if (!empty($_GET['id']) && empty($_GET['multiple']) && empty($_GET['signin']) && !empty($_GET['move'])) { // url = .../?table=Stickers&id=id_sticker&move=y
        return 5;
    }
};
function getIdLastItem_fromTable_belongingToUser($connexion, $table, $id_user) {
    $sql = "SELECT id FROM $table 
        WHERE id = (SELECT max(id) FROM $table)
        AND id_user = '$id_user'";
    $query = mysqli_query($connexion, $sql); // runs sql query
    $array = array();
    while ($row = mysqli_fetch_assoc($query)) {
        $array[] = $row['id'];
    }
    return $array[0];
};
function getRequest($connexion, $sql) {
    $query = mysqli_query($connexion, $sql); // runs sql query
    $array = array();
    while ($row = mysqli_fetch_assoc($query)) {
        $array[] = $row;
    }
    // echo json_encode($array[0]); // pour voir sur la console
    return $array; // pour retourner l'objet
};
function post_xAPI_Statement($connexion, $xAPI_Statement) {
    $json = json_encode($xAPI_Statement);
    $sql = "INSERT INTO `xAPI` (xAPI_Statement)
            VALUES ('$json')";
    $query = mysqli_query($connexion, $sql); // runs sql query
};

// ---------------- requêtes SQL ------------------------------------------------------------------------------------------------

$table = $_GET['table'];
switch ($method) {

    case 'GET': // RECUPERATION (GET) (5 cas)
        switch(param_get_stuff()) {

            case 1: // RECUPERATION (GET) d'une table entière de la db
 
                $id_user = $_GET['id_user'];
                $sql = "SELECT * FROM $table 
                        WHERE id_user = '$id_user'";
                get_stuff($connexion, $sql);

            break;

            case 2: // RECUPERATION (GET) d'un élément d'une table de la db

                $id = $_GET['id'];
                $sql = "SELECT * FROM $table 
                        WHERE id = '$id'";
                get_stuff($connexion, $sql);

            break;

            case 3: // RECUPERATION (GET) du dernier élément d'une table de la db

                $id_user = $_GET['id_user'];
                $sql = "SELECT * FROM $table 
                        WHERE id = (SELECT max(id) FROM $table)
                        AND id_user = '$id_user'";
                get_stuff($connexion, $sql);

            break;

            case 4: // RECUPERATION (GET) d'une partie de table de la db (2 cas)
                switch($table) { // partie de table souhaitée : Columns || Stickers

                    case 'Columns':  // PB || USB (2 cas)
                        $board = $_GET['board'];
                        switch($_GET['board']) { // Column provenant du board : PB || USB
                            
                            case 'PB': // "url = .../?table=Columns&board=PB&id_board=id_PB"

                                $id = $_GET['id_board'];
                                $sql = "SELECT * FROM $table 
                                        WHERE id_PB = '$id'
                                        AND kind = 'Planning Board'
                                        ORDER BY id ASC";
                                get_stuff($connexion, $sql);
                            
                            break;

                            case 'USB': // "url = .../?table=Columns&board=USB&id_board=id_USB"

                                $id = $_GET['id_board'];
                                $sql = "SELECT * FROM $table 
                                        WHERE id_USB = '$id'
                                        AND kind = 'User Story Board'
                                        ORDER BY id ASC";
                                get_stuff($connexion, $sql);
                            
                            break;
                        }
                    break;
                    
                    case 'Stickers': // PB || USB (2 cas)
                        $board = $_GET['board'];
                        switch($_GET['board']) { // Sticker provenant du board : PB || USB

                            case 'PB':
                                
                                // "url = .../?table=Stickers&board=PB&id_board=id_PB&id_currentColumn=id_currentColumn"
                                $id_board = $_GET['id_board'];
                                $id_currentColumn = $_GET['id_currentColumn'];
                                $sql = "SELECT * FROM $table 
                                        WHERE id_PB = '$id_board'
                                        AND id_currentColumn = '$id_currentColumn'";
                                get_stuff($connexion, $sql);
                            
                            break;

                            case 'USB': 
                                
                                // "url = .../?table=Stickers&board=USB&id_board=id_USB&id_currentColumn=id_currentColumn"
                                $id_board = $_GET['id_board'];
                                $id_currentColumn = $_GET['id_currentColumn'];
                                $sql = "SELECT * FROM $table 
                                        WHERE id_USB = '$id_board'
                                        AND id_currentColumn = '$id_currentColumn'";
                                get_stuff($connexion, $sql);                   
                            
                            break;
                        }
                    break;
                }
            break;

            case 5: // COMPTAGE (GET) du nombre d'éléments d'un table de la db
                switch($table) {

                    case "Columns":

                        $id_board = $_GET['id_board'];
                        $sql = "SELECT count(*) FROM $table 
                                WHERE id_PB = '$id_board'
                                AND id_USB = 0";
                        get_stuff($connexion, $sql);

                    break;

                    case "Stickers":
                        $kind = $_GET['kind'];
                        switch($kind) {

                            case "USS":
                     
                                $id_board = $_GET['id_board'];
                                $sql = "SELECT count(*) FROM $table
                                        WHERE id_PB = '$id_board'
                                        AND kind = 'User Story Sticker'";
                                get_stuff($connexion, $sql);

                            break;                

                            case "TS":

                                $id_board = $_GET['id_board'];
                                $isInitial = $_GET['isInitial'];
                                $isTerminal = $_GET['isTerminal'];
                                $sql = "SELECT count(*) FROM $table
                                        WHERE id_USB = '$id_board'
                                        AND kind = 'Task Sticker'
                                        AND id_currentColumn = 
                                            (SELECT id FROM Columns 
                                            WHERE id_USB = '$id_board'
                                            AND isInitial = '$isInitial'
                                            AND isTerminal = '$isTerminal'
                                            )
                                        ";
                                get_stuff($connexion, $sql);

                            break;
                        }
                    break;
                }
            break;
        }
    break;

    case 'POST': // AJOUT (POST), MODIFICATION (PUT), RECUPERATION (GET) et SUPPRESSION (DELETE) (5 cas)
        switch(param_post_stuff()) {

            case 1: // AJOUT (POST) d'un élément à une table de la db (4 cas)
                switch ($table) {

                    case 'PlanningBoards':

                        $id_user = $_POST['id_user'];
                        $title = mysqli_real_escape_string($connexion, $_POST['title']);
                        $color = $_POST['color'];
                        $sql = "INSERT INTO $table (id_user, title, color) 
                                VALUES ('$id_user', '$title', '$color')";
                        $result = mysqli_query($connexion, $sql); // runs sql query

                    break;
    
                    case 'Columns':
    
                        $id_PB = $_POST['id_PB'];
                        $id_USB = $_POST['id_USB'];
                        $id_user = $_POST['id_user'];
                        $title = mysqli_real_escape_string($connexion, $_POST['title']);
                        $color = $_POST['color'];
                        $columnTimescale = $_POST['columnTimescale'];
                        $isInitial = $_POST['isInitial'];
                        $isTerminal = $_POST['isTerminal'];
                        $kind = $_POST['kind'];
                        $sql = "INSERT INTO $table (id_PB, id_USB, id_user, title, color, columnTimescale, isInitial, isTerminal, kind) 
                                VALUES ('$id_PB', '$id_USB', '$id_user', '$title', '$color', '$columnTimescale', '$isInitial', '$isTerminal', '$kind')";
                        $result = mysqli_query($connexion, $sql); // runs sql query
                        
                        /************* xAPI *************/

                        // create actor Object
                        $actor = getSet_actor($connexion, $id_user);
                        // create verb Object
                        $verb = new Verb($xAPI_id_create, $xAPI_detail_create);
                        // create object Object
                        $id_lastObject = getIdLastItem_fromTable_belongingToUser($connexion, $table, $id_user);
                        $stickers = array();
                        $object = new Column($id_lastObject, $id_PB, $id_USB, $id_user, $title, $color, $columnTimescale, $isInitial, $isTerminal, $kind, $stickers);                        
                        // create xAPI_Statement Object
                        $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                        post_xAPI_Statement($connexion, $xAPI_Statement);

                    break;
    
                    case 'Stickers':
    
                        $id_PB = $_POST['id_PB'];
                        $id_USB = $_POST['id_USB'];
                        $id_currentColumn = $_POST['id_currentColumn'];
                        $id_user = $_POST['id_user'];
                        $title = mysqli_real_escape_string($connexion, $_POST['title']);
                        $detail = mysqli_real_escape_string($connexion, $_POST['detail']);
                        $kind = $_POST['kind'];
                        $sql = "INSERT INTO Stickers (id_PB, id_USB, id_currentColumn, id_user, title, detail, kind) 
                                VALUES ('$id_PB', '$id_USB', '$id_currentColumn', '$id_user', '$title', '$detail', '$kind')";
                        $result = mysqli_query($connexion, $sql); // runs sql query
                        
                        /************* xAPI *************/

                        // create actor Object
                        $actor = getSet_actor($connexion, $id_user);
                        // create verb Object
                        $verb = new Verb($xAPI_id_create, $xAPI_detail_create);
                        // create object Object
                        $id_lastObject = getIdLastItem_fromTable_belongingToUser($connexion, $table, $id_user);
                        $object = new Sticker($id_lastObject, $id_PB, $id_USB, $id_currentColumn, $id_user, $title, $detail, $kind);                        
                        // create xAPI_Statement Object
                        $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                        post_xAPI_Statement($connexion, $xAPI_Statement);
                        
                    break;
    
                    case 'UserStoryBoards':
    
                        $id_PB = $_POST['id_PB'];
                        $id_user = $_POST['id_user'];
                        $title = mysqli_real_escape_string($connexion, $_POST['title']);
                        $color = $_POST['color'];
                        $sql = "INSERT INTO $table (id_PB, id_user, title, color) 
                                VALUES ('$id_PB', '$id_user', '$title', '$color')";
                        $result = mysqli_query($connexion, $sql); // runs sql query

                    break;
                }
            break;

            case 2: // AJOUT (POST) de plusieurs éléments à une table de la db (2 cas)

                $board = $_GET['board'];
                $columns = json_decode($_POST['columns']);
                $xAPI_columns = array();
                foreach ($columns as $jsonColumn) {
                    $obj = json_decode($jsonColumn);
                    $id_PB = $obj->{'id_PB'};
                    $id_USB = $obj->{'id_USB'};
                    $id_user = $obj->{'id_user'};
                    $title = mysqli_real_escape_string($connexion, $obj->{'title'});
                    $color = $obj->{'color'};
                    $columnTimescale = $obj->{'columnTimescale'};
                    $isInitial = $obj->{'isInitial'};
                    $isTerminal = $obj->{'isTerminal'};
                    $kind = $obj->{'kind'};
                    $sql = "INSERT INTO $table (id_PB, id_USB, id_user, title, color, columnTimescale, isInitial, isTerminal, kind) 
                            VALUES ('$id_PB', '$id_USB', '$id_user', '$title', '$color', '$columnTimescale', '$isInitial', '$isTerminal', '$kind')";
                    $result = mysqli_query($connexion, $sql); // runs sql query

                    /************* xAPI *************/
                    
                    // create object Object
                    $stickers = array();
                    $id_lastObject = getIdLastItem_fromTable_belongingToUser($connexion, 'Columns', $id_user);
                    $object = new Column($id_lastObject, $id_PB, $id_USB, $id_user, $title, $color, $columnTimescale, $isInitial, $isTerminal, $kind, $stickers);
                    $xAPI_columns[] = $object;
                }
                
                /************* xAPI *************/
                
                // create actor Object
                $actor = getSet_actor($connexion, $id_user);
                // create verb Object
                $verb = new Verb($xAPI_id_create, $xAPI_detail_create);
                // create object Object
                switch($board) {

                    case "PB":
                        
                        $id_lastObject = getIdLastItem_fromTable_belongingToUser($connexion, 'PlanningBoards', $id_user);
                        $object = new PlanningBoard($id_lastObject, $id_user, $title, $color, $xAPI_columns);

                    break;

                    case "USB":

                        $id_lastObject = getIdLastItem_fromTable_belongingToUser($connexion, 'PlanningBoards', $id_user);
                        $object = new UserStoryBoard($id_lastObject, $id_PB, $id_user, $title, $color, $columns);

                    break;

                }
                // create xAPI_Statement Object
                $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                post_xAPI_Statement($connexion, $xAPI_Statement); 

            break;

            case 3: // MODIFICATION (PUT) d'un élément d'une table de la db (3 cas)
                $id = $_GET['id'];
                $id_user = $_GET['id_user'];
                switch ($table) {
    
                    case 'PlanningBoards':

                        $title = mysqli_real_escape_string($connexion, $_POST['title']);
                        $color= $_POST['color'];
                        $columnTimescale = $_POST['columnTimescale'];
                        // modifs PlanningBoard
                        $sql1 = "UPDATE $table
                                SET $table.title = '$title'
                                WHERE $table.id = '$id'";
                        $sql2 = "UPDATE $table
                                SET $table.color = '$color'
                                WHERE $table.id = '$id'";
                        $sql3 = "UPDATE $table
                                SET $table.columnTimescale = '$columnTimescale'
                                WHERE $table.id = '$id'";
                        // modifs Columns    
                        $sql4 = "UPDATE Columns
                                SET Columns.columnTimescale = '$columnTimescale'
                                WHERE Columns.id_PB = '$id'
                                AND kind = 'Planning Board'";
                        $sql5 = "UPDATE Columns
                                SET Columns.color = '$color'
                                WHERE Columns.id_PB = '$id'
                                AND kind = 'Planning Board'";
                        $result1 = mysqli_query($connexion, $sql1); // runs sql query
                        $result2 = mysqli_query($connexion, $sql2); // runs sql query
                        $result3 = mysqli_query($connexion, $sql3); // runs sql query
                        $result4 = mysqli_query($connexion, $sql4); // runs sql query
                        $result5 = mysqli_query($connexion, $sql5); // runs sql query
                    
                    break;      
    
                    case 'Columns': // PB || USB (2 cas)
                        switch ($_GET['board']) { // Column provenant du board : PB || USB
    
                            case 'PB': // ex : "url = .../?table=Columns&id=idColumn&board=PB"
    
                                $title = mysqli_real_escape_string($connexion, $_POST['title']);
                                $columnTimescale = $_POST['columnTimescale'];
                                $detail = mysqli_real_escape_string($connexion, $_POST['detail']);
                                $sql1 = "UPDATE $table
                                        SET $table.title = '$title'
                                        WHERE $table.id = '$id'";
                                $sql2 = "UPDATE $table
                                        SET $table.columnTimescale = '$columnTimescale'
                                        WHERE $table.id = '$id'";
                                $sql3 = "UPDATE $table
                                        SET $table.detail = '$detail' 
                                        WHERE $table.id = '$id'";
                                $result = mysqli_query($connexion, $sql1); // runs sql query
                                $result = mysqli_query($connexion, $sql2); // runs sql query
                                $result = mysqli_query($connexion, $sql3); // runs sql query
    
                            break;
    
                            case 'USB': // ex : "url = .../?table=Columns&id=idColumn&board=USB"
    
                                $title = mysqli_real_escape_string($connexion, $_POST['title']);
                                $isInitial = $_POST['isInitial'];
                                $isTerminal = $_POST['isTerminal'];
                                $detail = mysqli_real_escape_string($connexion, $_POST['detail']);
                                $sql1 = "UPDATE $table
                                        SET $table.title = '$title'
                                        WHERE $table.id = '$id'";
                                $sql2 = "UPDATE $table
                                        SET $table.isInitial = '$isInitial'
                                        WHERE $table.id = '$id'";
                                $sql3 = "UPDATE $table
                                        SET $table.isTerminal = '$isTerminal'
                                        WHERE $table.id = '$id'";
                                $sql4 = "UPDATE $table
                                        SET $table.detail = '$detail'
                                        WHERE $table.id = '$id'";
                                $result = mysqli_query($connexion, $sql1); // runs sql query
                                $result = mysqli_query($connexion, $sql2); // runs sql query
                                $result = mysqli_query($connexion, $sql3); // runs sql query
                                $result = mysqli_query($connexion, $sql4); // runs sql query
    
                            break;
                        }
                    break;    
    
                    case 'Stickers': // PB || USB (2 cas)
                        $board = $_GET['board'];
                        switch($_GET['board']) { // Sticker provenant du board : PB || USB

                            case 'PB': // User Story Sticker
                                
                                $id_board = $_GET['id_board']; // id_USB
                                $id_currentColumn = $_POST['id_currentColumn'];
                                $title = mysqli_real_escape_string($connexion, $_POST['title']);
                                $detail = mysqli_real_escape_string($connexion, $_POST['detail']);
                                // modif USS
                                $sql1 = "UPDATE $table
                                        SET $table.id_currentColumn = '$id_currentColumn'
                                        WHERE $table.id = '$id'";
                                $sql2 = "UPDATE $table
                                        SET $table.title = '$title'
                                        WHERE $table.id = '$id'";
                                $sql3 = "UPDATE $table
                                        SET `detail` = '$detail'
                                        WHERE $table.id = '$id'";
                                // modif USB
                                $sql4 = "UPDATE UserStoryBoards
                                        SET UserStoryBoards.title = '$title'
                                        WHERE UserStoryBoards.id = '$id_board'";                                
                                $result = mysqli_query($connexion, $sql1); // runs sql query
                                $result = mysqli_query($connexion, $sql2); // runs sql query
                                $result = mysqli_query($connexion, $sql3); // runs sql query
                                $result = mysqli_query($connexion, $sql4); // runs sql query
                            
                            break;

                            case 'USB': // Task Sticker
                                
                                $id_currentColumn = $_POST['id_currentColumn'];
                                $title = mysqli_real_escape_string($connexion, $_POST['title']);
                                $detail = mysqli_real_escape_string($connexion, $_POST['detail']);
                                $sql1 = "UPDATE $table
                                        SET $table.id_currentColumn = '$id_currentColumn'
                                        WHERE $table.id = '$id'";
                                $sql2 = "UPDATE $table
                                        SET $table.title = '$title'
                                        WHERE $table.id = '$id'";
                                $sql3 = "UPDATE $table
                                        SET `detail` = '$detail'
                                        WHERE $table.id = '$id'";                            
                                $result = mysqli_query($connexion, $sql1); // runs sql query
                                $result = mysqli_query($connexion, $sql2); // runs sql query
                                $result = mysqli_query($connexion, $sql3); // runs sql query            
                            
                            break;                            
                        }    
                    break;
                }
            break;

            case 4: // RECUPERATION (GET) de l'utilisateur correspondant aux credentials entrés (1 cas)

                $signin_email = $_POST['signin_email'];
                $signin_password = $_POST['signin_password'];
                $sql = "SELECT id, firstname, lastname, email, quality FROM $table 
                        WHERE email = '$signin_email'
                        AND pass = '$signin_password'";

                $query = mysqli_query($connexion, $sql); // runs sql query
                $user = array(); //create an array
                while ($row = mysqli_fetch_assoc($query)) {
                    $user[] = $row;
                }   
                
                if (!empty($user)) {

                    $sql1 = "SELECT picture FROM $table 
                            WHERE email = '$signin_email'
                            AND pass = '$signin_password'";
                    $query1 = mysqli_query($connexion, $sql1); // runs sql query
                    $pic = array(); //create an array
                    while ($row = mysqli_fetch_assoc($query1)) {
                        $pic[] = base64_encode($row['picture']);
                    }
                    
                    if (empty($pic[0])) { // s'il n'y a pas d'image utilisateur encoder l'image par défaut
                        $data = file_get_contents('/var/www/html/default.png');
                        $user[0]['picture'] = base64_encode($data);                    
                    } else {
                        $user[0]['picture'] = $pic[0];
                    }
                }

                /************* xAPI *************/

                // create actor Object
                $actor = getSet_actor($connexion, $user[0]['id']);
                // create verb Object
                $verb = new Verb($xAPI_id_login, $xAPI_detail_login);
                // create object Object
                $object = $actor;
                // create xAPI_Statement Object
                $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                post_xAPI_Statement($connexion, $xAPI_Statement);

                echo json_encode($user);

            break;

            case 5: // MODIFICATION (PUT) de l'emplacement d'un item (1 cas)

                $id = $_GET['id'];
                $id_currentColumn = $_POST['id_currentColumn'];
                $id_user = $_GET['id_user'];
                $sql = "UPDATE `Stickers` 
                        SET `id_currentColumn` = '$id_currentColumn' 
                        WHERE `Stickers`.`id` = '$id'";
                $result = mysqli_query($connexion, $sql); // runs sql query

                /************* xAPI *************/

                // create actor Object
                $actor = getSet_actor($connexion, $id_user);
                // create verb Object
                $verb = new Verb($xAPI_id_move, $xAPI_detail_move);
                // create object Object
                $sql1 = "SELECT id, id_PB, id_USB, id_currentColumn, id_user, title, detail, kind FROM `Stickers`  
                        WHERE id = '$id'";
                $query = mysqli_query($connexion, $sql1); // runs sql query
                $sticker = array();
                while ($row = mysqli_fetch_assoc($query)) {
                    $sticker[] = $row['id'];
                    $sticker[] = $row['id_PB'];
                    $sticker[] = $row['id_USB'];
                    $sticker[] = $row['id_currentColumn'];
                    $sticker[] = $row['id_user'];
                    $sticker[] = $row['title'];
                    $sticker[] = $row['detail'];
                    $sticker[] = $row['kind'];
                }
                $object = new Sticker(
                    $sticker[0],
                    $sticker[1],
                    $sticker[2],
                    $sticker[3],
                    $sticker[4],
                    $sticker[5],
                    $sticker[6],
                    $sticker[7]
                );
                // create xAPI_Statement Object
                $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                post_xAPI_Statement($connexion, $xAPI_Statement);

            break;
        }
    break;

    case 'DELETE': // SUPPRESSION (DEL) d'un élément d'une table de la db (3 cas)
        $id = $_GET['id'];
        $id_user = $_GET['id_user'];
        switch ($table) {

            case 'PlanningBoards':

                // traces xAPI à faire aprè avoir réussi les Stickers

                $sql = "DELETE FROM $table 
                        WHERE $table.id = '$id'"; // suppr PB
                $sql1 = "DELETE FROM Columns
                        WHERE Columns.id_PB = '$id'"; // suppr PB Columns
                $sql2 = "DELETE FROM Stickers
                        WHERE Stickers.id_PB = '$id'"; // suppr all PB Stickers
                $sql3 = "DELETE FROM UserStoryBoards
                        WHERE UserStoryBoards.id_PB = '$id'"; // suppr USBs
                $result = mysqli_query($connexion, $sql); // runs sql query
                $result = mysqli_query($connexion, $sql1); // runs sql query
                $result = mysqli_query($connexion, $sql2); // runs sql query
                $result = mysqli_query($connexion, $sql3); // runs sql query
            
            break; 

            case 'Columns':
                
                /************* xAPI *************/

                // // create actor Object
                // $actor = getSet_actor($connexion, $id_user);
                // // create verb Object
                // $verb = new Verb($xAPI_id_delete, $xAPI_detail_delete);
                // // create object Object
                // $sql1 = "SELECT * FROM $table 
                //         -- WHERE id_currentColumn = '$id'
                //         ";
                // // $stickers = get_stuff($connexion, $sql1);
                // // $object = new Column($id, $id_PB, $id_USB, $id_user, $title, $color, $columnTimescale, $isInitial, $isTerminal, $kind, $stickers);                        
                // // // create xAPI_Statement Object
                // // $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                // post_xAPI_Statement($connexion, $stickers);

                $sql = "DELETE FROM $table 
                        WHERE $table.id = '$id'";
                $sql1 = "DELETE FROM Stickers
                        WHERE Stickers.id_currentColumn = '$id'";
                $result = mysqli_query($connexion, $sql); // runs sql query
                $result = mysqli_query($connexion, $sql1); // runs sql query
            
            break;

            case 'Stickers':
                $board = $_GET['board'];
                switch($board) {

                    case 'USB':

                        /************* xAPI *************/

                        // // create actor Object
                        // $actor = getSet_actor($connexion, $id_user);
                        // // create verb Object
                        // $verb = new Verb($xAPI_id_create, $xAPI_detail_create);
                        // // create object Object
                        // $sql_xAPI = "SELECT * FROM Stickers
                        //             WHERE Stickers.id = '$id'";
                        // $stuff = get_stuffBis($connexion, $sql_xAPI);
                        // $id_PB = $stuff->{'id_PB'};
                        // $id_USB = $stuff->{'id_USB'};
                        // $id_currentColumn = $stuff->{'id_currentColumn'};
                        // $id_user = $stuff->{'id_user'};
                        // $title = mysqli_real_escape_string($connexion, $stuff->{'title'});
                        // $detail = $stuff->{'detail'};
                        // $kind = $stuff->{'kind'};
                        // $object = new Sticker($id, $id_PB, $id_USB, $id_currentColumn, $id_user, $title, $detail, $kind);                        
                        // // create xAPI_Statement Object
                        // $xAPI_Statement = new xAPI_Statement($actor, $verb, $object);
                        // post_xAPI_Statement($connexion, $xAPI_Statement);

                        $sql = "DELETE FROM $table 
                                WHERE $table.id = '$id'";
                        $result = mysqli_query($connexion, $sql); // runs sql query

                    break;

                    case 'PB':

                        // traces xAPI à faire aprè avoir réussi User Task Sticker

                        $id_USB = $_GET['id_USB'];
                        $sql = "DELETE FROM $table 
                                WHERE $table.id = '$id'"; // suppr US Sticker                        
                        $sql1 = "DELETE FROM UserStoryBoards
                                WHERE UserStoryBoards.id = '$id_USB'"; // suppr USB
                        $sql2 = "DELETE FROM Columns 
                                WHERE Columns.id_USB = '$id_USB'"; // suppr Columns USB
                        $sql3 = "DELETE FROM $table 
                                WHERE $table.id_USB = '$id_USB'"; // suppr Stickers USB
                        $result = mysqli_query($connexion, $sql); // runs sql query
                        $result = mysqli_query($connexion, $sql1); // runs sql query
                        $result = mysqli_query($connexion, $sql2); // runs sql query
                        $result = mysqli_query($connexion, $sql3); // runs sql query
                    
                    break;

                }            
            break;
        }    
    break;          
}

$connexion -> close();

?>