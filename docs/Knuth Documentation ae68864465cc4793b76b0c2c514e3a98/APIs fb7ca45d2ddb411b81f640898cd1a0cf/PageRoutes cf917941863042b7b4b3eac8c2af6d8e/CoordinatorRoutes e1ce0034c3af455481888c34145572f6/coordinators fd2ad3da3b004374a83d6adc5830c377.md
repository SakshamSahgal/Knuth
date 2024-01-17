# coordinators

This API endpoint retrieves a list of coordinators and renders the corresponding page.

## Endpoint

- `/coordinators`

## HTTP Method

- GET

## Middlewares Used

- `isLoggedIn`: Ensures the user is authenticated.
- `updateLastActivity`: Updates the user's last activity.

## Request Parameters

- None

## Request Headers

- `Authorization`: Bearer token for user authentication (Obtained after successfull login from Google OAuth).

## Request Body

- None

## Success Response

### Status Code

- 200 OK
    
    ### Response Body
    
- Renders the "coordinators" page with the following data passed to ejs:
    - `page`: "coordinators"
        - This parameter is passed to the page so that it can be used to tell the navbar which tab to highlight.
        - in this case it is coordinators.
    - `emailTo`: Email address of the authenticated user, (the user which is requesting the page)
    - `coordinators`: List of coordinator objects obtained from a empty DB querry to Coordinators Collection.
        
        ### Example
        
        ```json
        {
            "page": "coordinators",
            "emailTo": "user@example.com",
            "coordinators": [
                {
                    "_id": {
                        "$oid": "64ee2b1f91d3f447688c9454"
                    },
                    "year": "2023-2024",
                    "list": [
                        {
                            "name": "Sparsh Kumar",
                            "linkedIn": "https://www.linkedin.com/in/sparsh-kumar-b0a21722a/",
                            "gmail": "sparshrajput92@gmail.com"
                        },
                        {
                            "name": "Manya Jindal",
                            "linkedIn": "https://www.linkedin.com/in/manya-jindal-555201245/",
                            "gmail": ""
                        },
                        {
                            "name": "Siddhartha Katiyar",
                            "linkedIn": "https://www.linkedin.com/in/siddharthakatiyar/",
                            "gmail": ""
                        },
                        {
                            "name": "Arnav Teotia",
                            "linkedIn": "https://www.linkedin.com/in/arnav-teotia-641383166/",
                            "gmail": ""
                        },
                        {
                            "name": "Varun Singhal",
                            "linkedIn": "https://www.linkedin.com/in/varun-singhal-0b6171243/",
                            "gmail": ""
                        },
                        {
                            "name": "Princi Agrawal",
                            "linkedIn": "https://www.linkedin.com/in/princi-agrawal-025220230/",
                            "gmail": ""
                        },
                        {
                            "name": "Paakhi Maheshwari",
                            "linkedIn": "https://www.linkedin.com/in/paakhim10/",
                            "gmail": ""
                        },
                        {
                            "name": "Himral Garg",
                            "linkedIn": "https://www.linkedin.com/in/himral-garg-a2b30621a/",
                            "gmail": ""
                        },
                        {
                            "name": "Himanshu Dixit",
                            "linkedIn": "https://www.linkedin.com/in/himanshu-dixit-009hd/",
                            "gmail": ""
                        },
                        {
                            "name": "Harsh Sharma",
                            "linkedIn": "",
                            "gmail": ""
                        }
                    ]
                },
                {
                    "_id": {
                        "$oid": "64ee2bb991d3f447688c9455"
                    },
                    "year": "2022-2023",
                    "list": [
                        {
                            "name": "Saksham Sahgal",
                            "linkedIn": "https://www.linkedin.com/in/saksham-sahgal-aaa23b164/",
                            "gmail": "sakshamsahgal5@gmail.com"
                        },
                        {
                            "name": "Ananya Chopra",
                            "linkedIn": "https://www.linkedin.com/in/ananya1404/",
                            "gmail": ""
                        },
                        {
                            "name": "Harshit Dudani",
                            "linkedIn": "https://www.linkedin.com/in/harshit-dudani-852a61220/",
                            "gmail": ""
                        },
                        {
                            "name": "Naman Kumar",
                            "linkedIn": "https://www.linkedin.com/in/naman-kumar-83abb2187/",
                            "gmail": ""
                        },
                        {
                            "name": "Nishant Taliwal",
                            "linkedIn": "https://www.linkedin.com/in/nishanttaliwal/",
                            "gmail": ""
                        },
                        {
                            "name": "Pragya Singhal",
                            "linkedIn": "https://www.linkedin.com/in/pragyasinghal18/",
                            "gmail": ""
                        },
                        {
                            "name": "Tanmay Kumar",
                            "linkedIn": "https://www.linkedin.com/in/t4nm4y/",
                            "gmail": ""
                        },
                        {
                            "name": "Tushar Yadav",
                            "linkedIn": "https://www.linkedin.com/in/tushar-yadav-9b7638202/",
                            "gmail": ""
                        },
                        {
                            "name": "Vivek Arora",
                            "linkedIn": "https://www.linkedin.com/in/vivekarora02/",
                            "gmail": "vivek.arora2024@gmail.com"
                        },
                        {
                            "name": "Manika Agarwal",
                            "linkedIn": "https://www.linkedin.com/in/manika-agarwal-139612202/",
                            "gmail": ""
                        }
                    ]
                },
                {
                    "_id": {
                        "$oid": "64ee2d0d91d3f447688c9456"
                    },
                    "year": "2021-2022",
                    "list": [
                        {
                            "name": "Piyush Mittal",
                            "linkedIn": "https://www.linkedin.com/in/piyush-mittal-3a9b8318b/",
                            "gmail": ""
                        },
                        {
                            "name": "Rachit Pratap Singh",
                            "linkedIn": "https://www.linkedin.com/in/rachit-pratap-singh-74a4481b6/",
                            "gmail": ""
                        },
                        {
                            "name": "Srejan Kumar Bera",
                            "linkedIn": "https://www.linkedin.com/in/srejan-kumar-bera-2842b41b0/",
                            "gmail": ""
                        },
                        {
                            "name": "Ansh Gupta",
                            "linkedIn": "https://www.linkedin.com/in/anshg52/",
                            "gmail": ""
                        },
                        {
                            "name": "Dhiren Chugh",
                            "linkedIn": "https://www.linkedin.com/in/dhiren-chugh-65558417b/",
                            "gmail": ""
                        },
                        {
                            "name": "Divyansh Gupta",
                            "linkedIn": "https://www.linkedin.com/in/divyansh2199/",
                            "gmail": ""
                        },
                        {
                            "name": "Abhinay Singh",
                            "linkedIn": "https://www.linkedin.com/in/abhinay-singh-313149176/",
                            "gmail": ""
                        },
                        {
                            "name": "Deepanshu Choudhary",
                            "linkedIn": "https://www.linkedin.com/in/deepanshu-choudhary-9947121b0/",
                            "gmail": ""
                        },
                        {
                            "name": "Shivansh Gupta",
                            "linkedIn": "https://www.linkedin.com/in/shivansh340/",
                            "gmail": ""
                        },
                        {
                            "name": "Ishita bansal",
                            "linkedIn": "https://www.linkedin.com/in/ishitabansal29/",
                            "gmail": ""
                        },
                        {
                            "name": "Harshita Goyal",
                            "linkedIn": "https://www.linkedin.com/in/harshita-goyal-87b0741b6/",
                            "gmail": ""
                        },
                        {
                            "name": "Girdhar Agarwal",
                            "linkedIn": "https://www.linkedin.com/in/girdhar-agarwal-603239196/",
                            "gmail": ""
                        },
                        {
                            "name": "Bhumi Agarwal",
                            "linkedIn": "https://www.linkedin.com/in/bhumi-agarwal/",
                            "gmail": ""
                        },
                        {
                            "name": "Amar Shukla",
                            "linkedIn": "https://www.linkedin.com/in/amarshukla007/",
                            "gmail": ""
                        }
                    ]
                }
            ]
        }
        ```