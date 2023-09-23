
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

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('myForm'); // Select form by its id
    const formData = new FormData(form);

    axios.post('/PostAnnouncements', formData)
      .then(response => {
        console.log('Response:', response.data);
        // Handle success here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors here
      });
  }


  // Add event listener to the form
  const form = document.getElementById('myForm'); // Select form by its id
  form.addEventListener('submit', (e) => {

    e.preventDefault(); //preventing form refresh
    
    const formData = new FormData(form);
    
    axios.post("/PostAnnouncements", formData).then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
      
  });