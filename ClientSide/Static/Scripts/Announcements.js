
//making a put request with axios

function Post() {
    axios.post("/announce").then(response => {
        alert(response.data);
    }).catch(err => {
        console.log(err);
    })
}
