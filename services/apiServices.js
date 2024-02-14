
/*
* You can write all api call here
* so, no need to rewrite in every page, like list nft require on multiple pages
*/
export class ApiServices {

    API_URL = "http://54.197.13.195:9000"
    LISTNFTS = `${this.API_URL}/api/list_nfts?`
    LISTCOLL = `${this.API_URL}/api/all_collections?`

    //function to call nft list
    // You can modify condition as per your need
    callNfts = async (param, queryString) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(param);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(this.LISTNFTS + queryString, requestOptions);
    }

    //function to call nft list
    // You can modify condition as per your need
    callCollections = async (param, queryString) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(param);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(this.LISTCOLL + queryString, requestOptions);
    }

}