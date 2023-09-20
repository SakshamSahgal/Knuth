
//making a put request with axios

function Post() {
    axios.post("/announce").then(response => {
        alert(response.data);
    }).catch(err => {
        console.log(err);
    })
}

function closeIt(id) {
    document.getElementById(id).hidden = true;
  }

function openIt(id) {
    document.getElementById(id).hidden = false;
  }