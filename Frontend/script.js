const createClubAPI = 'http://localhost:4000/api/v1/createClub'
const showClubAPI = 'http://localhost:4000/api/v1/showClub'
const deleteClubAPI = 'http://localhost:4000/api/v1/deleteClub'
const updateClubAPI = 'http://localhost:4000/api/v1/updateClub'

const wrapper = document.querySelector('#wrapper')


//create club.................
const createClubHandler = async (event)=>{
    try{
        event.preventDefault();

        const formdata = new FormData(event.target)

        const response = await fetch(createClubAPI,{
            method:'POST',
            body:formdata
        })

        const data = await response.json()

        console.log(data)
        window.location.href='index.html'

      
    }catch(err){
        console.log(err)
    }
}


const showClub = async( )=>{
    try{
        const response = await fetch(showClubAPI)
        const data = await response.json()
        console.log(data.response)
        createClubCard(data.response)
    }catch(err){
        console.log(err)
    }
}

showClub()



function createClubCard(data){
    try{
      data.forEach(element => {
        


        //creating tags................
        const club = document.createElement('div')
        const img = document.createElement('img')
        const title = document.createElement('h2')
        const venue = document.createElement('h4')
        const EditButton = document.createElement('button')
        const deleteButton = document.createElement('button')
        const parentBtn = document.createElement('div')

        // adding class............
        club.classList.add('club')
        title.classList.add('title')
        venue.classList.add('venue')
        parentBtn.classList.add('btn')

        //adding data............
        img.src = element.image
        title.textContent = element.title
        venue.textContent = element.venue
        EditButton.textContent = 'Edit'
        deleteButton.textContent = 'Delete'
        img.setAttribute('width','300px')


        //tag appending..............

        club.appendChild(img)
        parentBtn.appendChild(EditButton)
        parentBtn.appendChild(deleteButton)
        club.appendChild(title)
        club.appendChild(venue)
        club.appendChild(parentBtn)


        console.log(club)
        wrapper.appendChild(club)

      });
        
        



    }catch(err){
console.log(err)
    }
}

