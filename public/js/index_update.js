console.log("hello connected");
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3030/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

var data1;
var validUser = false;
var validRoll = false;
submit = document.getElementById("submit");
function loadHTMLTable(data) {
    // const table = document.querySelector('table tbody');
    if (data.length === 0) {
        console.log("Record is empty");
    }
    else {
        data1 = data;

    }
}

const rn = document.getElementById("rn");
// const un = document.getElementById("un");
const fn = document.getElementById("fn");
const pn = document.getElementById("pn");
const ps1 = document.getElementById("ps1");
const ps2 = document.getElementById("ps2");


ps2.addEventListener('blur', () => {
    if (ps1.value != ps2.value) {
        ps2.classList.add('is-invalid');
        submit.classList.add('disabled');
    }
    else {
        ps2.classList.remove('is-invalid');
        submit.classList.remove('disabled');

    }

})

const searchUser = async searchText => {
    let flag = 0;
    data1.forEach(obj => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        let check = obj.username;
        if (check == searchText) {
            un.classList.add('is-invalid');
            submit.classList.add('disabled');
            console.log("it matched");
            flag = 1;

        }
        else if (check != searchText && flag != 1) {
            un.classList.remove('is-invalid');
            submit.classList.remove('disabled');
            console.log("it not matched");
        }
    });
    console.log('-------------------');
};

const searchRollNo = async searchText => {
    let flag = 0;
    data1.forEach(obj => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        let check = obj.roll_no;
        if (check == searchText) {
            rn.classList.add('is-invalid');
            submit.classList.add('disabled');
            console.log("it matched");
            flag = 1;
        }
        else if (check != searchText && flag != 1) {
            rn.classList.remove('is-invalid');
            submit.classList.remove('disabled');
            console.log("it not matched");
        }

    });
    console.log('-------------------');
};

pn.addEventListener('blur', () => {
    console.log("phone is blurred");
    // Validate phone here
    let regex = /^([0-9]){10}$/;
    let str = pn.value;
    console.log(regex, str);
    if (regex.test(str)) {
        console.log('Your phone is valid');
        pn.classList.remove('is-invalid');
        submit.classList.remove('disabled');
    }
    else {
        console.log('Your phone is not valid');
        pn.classList.add('is-invalid');
        submit.classList.add('disabled');
    }
})


rn.addEventListener('input', () => searchRollNo(rn.value)); //putting arrow 
