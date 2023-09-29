

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
  closeIt('overlay') //closing the overlay

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

    alert(response.data);
    closeIt('loadOverlay') //removing the loadOverlay
    window.location.reload();
  
  }).catch((err) => {
    console.log(err);
  })

}

  // Get the checkbox element by its id
  var subscribeToggle = document.getElementById("subscribeToggle");

  // Add an event listener for the 'change' event on the checkbox
  subscribeToggle.addEventListener("change", function() {
    // Check if the checkbox is checked
      
    if (subscribeToggle.checked) {

      openIt('loadOverlay') //revealing the loadOverlay
      // Checkbox is checked, perform some action here
      //  alert("Subscription is enabled!");

      axios.post("/SubscribeAnnouncement").then((response) => {
        alert(response.data);
        closeIt('loadOverlay') //removing the loadOverlay
      }).catch((err) => {
        console.log(err);
      })

    } else {
      // Checkbox is unchecked, perform some action here
      // alert("Subscription is disabled.");
      openIt('loadOverlay') //revealing the loadOverlay

      axios.delete("/UnsubscribeAnnouncement").then((response) => {
        alert(response.data);
        closeIt('loadOverlay') //removing the loadOverlay
      }).catch((err) => {
        console.log(err);
      })

    }
  });