//stringify everything that you're passing through that's a number

const faker = require('faker')
const axios = require('axios')
const mysql = require('mysql')
const async = require('async')
// const formidable = require("formidable")
// const http = require("http")

// let token = '*OMITTED*'

let count = 30 //user_id

function getConnection() {
    return mysql.createConnection({
    host: '*OMITTED*'
    user: '*OMITTED*',
    password: '*OMITTED*',
    database: '*OMITTED*',
    port: 3306
    })
}

//returns users gender
function userGender(user_id){
    if (user_id%2===0){
        return '0'
    }
    else{
        return '1'
    }
}

function randomAddress() {
    var address_data = {};
    if (count%2==0) {
        address_data = {
            city: "New York",
            state: "NY",
            address: "261 Broadway",
            zip_code: "10007",
            country: "USA",
            latitude: 40.713967,
            longitude: -74.006797
        }
    } else {
        address_data = {
            city: "Great Neck",
            state: "NY",
            address: "700 Middle Rd",
            zip_code: "11023",
            country: "USA",
            latitude: 40.805774,
            longitude: -73.735415
        }
    }
    return address_data;
}

function random_ethnicity(){
    let index = Math.round(Math.random() * 10);
    let ethnicities = []
    for (let i = 0; i < index; i++){ //loop to add multiple ethnicities
        let ethnicity = Math.round(Math.random() * 34) + 1
        if(ethnicities.indexOf(ethnicity) === -1){ //stops same id from being inserted multiple times
            ethnicities.push(ethnicity)
    }
    return ethnicities
    }
}

function random_religion(){
    let index = Math.round(Math.random() * 10);
    let religions = []
    for (let i = 0; i < index; i++){ //loop to add multiple religions
        let religion = Math.round(Math.random() * 13) + 1
        if (religions.indexOf(religion) === -1){ //stops same id from being inserted multiple times
            religions.push(religion)
        }
    }
    return religions
}

function random_religious_level(){
    let index = Math.round(Math.random() * 10);
    let religious_levels = []
    for (let i = 0; i < index; i++){ //loop to add multiple religious_levels
        let religious_level = Math.round(Math.random() * 7) + 1
        if (religious_levels.indexOf(religious_level) === -1){ //stops same id from being inserted multiple times
            religious_levels.push(religious_level)
        }
    }
    return religious_levels
}

function partner_gender(){
    if (gender==0){
        return '1'
    }
    else{
        return '0'
    }
}



//BEGIN LOOP

for (let i = 0; i < 1; i++){ //GIANT FOR LOOP
    let user_birthday = faker.date.between('1985-01-01', '2000-01-01')
    let gender = userGender(count)
    let cookie_for_data = `token=bridged_data; user_id=${count}; birthday=${user_birthday}; gender_id=${gender};`

    // Returns user's gender

    async.waterfall([
        
        // begin proccess for new user
        function new_profile(){


            let random_location = randomAddress();
            let city = random_location["city"];
            let state = random_location["state"];
            let address = random_location["address"];
            let zip_code = random_location["zip_code"];
            let country = random_location["country"];
            let latitude = random_location["latitude"];
            let longitude = random_location["longitude"];
            let ethnicities = random_ethnicity()
            let religions = random_religion()
            if (ethnicities === undefined){
                ethnicities = []
            }
            if (religions === undefined){
                religions = []
            }
            let userEducation = `${city} School for ${faker.name.jobType()}s`
            const save_profile = {
                url: 'https://bridgedapp.com/save_profile',
                method: 'POST',
                headers: {
                    Cookie: cookie_for_data
                },
                data: {
                    first_name: faker.name.firstName(),
                    last_name: faker.name.lastName(),
                    birthday: user_birthday,
                    gender_id: gender, 
                    address: address,
                    city: city,
                    state: state,
                    zip_code: zip_code,
                    country: country,
                    latitude: `${latitude}`,
                    longitude: `${longitude}`,
                    my_ethnicity: ethnicities,
                    children: `${Math.round(Math.random() * 2)}`,
                    family_plans: `${Math.round(Math.random() * 3)}`,
                    marital_status: `${Math.round(Math.random() * 5)}`,
                    profession: faker.name.jobTitle(),
                    education: userEducation,
                    my_religion: religions,
                    religious_level_id: `${Math.round(Math.random() * 7) + 1}`,
                    politics: `${Math.round(Math.random() * 4)}`,
                    drink: `${Math.round(Math.random() * 3)}`,
                    smoke: `${Math.round(Math.random() * 3)}`,
                    weed: `${Math.round(Math.random() * 3)}`
                }
            }

            axios(save_profile)
            .then(response => {
            console.log('User created successfully!!')
        
            // console.log(response.data);
            console.log(save_profile.data)
            }, error => {
                console.log(error)
            })
        },

        function add_photo(){
            let querystring = "INSERT INTO Media (type, media_link, media_type, position, user_id) VALUES (?, ?, ?, ?, ?);"
            const connection = getConnection()

            let picture = `User${count - 1}.png`
            let inserts = [0, picture, 0, 0, (count - 1)]
            connection.query(querystring, inserts, (err, rows, fields) => {
                if (err) {
                console.log("Failed to Add Photo: " + err)
                return
                }
                console.log("Added Photo Successfully");
            })

        },

        function user_preferences(){
            let age_min = Math.floor(Math.random() * 64) + 18;
            //Age max has to be greater than age min (Random number between 65 and age_min and add that to age min)
            let age_max = Math.floor(Math.random() * (65 - age_min)) + age_min + 1;
            let max_distance = Math.floor(Math.random() * 300) + 5;
            let partner_gender_id = partner_gender();
            let ethnicity_interested = random_ethnicity();
            partner_children = Math.floor(Math.random() * 3);
            let partner_family_plans = Math.floor(Math.random() * 4);
            let religion_interested = random_religion();
            let religious_level_interested = random_religious_level();
            //can turn into array if want to mimic production since multiple can be selected
            let politics_interested = [Math.floor(Math.random() * 4)];
            let marital_interested = [Math.floor(Math.random() * 6)];

            const save_preference = {
                url: 'https://bridgedapp.com/save_preference',
                method: 'POST',
                headers: {
                    Cookie: cookie_for_data
                },
                data: {
                    age_min: `${age_min}`,
                    age_max: `${age_max}`,
                    max_distance: `${max_distance}`,
                    partner_gender_id: partner_gender_id,
                    ethnicity_interested: ethnicity_interested,
                    partner_children: `${partner_children}`,
                    partner_family_plans: `${partner_family_plans}`,
                    religion_interested: religion_interested,
                    religious_level_interested: religious_level_interested,
                    politics_interested: `${politics_interested}`,
                    marital_interested: `${marital_interested}`
                }
            }

            axios(save_preference)
            .then(response => {
            console.log('User Preferences Created!!')

            // console.log(response.data);
            console.log(save_preference.data)
            }, error => {
                console.log(error)
            })

        },

        function login(){
            const login = {
                url: 'https://bridgedapp.com/login',
                method: 'POST',
                headers: {
                    // Cookie: `token = ${token}`
                    Cookie: cookie_for_data
                }
            };
        
            axios(login)
                .then(response => {
                    console.log('Login successful!!')
                    // console.log(response);
                }, error => {
                    // console.log(error)
                })
        }
    
    ], function(err){
        if (err) throw err;
    });

    count+=1;
}


console.log('finished!!')
