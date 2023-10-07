// close overly
function closeIt(id) {
    document.getElementById(id).hidden = true;
  }
  
  //open overlay
  function openIt(id) {
    document.getElementById(id).hidden = false;
  }
  
  
  
//function to handle the feedback form submission
const form = document.getElementById('feedbackForm'); 
form.addEventListener('submit', (e) => {

  e.preventDefault(); //preventing form refresh

  const formData = new FormData(form);
 // Iterate over the FormData and log its key-value pairs
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  openIt('loadOverlay') //revealing the loadOverlay
  
  axios.post("/postFeedback", formData,{headers: {'Content-Type': 'multipart/form-data',},}).then((response) => {

    closeIt('loadOverlay') //removing the loadOverlay
    alert(response.data);
    window.location.reload();
  })
    .catch((err) => {
      console.log(err);
    });

});
