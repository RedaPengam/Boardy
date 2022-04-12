import axios from 'axios';

const urlDB = 'http://127.0.0.1/requests.php/';
const urlPlanningBoards = urlDB + '?table=PlanningBoards';
const urlUserStoryBoards = urlDB + '?table=UserStoryBoards';
const urlColumns = urlDB + '?table=Columns';
const urlStickers = urlDB + '?table=Stickers';
const urlUsers = urlDB + '?table=Users';

async function fetchTable(urlTable, setTable) {
    await axios({
        method: "get",
        url: urlTable,
        crossDomain: true,
    })
    .then(response => {
        // console.log("\nfetch TABLE from :", urlTable, "\n\nphp response :", response.data);
        setTable(response.data);
    })
    .catch(error => {console.log("erreur lors de la requête GET Table : ", error)});
};

async function fetchItem(urlItem, setItem) {
    await axios({
        method: "get",
        url: urlItem,
        crossDomain: true
    })
    .then(response => {
        // console.log("\nfetch ITEM from :", urlItem, "\n\nphp response :", response.data[0]);
        setItem(response.data[0]);
    })
    .catch(error => {console.log("erreur lors de la requête GET Item : ", error)});
};

async function fetchCount(url, setCount) {
    // console.log(url);
    await axios.get(url)
    .then(res => {
        setCount(res.data[0]['count(*)']);
    })
    .catch(error => {console.log("erreur lors de la requête GET count : ", error)});
};

async function deleteItem(urlItem, urlTableToUpdate, fetchTable, setTableToUpdate) {
    await axios.delete(urlItem)
    .then(() => {
        // console.log("\nDeleted ITEM from TABLE :", urlItem);
        fetchTable(urlTableToUpdate, setTableToUpdate); // to reload data
    })
    .catch(error => {console.log("erreur lors de la requête DELETE: ", error)}); 
};

async function postMultipleItems(urlTable, formItems) {
    await axios.post(urlTable, formItems)
    // .then(console.log("multiple items posted to", urlTable))
    .catch(error => {console.log("erreur lors de la requête POST multiple : ", error)});
};

async function checkCredentials(url, signinForm, setError, setSuccess, setIsAuth, setUser) {
    await axios.post(url, signinForm)
    .then(response => {
        if (response.data.length === 0) {
            setIsAuth(false);
            setError("No user with such credentials found");
            setSuccess("");
        } else {
            console.log(response.data);
            setIsAuth(true);
            setUser(response.data[0]);
            setError("");
            setSuccess("Successfully logged in!");
        }
    })
    .catch(error => {console.log("erreur lors de la requête POST User credentials : ", error)});
};

async function getLastItemId(urlLastItem, cacheLastItemId, setCacheLastItemId) {
    var repeat = true;
    var count = 0;
    while (repeat) {
        try {
            const result = await axios.get(urlLastItem);
            if ((result.data[0].id == cacheLastItemId || result.data[0].id == 0) && (count <= 5)) {
                repeat = true;
                count += 1;
                console.log("getLastItemId idem cache essai : ", count);
            } else {
                setCacheLastItemId(result.data[0].id);
                repeat = false;
            }
        } catch (error) {
            if (count <= 5) {
                repeat = true;
                count += 1;
                console.log("getLastItemId raté essai : ", count, error);
            } else {
                repeat = false;
            }
        }
    }
};

async function getLastItemIdThenPost(urlLastItem, cacheLastItemId, setCacheLastItemId, postFunction) {
    var repeat = true;
    var count = 1;
    while (repeat) {
        try {
            const result = await axios.get(urlLastItem);
            if ((result.data[0].id == cacheLastItemId || result.data[0].id < 1) && (count <= 10)) {
                repeat = true;
                count += 1;
                console.log("getLastItemIdThenPost id idem cache essai : ", count);
            } else {
                postFunction(result.data[0].id);
                setCacheLastItemId(result.data[0].id);
                repeat = false;
            }
        } catch (error) {
            if (count <= 10) {
                repeat = true;
                count += 1;
                console.log("getLastItemIdThenPost id non récupéré essai : ", count, error);
            } else {
                repeat = false;
            }
        }
    }
};

export { 
    fetchTable, fetchItem, deleteItem, postMultipleItems, checkCredentials, getLastItemId, getLastItemIdThenPost, fetchCount,
    urlPlanningBoards, urlUserStoryBoards, urlColumns, urlStickers, urlUsers
};