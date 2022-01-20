const express = require('express')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const PORT = process.env.PORT || 8080



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('short'))

function getConnection() {
    return mysql.createConnection({
    host: '*OMITTED*',
    user: '*OMITTED*',
    password: '*OMITTED*',
    database: '*OMITTED*',
    port: 3306
    })
}

app.get("/", (req, res) => {
    res.send("Test Bridge API")
    console.log("Running Root")
})

app.get("/genders", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, id from Gender;"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Genders: " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Genders successfully");
        res.end()
    })
})

app.get("/ethnicities", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, id from Ethnicity;"
    
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Ethnicities: " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Ethnicities successfully");
        res.end()
    })
})

app.get("/religions", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, id from Religion;"
    
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Religions: " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Religions successfully");
        res.end()
    })
})

app.get("/religious_levels", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, id from Religious_Level;"
    
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Religious Levels: " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Religious Levels successfully");
        res.end()
    })
})

app.post("/save_profile", (req, res) => {
    console.log("Trying to create user...")
    const connection = getConnection()
    let queryString = "insert into Users (id, first_name, last_name, birthday, gender_id, \
    religious_level_id) Values (?, ?, ?, ?, ?, ?);"
    
    const user_id = req.body.user_id;
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const birthday = req.body.birthday
    const gender_id = req.body.gender_id
    // const location = TBD
    const my_ethnicity = req.body.my_ethnicity
    const children = req.body.children
    const family_plans = req.body.family_plans
    const marital_status = req.body.marital_status
    const profession = req.body.profession
    const education = req.body.education
    const my_religion = req.body.my_religion
    const religious_level_id = req.body.religious_level_id
    const politics = req.body.politics
    const drink = req.body.drink
    const smoke = req.body.smoke
    const weed = req.body.weed

    console.log('This is the id returned ' + user_id)
    connection.query(queryString, [user_id, first_name, last_name, birthday, gender_id, religious_level_id], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Successfully ");
    })

    queryString = "insert into User_Ethnicity (user_id, ethnicity_id) values (?, ?), (?, ?), (?, ?);"
    connection.query(queryString, [user_id, my_ethnicity[0], user_id, my_ethnicity[1], user_id, my_ethnicity[2]], (err, rows, fields) => {
        if (err) {
            console.log("Failed to insert User Ethnicity: " + err)
            res.status(500)
            return
          }
        console.log("USER ETHNICITY ALSO ADDED")
    })

    queryString = "insert into User_Info (user_id, children_id, family_plans_id, marital_status_id, \
        profession, education, politics_id, drink_vice_id, smoke_vice_id, weed_vice_id) \
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); "
    connection.query(queryString, [user_id, children, family_plans, marital_status, profession, education, politics, drink, smoke, weed], (err, rows, fields) => {
        if (err) {
            console.log("Failed to insert User Info: " + err)
            res.status(500)
            return
            }
        console.log("USER INFO ALSO ADDED")
    })

    queryString = "insert into User_Religion (user_id, religion_id) values (?, ?), (?, ?), (?, ?);"
    connection.query(queryString, [user_id, my_religion[0], user_id, my_religion[1], user_id, my_religion[2]], (err, rows, fields) => {
        if (err) {
            console.log("Failed to insert User Religion: " + err)
            res.status(500)
            return
          }
        console.log("USER RELIGION ALSO ADDED")
        res.status(200).json({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: birthday,
            gender_id: gender_id,
            my_ethnicity: my_ethnicity,
            children: children,
            family_plans: family_plans,
            marital_status: marital_status,
            profession: profession,
            education: education,
            my_religion: my_religion,
            religious_level_id: religious_level_id,
            politics: politics,
            drink: drink,
            smoke: smoke,
            weed: weed
        })
        res.end()
    })

})

app.post("/save_preference", (req, res) => {
    console.log("Trying to create user preferences...")
    const connection = getConnection()
    let queryString = "insert into User_Preferences (user_id, age_min, age_max, \
        max_distance, partner_gender_id, partner_children_id, partner_family_plans_id) values (?, ?, ?, ?, ?, ?, ?)"
    
    const user_id = req.body.user_id;
    const age_min = req.body.age_min
    const age_max = req.body.age_max
    const max_distance = req.body.max_distance
    const partner_gender_id = req.body.partner_gender_id
    const ethnicity_interested = req.body.ethnicity_interested
    const partner_children = req.body.partner_children
    const partner_family_plans = req.body.partner_family_plans
    const religion_interested = req.body.religion_interested
    const religious_level_interested = req.body.religious_level_interested
    const politics_interested = req.body.politics_interested
    const marital_interested = req.body.marital_interested

    connection.query(queryString, [user_id, age_min, age_max, max_distance, partner_gender_id, partner_children, partner_family_plans], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Preferences: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Preferences Successfully");
    })
    
    queryString = "insert into User_Pref_Ethnicity (user_id, ethnicity_id) values \
    (?, ?), (?, ?), (?, ?)"
    connection.query(queryString, [user_id, ethnicity_interested[0], user_id, ethnicity_interested[1], user_id, ethnicity_interested[2]], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Ethnicity Preferences: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Ethnicity Preferences Successfully");
    }) 

    queryString = "insert into User_Pref_Religion (user_id, religion_id) values \
    (?, ?), (?, ?), (?, ?)"
    connection.query(queryString, [user_id, religion_interested[0], user_id, religion_interested[1], user_id, religion_interested[2]], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Religion Preferences: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Religion Preferences Successfully");
    }) 

    queryString = "insert into User_Pref_Religious_Level (user_id, religious_level_id) values \
    (?, ?), (?, ?), (?, ?)"
    connection.query(queryString, [user_id, religious_level_interested[0], user_id, religious_level_interested[1], user_id, religious_level_interested[2]], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Religious Level Preferences: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Religious Level Preferences Successfully");
    })
    
    queryString = "insert into User_Pref_Politics (user_id, politics_id) values \
    (?, ?), (?, ?), (?, ?)"
    connection.query(queryString, [user_id, politics_interested[0], user_id, politics_interested[1], user_id, politics_interested[2]], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Politics Preferences: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted User Politics Preferences Successfully");
    })
    
    queryString = "insert into User_Pref_Marital_Status (user_id, marital_status_id) values \
    (?, ?), (?, ?), (?, ?)"
    connection.query(queryString, [user_id, marital_interested[0], user_id, marital_interested[1], user_id, marital_interested[2]], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert User Marital Preferences: " + err)
          res.status(500)
          return
        }
        
        res.status(200).json({
            "age_min": age_min,
            "age_max": age_max,
            "max_distance": max_distance,
            "partner_gender_id": partner_gender_id,
            "ethnicity_interested": ethnicity_interested,
            "partner_children": partner_children,
            "partner_family_plans": partner_family_plans,
            "religion_interested": religion_interested,
            "religious_level_interested": religious_level_interested,
            "politics_interested": politics_interested,
            "marital_interested": marital_interested
        })
        console.log("Inserted User Marital Preferences Successfully");
    }) 
})

app.get("/questions", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, id from Questions;"
    
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Questions " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Questions successfully");
        res.end()
    })
})

app.post("/save_answer", (req, res) => {
    console.log("Trying to Create Question Answer...")
    const connection = getConnection()
    let queryString = "insert into Question_Answers (user_id, answer, question_id, \
        position) values (?, ?, ?, ?)"
    
    const user_id = req.body.user_id;
    const question_answer_id = req.body.question_answer_id
    const position = req.body.position
    const answer = req.body.answer

    connection.query(queryString, [user_id, answer, question_answer_id, position], (err, rows, fields) => {
        if (err) {
          console.log("Failed to insert Question Answer: " + err)
          res.status(500)
          return
        }
        
        console.log("Inserted Question Answer Successfully");
        res.status(200).json({
            "answer": answer,
            "question_answer_id": question_answer_id,
            "position": position,
            "question_answer_id": rows.insertId
        })
    })
})

app.post("/question_remove", (req, res) => {
    console.log("Trying to Delete Question Answer...")
    const connection = getConnection()
    let queryString = "delete from Question_Answers where id = ?"
    
    const question_answer_id = req.body.question_answer_id;

    connection.query(queryString, question_answer_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to Delete Question Answer: " + err)
          res.status(500)
          return
        }
        
        console.log("Deleted Question Answer Successfully");
        res.status(200).json({
            "question_answer_id": question_answer_id
        })
    })
})

app.post("/add_photo", (req, res) => {
    console.log("Trying to Add Photo...")
    const connection = getConnection()
    let queryString;

    const insert_id = req.body.insert_id;
    const position = req.body.position
    const type = req.body.type
    const picture = req.body.picture

    if (type === 0){
        queryString = "insert into Media (user_id, position, media_link) values (?, ?, ?)"
}
    else{
        queryString = "insert into Media (group_id, position, media_link) values (?, ?, ?)"
    }
    connection.query(queryString, [insert_id, position, picture], (err, rows, fields) => {
        if (err) {
          console.log("Failed to Add Photo: " + err)
          res.status(500)
          return
        }
        
        console.log("Added Photo Successfully");
        res.status(200).json({
            "id": rows.insertId,
            "position": position,
            "media_link": picture
        })
    })
})

app.post("/reorder_photo", (req, res) => {
    console.log("Trying to Reorder Photo...")
    const connection = getConnection()
    let queryString = "update Media set position = ? where position = ? and user_id = ?"

    const user_id = req.body.user_id;
    const images = req.body.images
    const position = req.body.position

    connection.query(queryString, [position, images[0], user_id], (err, rows, fields) => {
        if (err) {
          console.log("Failed to Reorder Photo: " + err)
          res.status(500)
          return
        }
        
        console.log("Reordered Photo Successfully");
        res.status(200).json({
            "id": rows.insertId,
            "position": position,
            "media_link": "YsdjkeERSafo232ask3.jpg"
        })
    })
})

app.post("/remove_photo", (req, res) => {
    console.log("Trying to Delete Photo...")
    const connection = getConnection()
    let queryString = "delete from Media where id = ?"

    const delete_id = req.body.delete_id;

    connection.query(queryString, delete_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to Delete Photo: " + err)
          res.status(500)
          return
        }
        
        console.log("Deleted Photo Successfully");
        res.status(200).json({
            "id": delete_id
        })
    })
})

app.get("/my_profile", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT first_name, last_name, media_link, deep_link, deep_link_enabled from Users \
    left join Media on Users.id = Media.user_id where Users.id = ?;"
    
    let search_id = 500

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for My Profile " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched My Profile successfully");
        res.end()
    })
})

app.get("/my_preference", (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT age_min, age_max, max_distance, \
    partner_gender_id, Gender.title as 'partner_gender', \
    Ethnicity.title as 'ethnicity_title', ethnicity_id, \
    partner_children_id as 'partner_children', partner_family_plans_id as 'partner_family_plans', \
    Religion.title as 'religion_title', religion_id, \
    Religious_Level.title as 'religious_level_title', \
    User_Pref_Religious_Level.religious_level_id, \
    politics_id as 'politics_interested', \
    marital_status_id as 'marital_interested' from Users \
    left join User_Preferences on Users.id = User_Preferences.user_id \
    left join Gender on Gender.id = User_Preferences.partner_gender_id \
    left join User_Pref_Ethnicity on Users.id = User_Pref_Ethnicity.user_id \
    left join Ethnicity on Ethnicity.id = User_Pref_Ethnicity.ethnicity_id \
    left join User_Pref_Religion on Users.id = User_Pref_Religion.user_id \
    left join Religion on Religion.id = User_Pref_Religion.religion_id \
    left join User_Pref_Religious_Level on Users.id = User_Pref_Religious_Level.user_id \
    left join Religious_Level on Religious_Level.id = User_Pref_Religious_Level.religious_level_id \
    left join User_Pref_Politics on Users.id = User_Pref_Politics.user_id \
    left join User_Pref_Marital_Status on Users.id = User_Pref_Marital_Status.user_id \
    where Users.id = ?;"
    /*TABLES FOR QUERY: Users, User_Preferences, Gender, 
    User_Pref_Ethnicity, Ethnicity, User_Pref_Religion, 
    Religion, User_Pref_Religious_Level, Religious_Level, 
    User_Pref_Politics, User_Pref_Marital_Status */
    
    let search_id = 500

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for My Preference " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched My Preferences successfully");
        res.end()
    })
})

app.get("/my_full_profile", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT first_name, last_name, \
    Media.position as 'position', \
    media_link, Questions.title as 'question', question_id, answer, \
    birthday, Gender.title as 'gender', \
    location_profile_id, \
    GROUP_CONCAT(DISTINCT Ethnicity.title) as 'my_ethnicity', \
    GROUP_CONCAT(DISTINCT Religion.title) as 'my_religion', \
    Religious_Level.title as 'religious_level', \
    children_id, family_plans_id, politics_id, drink_vice_id,\
    smoke_vice_id, weed_vice_id, profession, education, \
    instagram_access_token from Users \
    left join Media on Users.id = Media.user_id \
    left join Question_Answers on Users.id = Question_Answers.user_id \
    left join Questions on Question_Answers.question_id = Questions.id \
    left join Gender on Users.gender_id = Gender.id \
    left join User_Location on Users.id = User_Location.user_id \
    left join User_Ethnicity on Users.id = User_Ethnicity.user_id \
    left join Ethnicity on Ethnicity.id = User_Ethnicity.ethnicity_id \
    left join User_Religion on Users.id = User_Religion.user_id \
    left join Religion on Religion.id = User_Religion.religion_id \
    left join Religious_Level on Users.religious_level_id = Religious_Level.id \
    left join User_Info on Users.id = User_Info.user_id \
    left join User_Extra_Info on Users.id = User_Extra_Info.user_id \
    where Users.id = ?;"
    /*TABLES FOR QUERY:  Users, Media, Questions, Question_Answers, 
    Gender, User_Location, User_Ethnicity, Ethnicity, 
    User_Religion, Religion, 
    Religious_Level, User_Info, User_Extra_Info
    */
    let search_id = 500

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for My Full Profile " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched My Full Profile successfully");
        res.end()
    })
})

app.get("/my_groups", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, Groups.id as 'id', media_link, Notifications_Queue.id as 'notification', member_type from Groups \
    left join Media on Groups.id = Media.group_id \
    left join Group_Members on Groups.id = Group_Members.group_id \
    left join Notifications_Queue on Groups.id = Notifications_Queue.group_id \
    left join Users on Group_Members.user_id = Users.id \
    where Users.id = ?;"
    
    let search_id = 500

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for My Groups " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched My Groups successfully");
        res.end()
    })
})

app.get("/find_group", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, Groups.id as 'id', verified from Groups \
    where Groups.title like ?"

    searchGroup = 'Syr%'

    connection.query(queryString, searchGroup, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Groups " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Groups successfully");
        res.end()
    })
})

app.get("/group_info", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT title, description, location_profile_id \
    privacy, age_min, age_max, location_radius, \
    GROUP_CONCAT(DISTINCT ethnicity_id) as 'ethnicities', \
    GROUP_CONCAT(DISTINCT religion_id) as 'religions', \
    GROUP_CONCAT(DISTINCT religious_level_id) as 'religious_levels', \
    partial_religion_allowed, partial_ethnicity_allowed, \
    auto_accept_criteria_met, auto_reject_criteria_missed, \
    allow_request_from_rejected, \
    Groups.id as 'group_id' from Groups \
    left join Groups_Location on Groups.id = Groups_Location.group_id \
    left join Group_Restrictions on Groups.id = Group_Restrictions.group_id \
    left join Group_Ethnicity_Restriction on Groups.id = Group_Ethnicity_Restriction.group_id \
    left join Group_Religion_Restriction on Groups.id = Group_Religion_Restriction.group_id \
    left join Group_Religious_Level_Restriction on Groups.id = Group_Religious_Level_Restriction.group_id \
    where Groups.id = ?"
    /*TABLES FOR QUERY: Groups, Groups_Location, Group_Restrictions,
    Group_Ethnicity_Restriction, Group_Religion_Restriction,
    Group_Religious_Level_Restriction
    */
    let search_id = 1

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Group Info " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Group Info successfully");
        res.end()
    })
})

app.get("/group_view", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT Group_Moderators.member_type as 'member_type', \
    media_link, title, description, location_profile_id, \
    privacy, invite_link, dating_enabled, \
    count(Group_Requests.group_id) as 'request_count', \
    age_min, age_max, location_radius, \
    GROUP_CONCAT(DISTINCT ethnicity_id) as 'ethnicities', \
    GROUP_CONCAT(DISTINCT religion_id) as 'religions', \
    GROUP_CONCAT(DISTINCT Group_Religious_Level_Restriction.religious_level_id) as 'religious_levels', \
    partial_religion_allowed, partial_ethnicity_allowed, \
    auto_accept_criteria_met, auto_reject_criteria_missed, \
    allow_request_from_rejected, \
    verified from Groups \
    left join Group_Moderators on Groups.id = Group_Moderators.group_id \
    left join Group_Requests on Groups.id = Group_Requests.group_id \
    left join Media on Groups.id = Media.group_id \
    left join Group_Members on Groups.id = Group_Members.group_id \
    left join Users on Users.id = Group_Members.user_id \
    left join Groups_Location on Groups.id = Groups_Location.group_id \
    left join Group_Restrictions on Groups.id = Group_Restrictions.group_id \
    left join Group_Ethnicity_Restriction on Groups.id = Group_Ethnicity_Restriction.group_id \
    left join Group_Religion_Restriction on Groups.id = Group_Religion_Restriction.group_id \
    left join Group_Religious_Level_Restriction on Groups.id = Group_Religious_Level_Restriction.group_id \
    where Groups.id = ? and Users.id = ?"
    /*TABLES FOR QUERY: Media, Group_Members, Group_Requests, Groups, Groups_Location, Group_Restrictions,
    Group_Ethnicity_Restriction, Group_Religion_Restriction,
    Group_Religious_Level_Restriction
    */
    let search_id1 = 1
    let search_id2 = 500

    connection.query(queryString, [search_id1, search_id2], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Group View " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Group View successfully");
        res.end()
    })
})

app.get("/group_members", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT media_link, Users.id as 'id', member_type, \
    first_name, last_name from Users \
    left join Media on Users.id = Media.user_id \
    left join Group_Members on Users.id = Group_Members.user_id \
    left join Groups on Groups.id = Group_Members.group_id \
    where Groups.id = ?" 
    /*TABLES FOR QUERY: Users, Group_Members, Media, Groups*/
    
    let search_id = 2

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Group Members " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Group Members successfully");
        res.end()
    })
})

app.get("/group_member_search", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT media_link, Users.id as 'id', member_type, \
    first_name, last_name from Users \
    left join Media on Users.id = Media.user_id \
    left join Group_Members on Users.id = Group_Members.user_id \
    left join Groups on Groups.id = Group_Members.group_id \
    where Groups.id = ? and concat(first_name, ' ', last_name) like ?" 
    /*TABLES FOR QUERY: Users, Group_Members, Media, Groups*/
    
    let search_id = 2
    let searchName = 'Juston W%'

    connection.query(queryString, [search_id, searchName], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Group Members " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Group Members successfully");
        res.end()
    })
})

app.get("/group_requests", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT media_link, Users.id as 'id', member_type, \
    first_name, last_name from Users \
    left join Media on Users.id = Media.user_id \
    left join Group_Requests on Users.id = Group_Requests.user_id \
    left join Groups on Group_Requests.group_id = Groups.id \
    where Groups.id = ?"

    search_id = 1

    connection.query(queryString, search_id, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Group Requests" + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Group Requests successfully");
        res.end()
    })
})

app.get("/basic_profile", (req, res) =>{
    const connection = getConnection()
    const queryString = "SELECT first_name, last_name, \
    Media.position as 'position', \
    media_link, Questions.title as 'question', question_id, answer, \
    birthday, Gender.title as 'gender', \
    location_profile_id, \
    GROUP_CONCAT(DISTINCT Ethnicity.title) as 'my_ethnicity', \
    GROUP_CONCAT(DISTINCT Religion.title) as 'my_religion', \
    Religious_Level.title as 'religious_level', \
    children_id, family_plans_id, politics_id, drink_vice_id,\
    smoke_vice_id, weed_vice_id, profession, education, \
    instagram_access_token from Users \
    left join Media on Users.id = Media.user_id \
    left join Question_Answers on Users.id = Question_Answers.user_id \
    left join Questions on Question_Answers.question_id = Questions.id \
    left join Gender on Users.gender_id = Gender.id \
    left join User_Location on Users.id = User_Location.user_id \
    left join User_Ethnicity on Users.id = User_Ethnicity.user_id \
    left join Ethnicity on Ethnicity.id = User_Ethnicity.ethnicity_id \
    left join User_Religion on Users.id = User_Religion.user_id \
    left join Religion on Religion.id = User_Religion.religion_id \
    left join Religious_Level on Users.religious_level_id = Religious_Level.id \
    left join User_Info on Users.id = User_Info.user_id \
    left join User_Extra_Info on Users.id = User_Extra_Info.user_id \
    left join Group_Members on Users.id = Group_Members.user_id \
    left join Groups on Groups.id = Group_Members.group_id \
    left join Group_Requests on Groups.id = Group_Requests.group_id \
    where Users.id = ? and (Groups.id = ? or Group_Requests.group_id = ?);"
    /*TABLES FOR QUERY:  Users, Media, Questions, Question_Answers, 
    Gender, User_Location, User_Ethnicity, Ethnicity, 
    User_Religion, Religion, 
    Religious_Level, User_Info, User_Extra_Info, Group_Members,
    Groups, Group_Requests 
    */

    let search_id1 = 500
    let search_id2 = 1

    connection.query(queryString, [search_id1, search_id2, search_id2], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for Basic Profile " + err)
          res.status(500)
          return
        }
        
        res.status(200).json(rows)
        console.log("Fetched Basic Profile successfully");
        res.end()
    })
})

// Cards id?
// app.get("/cards", (req, res) =>{
//     const connection = getConnection()
//     const queryString = "SELECT first_name, last_name, \
//     Media.position as 'position', \
//     media_link, Questions.title as 'question', question_id, answer, \
//     birthday, Gender.title as 'gender', \
//     location_profile_id, \
//     GROUP_CONCAT(DISTINCT Ethnicity.title) as 'my_ethnicity', \
//     GROUP_CONCAT(DISTINCT Religion.title) as 'my_religion', \
//     Religious_Level.title as 'religious_level', \
//     children_id, family_plans_id, politics_id, drink_vice_id,\
//     smoke_vice_id, weed_vice_id, profession, education, \
//     instagram_access_token from Users \
//     left join Media on Users.id = Media.user_id \
//     left join Question_Answers on Users.id = Question_Answers.user_id \
//     left join Questions on Question_Answers.question_id = Questions.id \
//     left join Gender on Users.gender_id = Gender.id \
//     left join User_Location on Users.id = User_Location.user_id \
//     left join User_Ethnicity on Users.id = User_Ethnicity.user_id \
//     left join Ethnicity on Ethnicity.id = User_Ethnicity.ethnicity_id \
//     left join User_Religion on Users.id = User_Religion.user_id \
//     left join Religion on Religion.id = User_Religion.religion_id \
//     left join Religious_Level on Users.religious_level_id = Religious_Level.id \
//     left join User_Info on Users.id = User_Info.user_id \
//     left join User_Extra_Info on Users.id = User_Extra_Info.user_id \
//     where Users.id = ?"
//     /*TABLES FOR QUERY:  Users, Media, Questions, Question_Answers, 
//     Gender, User_Location, User_Ethnicity, Ethnicity, 
//     User_Religion, Religion, 
//     Religious_Level, User_Info, User_Extra_Info
//     */

//     let search_id1 = 500

//     connection.query(queryString, search_id1, (err, rows, fields) => {
//         if (err) {
//           console.log("Failed to query for Cards " + err)
//           res.status(500)
//           return
//         }
        
//         res.status(200).json(rows)
//         console.log("Fetched Cards successfully");
//         res.end()
//     })
// })


//Cards id?
// app.get("/match_profile", (req, res) =>{
//     const connection = getConnection()
//     const queryString = "SELECT first_name, last_name, \
//     Media.position as 'position', \
//     media_link, Questions.title as 'question', question_id, answer, \
//     birthday, Gender.title as 'gender', \
//     location_profile_id, \
//     GROUP_CONCAT(DISTINCT Ethnicity.title) as 'my_ethnicity', \
//     GROUP_CONCAT(DISTINCT Religion.title) as 'my_religion', \
//     Religious_Level.title as 'religious_level', \
//     children_id, family_plans_id, politics_id, drink_vice_id,\
//     smoke_vice_id, weed_vice_id, profession, education, \
//     instagram_access_token from Users \
//     left join Media on Users.id = Media.user_id \
//     left join Question_Answers on Users.id = Question_Answers.user_id \
//     left join Questions on Question_Answers.question_id = Questions.id \
//     left join Gender on Users.gender_id = Gender.id \
//     left join User_Location on Users.id = User_Location.user_id \
//     left join User_Ethnicity on Users.id = User_Ethnicity.user_id \
//     left join Ethnicity on Ethnicity.id = User_Ethnicity.ethnicity_id \
//     left join User_Religion on Users.id = User_Religion.user_id \
//     left join Religion on Religion.id = User_Religion.religion_id \
//     left join Religious_Level on Users.religious_level_id = Religious_Level.id \
//     left join User_Info on Users.id = User_Info.user_id \
//     left join User_Extra_Info on Users.id = User_Extra_Info.user_id \
//     where Users.id = ?;"
//     /*TABLES FOR QUERY:  Users, Media, Questions, Question_Answers, 
//     Gender, User_Location, User_Ethnicity, Ethnicity, 
//     User_Religion, Religion, 
//     Religious_Level, User_Info, User_Extra_Info
//     */

//     let search_id1 = 500

//     connection.query(queryString, search_id1, (err, rows, fields) => {
//         if (err) {
//           console.log("Failed to query for Match Profile " + err)
//           res.status(500)
//           return
//         }
        
//         res.status(200).json(rows)
//         console.log("Fetched Match Profile successfully");
//         res.end()
//     })
// })

// No 'my matches' table or columns
// app.get("/matches", (req, res) =>{
//     const connection = getConnection()
//     const queryString = "SELECT Users.id as 'id', first_name, last_name, \
//     media_link from Matches \
//     left join Users on \
//     left join Media on Users.id = Media.user_id \
//     where Matches.user_id = ?"

//     search_id = 1

//     connection.query(queryString, search_id, (err, rows, fields) => {
//         if (err) {
//           console.log("Failed to query for Group Requests" + err)
//           res.status(500)
//           return
//         }
        
//         res.status(200).json(rows)
//         console.log("Fetched Group Requests successfully");
//         res.end()
//     })
// })

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...`)
})

