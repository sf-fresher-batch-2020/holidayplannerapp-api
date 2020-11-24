const express = require('express')
    const app = express()
    const port = 3000
    app.use(express.json())

    // Create Connection Pool
    const mysql = require("mysql2/promise");

    const pool = mysql.createPool({
        host: process.env.DB_URL || "localhost",
        port: 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ashpikachu@123",
        database: process.env.DB_NAME || "holiday_app",
        connectionLimit: 10
    });
    


    // Create Routes
    //users
    app.get('/api/users', getAllUsers);
    app.post('/api/users', createUser);
    app.post('/api/users/login',login);

    //destination
    app.post('/api/destination',destination);
    app.get('/api/destination',getDestinations);

    //package details
    app.post('/api/packages',packages);
    app.get('/api/packages',getAllpackages);
    app.post('/api/packages/update', updatepackage);
    
   //viewdestinations
   app.post('/api/viewdestination',viewdestinations);
    app.get('/api/viewdestination',getAlldestinations);
    //packages
    app.post('/api/bookingdetails',bookdetails);
    app.get('/api/bookingdetails',getbookings)



    //register and login
    async function createUser(req,res){
        let user = req.body;
        let params = [ user.name, user.email, user.password, user.role];
        const result = await pool.query("insert into users (name,email,password,role) values ( ?,?,?,?)", params);    
        res.status(201).json({id:result[0].insertId});        
    }

    async function getAllUsers(req,res){    
        const result = await pool.query("select id,name,email,password,role from users");    
        res.status(200).json(result[0]);
    }

    async function login (req,res){
        const user = req.body;
    let params = [user.email, user.password];
    const result = await pool.query("SELECT id, name, email,password FROM users WHERE email = ? AND password = ?", params);
    if (result[0].length == 0) {
        throw new Error("Invalid Login Credentials");
    }
    res.status(201).json(result[0]);
    }


    //destination and details
    async function destination(req,res){
        let dest = req.body;
        let params = [ dest.id,dest.title,dest.description];
        const result = await pool.query("insert into destination (id,title,description) values (?,?,?)", params);    
        res.status(201).json({id:result[0].insertId});        
    }
    
    async function getDestinations(req,res){    
        const result = await pool.query("SELECT id,title,description from destination");    
        res.status(200).json(result[0]);
    }


    //package details
    async function packages(req,res){
        let pack = req.body;
        let params = [pack.Duration,pack.Ratings,pack.Facilities,pack.Price];
        const result = await pool.query("insert into packages (Duration,Ratings,Facilities,Price) values (?,?,?,?)", params);    
        res.status(201).json({id:result[0].insertId});    
    }

    async function updatepackage(req,res){
        let pack = req.body;
        let params = [pack.duration,pack.Ratings,pack.Facilities,pack.Price];
        const result = await pool.query("UPDATE packages SET Duration=?,Ratings =?, Facilities =?, Price=? WHERE id= ?",params);    
        res.status(201).json(result[0].info);    
    }
     async function getAllpackages(req,res){
         const result=await pool.query("SELECT * from packages");
         res.status(200).json(result[0]);
     }

     //view destination
     async function viewdestinations(req,res){
        let view = req.body;
        let params = [view.id,view.destitle,view.descr];
        const result = await pool.query("insert into viewdestination (id,destitle,descr) values (?,?,?,?)", params);    
        res.status(201).json({id:result[0].insertId});    
    }

    async function getAlldestinations(req,res){
        const result=await pool.query("SELECT * from viewdestination");
        res.status(200).json(result[0]);
    }




     //BOOk PACKAGES 
     async function bookdetails(req,res){
         let package=req.body;
         let params=[package.book_id,package.packagename,package.price,package.duration,package.facilities];
         const result =await pool.query(" insert into bookpackage(book_id,packagename,price,duration,facilities) values (?,?,?,?,?)", params);
         res.status(201).json({booking_id:result[0].insertId})
     }

     async function getbookings(req, res){
         const result= await pool.query("SELECT * from bookpackage");
         res.status(200).json(result[0]);
     }



    // Create Commmon Error Handler
    app.use(function (err, req, res, next) {
        console.log("common error handler")
        console.error(err);
        res.json({errorMessage:err.message});
    })

    app.listen(port, () => console.log(`app listening on port port!`))
