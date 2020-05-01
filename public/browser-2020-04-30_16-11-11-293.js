function itemTemplate(item){
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
    `
}
let createField = document.getElementById("create-field")
//Create feature
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault()

    if (createField.value){ //if value exists
        axios.post(
            '/create-item',         //url where pointing
            {                       //data object
                text: createField.value,
            }       
            )      
            .then(function(response){
            document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
            })
            .catch(function(){
                console.log("Please try again later")
            })
    }
})


document.addEventListener('click', function(e){
    //update Feature
    if (e.target.classList.contains("edit-me")){
        let userInput = prompt("Enter you desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput){ //if not cancel
            axios.post(
                '/update-item',         //url where pointing
                {                       //data object
                    text: userInput,
                    id: e.target.getAttribute("data-id")
                }       
                )      
                .then(function(){
        
                    e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput  
                })
                .catch(function(){
                    console.log("Please try again later")
                })
        }
    }
    //Delete Feature
    if (e.target.classList.contains("delete-me")){
        if (confirm("Do you really want to delete this item permanetly")){
            axios.post(
                '/delete-item',         //url where pointing
                {                       //data object
                    id: e.target.getAttribute("data-id")
                }       
                )      
                .then(function(){
                    e.target.parentElement.parentElement.remove() 
                })
                .catch(function(){
                    console.log("Please try again later")
                })

        }
    }


})
