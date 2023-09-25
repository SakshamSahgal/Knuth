

// close overly
function closeIt(id) {
  document.getElementById(id).hidden = true;
}

//open overlay
function openIt(id) {
  document.getElementById(id).hidden = false;
}


//function to handle the form submission
const form = document.getElementById('myForm'); 
form.addEventListener('submit', (e) => {

  e.preventDefault(); //preventing form refresh

  const formData = new FormData(form);

  openIt('loadOverlay') //revealing the loadOverlay

  axios.post("/PostAnnouncements", formData).then((response) => {

    closeIt('loadOverlay') //removing the loadOverlay
    alert(response.data);
    closeIt('overlay')
    window.location.reload();
  })
    .catch((err) => {
      console.log(err);
    });

});

//function to delete the announcement
function deleteCard(id) {
  
  openIt('loadOverlay') //revealing the loadOverlay

  axios.delete(`/DeleteAnnouncement/${id}`).then((response) => {

    closeIt('loadOverlay') //removing the loadOverlay
    alert(response.data);
    window.location.reload();
  
  }).catch((err) => {
    console.log(err);
  })

}
