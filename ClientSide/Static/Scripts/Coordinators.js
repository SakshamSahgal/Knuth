

function fetchCoordinators() //function to fetch coordinators list from the database
{
    axios.get('/coordinatorsList').then((response) => {
        console.log(response.data);
        DisplayCoordinatorsList(response.data)
    }).catch((err) => {
        console.log(err);
    })
}

fetchCoordinators();

function DisplayCoordinatorsList(coordinators){
    for(var i=0;i<coordinators.length;i++){ //iterating over all years

        // console.log(coordinators[i].year)
        
        //nav tabs for years
        yearTab = `<li class="nav-item">
                    <a href="#id_${i}" class="nav-link ${(i==0)? "active" : "" }" data-bs-toggle="tab"> ${coordinators[i].year}  </a>
                   </li>`
        
        //appending the Nav Tabs to HTML DOM
        document.getElementById("YearTabs").innerHTML += yearTab;
        
        //tab content for each year
        yearTabContent = `<div class="tab-pane ${(i == 0) ? "show active" : ""} fade" id="id_${i}">         
                            <div class="container mt-5">
                                <ul class="list-group" id="${coordinators[i].year}">                         
                                </ul>
                            </div>        
                          </div>`
        //Appending the tab content for each year to HTML DOM
        document.getElementById("YearTabContents").innerHTML += yearTabContent;

        //iterating over all coordinators in a this year
        for(var j=0;j<coordinators[i].list.length;j++) 
        {
            //list element for each coordinator
            thisCoordinator = `<li class="list-group-item d-flex align-items-center my-3 rounded border border-dark">
                                <div class="flex-grow-1">
                                    <h5>${coordinators[i].list[j].name}</h5>
                                </div>
                                <div>
                                    <a href="${coordinators[i].list[j].linkedIn}" class="me-2" target="_blank"><i class="fab fa-linkedin"></i></a>
                                </div>
                            </li>`
            //appending the list element to HTML DOM with id=year
            document.getElementById(coordinators[i].year).innerHTML += thisCoordinator;
        }        
    }
}

