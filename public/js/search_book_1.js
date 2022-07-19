
console.log("i am connected to rent");
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3030/rent')
        .then(response => response.json())
        .then(data => createMountainCards(data['data']));
});
// const nameForm = document.querySelector('.search-box')
function createMountainCards(data)
{
    console.log(data);
}
// let filteredMountains = []
// nameForm.addEventListener('input', event => {
//     event.preventDefault()
//     const term = event.target.value.toLowerCase()
//     let searchResult = filteredMountains.filter(filteredMountain => {
//     return filteredMountain.name.toLowerCase().includes(term)
    
//     })
//   createMountainCards(searchResult)
//   })