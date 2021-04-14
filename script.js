var redirect_uri="https://srinath2204.github.io/spotify/";
var client_id="";
var client_secret="";

const Authorize="https://accounts.spotify.com/authorize"
const TOKEN="https://accounts.spotify.com/api/token";
const DEVICES="https://api.spotify.com/v1/me/player/devices";

function onPageLoad(){
    if(window.location.search.length > 0){
        handleRedirect();
    }
}

function handleRedirect() {
    let code=getCode();
    fetchAccessToken(code);
    window.history.pushState("","",redirect_uri);
}

function fetchAccessToken(code){
    let body="grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "?client_id=" + client_id;
    body += "?client_secret=" + client_secret;
    callAuthorizationapi(body);
}

function callAuthorizationapi(body){
    let xhr=new XMLHttpRequest();
    xhr.open("POST",TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic' + btoa(client_id +":" + client_secret));
    xhr.send(body);
    xhr.onload=handleAuthorizationResponse;
}

function refreshAccessToken(){
    refresh_token=localStorage.getItem("refresh_token");
    let body="grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "?client_id=" + client_id;
    callAuthorizationapi(body);
}

function handleAuthorizationResponse(){
    if(this.status == 200){
        var data=JSON.parse(this.responseText);
        console.log(data);
        var data=JSON.parse(this.responseText);
        if(data.access_token !=undefined){
            access_token=data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if(data.refresh_token != undefined){
            refresh_token=data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else{
        console.log(this.responseText)
        alert(this.responseText)
    }
}

function getcode(){
    let code=null;
    const queryString=window.location.search;
    if(queryString.length>0){
        const urlParams=new URLSearchParams(queryString);
        code=urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
client_id=document.getElementById("clientId").value;
client_secret=document.getElementById("clientSecret").value;
localStorage.setItem("client_id", client_id);
localStorage.setItem("client_secret", client_secret)

let url=Authorize;
url += "?client_id=" + client_id;
url += "&response_type=code";
url += "&redirect_uri=" + encodeURI(redirect_uri);
window.location.href=url;
}

function refreshDevices(){
    callApi("GET", DEVICES, null, handleDevicesResponse);
}

function handleDevicesResponse(){
    if(this.status == 200){
        var data=JSON.parse(this.responseText);
        console.log(data);
        removeallItems("devices");
        data.devices.forEach(item=>addDevice(item));
    }
    else if(this.status=401){
        refreshAccessToken()
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item){
    let node=document.createElement("option");
    node.value=item.id;
    node.innerHTML=item.name;
    document.getElementById("devices").appendChild(node);
}

function callApi(method, url, body, callback){
    let xhr=new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer' + access_token);
    xhr.send(body);
    xhr.onload=callback; 
}

function removeallItems(){
    let node=document.getElementById("");
    while(node.firstChild){
        node.removeChild(node.firstChild)
    }
}