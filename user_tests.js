const faker = require('faker');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '*OMITTED*',
    user: '*OMITTED*',
    password: '*OMITTED*',
    database: '*OMITTED*',
    port: 3306
});

let data = [];

let NUM_USERS = 1000
let NUM_RELIGIONS = 1000
let NUM_ETHNICITIES = 1000
let NUM_INFOS = 1000
//create 
for (let i = 0; i < NUM_USERS; i++){
     first_name = faker.name.firstName()
     last_name = faker.name.lastName()
     data.push([
         (i+35),                                                                         //id
         faker.random.uuid(),                                                            //firebase_id
         first_name,                                                                     //first_name
         last_name,                                                                      //last_name
         (faker.random.number(2)),                                                       //gender_id
         faker.date.between('1988-01-01', '2000-01-01'),                                 //birthday
         (faker.random.number(60) + 150),                                                //height(centimeters between 150-210)
         faker.random.number(6),                                                         //religious_level_id
         ('https://bridgedapp.com/Users/' + first_name + '.' + last_name + i + '/'),     //deep_link
         faker.date.past()                                                               //date_added
     ])}


let q = 'INSERT INTO Users (id, firebase_id, first_name, last_name, gender_id, birthday, height, religious_level_id, deep_link, date_added) VALUES ?'
//INSERTING RANDOM USERS
 connection.query(q, [data], function(err, res) {
     if (err) throw err;
     console.log(res);
});

// INSERTING RANDOM USER_RELIGIONS 
q = 'INSERT INTO User_Religion (religion_id, user_id) VALUES ?'

for (let i = 0; i < NUM_RELIGIONS; i++){
    data.push([
        faker.random.number(14),     //religion_id
        (i+35)                       //user_id 
    ])
}

connection.query(q, [data], function(err, res) {
    if (err) throw err;
    console.log(res);
});


// INSERTING RANDOM USER_ETHNICITIES
q = 'INSERT INTO User_Ethnicity (ethnicity_id, user_id) VALUES ?'

for (let i = 0; i < NUM_ETHNICITIES; i++){
    data.push([
        faker.random.number(35),     //ethnicity_id
        (i+35)                       //user_id 
    ])
}

connection.query(q, [data], function(err, res) {
    if (err) throw err;
    console.log(res);
});



//INSERT RANDOM USER INFO ENTRIES
q = 'INSERT INTO User_Info (id, user_id, education, profession, drink_vice_id, smoke_vice_id, weed_vice_id, politics_id, children_id, family_plans_id, marital_status_id) VALUES ?'

for (let i = 0; i < NUM_INFOS; i++){
    data.push([
        (i+200),                    //id
        (i+35),                     //user_id 
        faker.lorem.sentence(),     //education
        faker.name.jobTitle(),      //profession
        faker.random.number(3),     //drink_vice_id
        faker.random.number(3),     //smoke_vice_id
        faker.random.number(3),     //weed_vice_id
        faker.random.number(4),     //politics_id
        faker.random.number(2),     //children_id
        faker.random.number(3),     //family_plans_id
        faker.random.number(5)      //marital_status_id
    ])
}

connection.query(q, [data], function(err, res) {
    if (err) throw err;
    console.log(res);
});

connection.end();
