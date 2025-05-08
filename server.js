import express from "express";
import mysql2 from "mysql2";
import cors from "cors";

const server = express();
server.use(express.json());
server.use(cors());
const port = 4011;
const db = mysql2.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "musicecommerce",
    connectionLimit: 10
})

server.listen(port, function(){
    console.log("Server started on port", port);
});


// SERVER COMMANDS


// GET ALL PRODUCTS
server.get("/productlist", (req,res) => {

    var serverQuery = "CALL `GetAllMusicProducts`();"
    var imageQuery = "CALL `GetAllImages`();"
    var images = [];
    var PID = req.params.PID

    db.query(imageQuery, [PID], (error, data) => {
        if(error){
            res.json(error);
        }

        if(data){
            images = data[0];

            db.query(serverQuery, [PID], (error, data) => {
                if(data){
                    res.json({product: data[0], images: images});
                }
            })
            
        }
    })
});

// GET COMPLETE INFORMATION ABOUT INDIVIDUAL PRODUCT

server.get("/productlist:gID", function(req,res){
    var sqlQuery = "CALL `GetProductByID`(?)";
    var gID = req.params.gID;

    db.query(sqlQuery, [gID], function(error,data){
        
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data);
        }
    })
})

// GET ALL PRODUCTS ON SALE
server.get("/sale", function(req,res){
    var saleQuery = "CALL `GetAllOnSaleProducts`();"

    db.query(saleQuery, function(error,data){
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data[0]);
        }
    })
})

// GET ALL PRODUCTS HIGHEST/LOWEST COST
server.get("/productlist/:order", function(req,res){
    // //var ascQuery = "CALL `OrderByHighestPrice`()";
    var sqlQuery = '';
    var order = req.params.order
    
    if(order === 'asc'){
        sqlQuery = "CALL `OrderByHighestPrice`()";
    }
    else if(order ==='desc'){
        sqlQuery = "CALL `OrderByLowestPrice`()";

    }
    

    db.query(sqlQuery, order, function(error,data){
        if(error){
            res.json(error);
        }
        if(data){
            
            res.json(data[0]);
        }
        

    })
})

// GET PRODUCT BY FORMAT (CASSETTE, CD, VINYL)
server.get("/productlist/format/:format", function(req,res){
    
    var sqlQuery = '';
    var format = req.params.format

    if(format === "cassette"){
        sqlQuery = "CALL `GetAllCassette`()";
    }

    else if(format === "cd"){
        sqlQuery = "CALL `GetAllCD`()";
    }

    else if(format === "vinyl"){
        sqlQuery = "CALL `GetAllVinyl`()";
    }


    db.query(sqlQuery, format, function(error, data){
        if(error){
            res.json(error);
        }
        if(data){
            
            res.json(data[0]);
        }
    })

});

server.get("/productlist/available", function(req,res){

    sqlQuery = "CALL `GetAvailableProducts`()";

    db.query(sqlQuery, function(error,data){
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data);
        }
    })

})


// ADD A NEW PRODUCT
server.post("/productlist", function(req,res){
    var sqlQuery = "CALL `AddNewMusicProduct`(?, ?, ?, ?, ?, ?, ?, ?)"
    var iTitle = req.body.Title;
    var iImage = req.body.Image;
    var iPrice = req.body.Price;
    var iDescription = req.body.Description;
    var iFormat = req.body.Format;
    var iAvailability = req.body.Availability;
    var iisOnline = req.body.isOnline;
    var iOnSale = req.body.OnSale

    db.query(sqlQuery, [iTitle, iImage, iPrice, iDescription, iFormat, iAvailability, iisOnline, iOnSale], function(error, data){

        if(error){
            res.json(error);
        }
        if(data){
            res.json(data[0]);
        }

    })

})


// REMOVE EXISTING PRODUCT
server.delete("/productlist/:dID", function(req,res){

    var delQuery = "CALL `deleteProduct`(?)";
    var dID = req.params.dID;

    db.query(delQuery, [dID], function(error,data){
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data);
        }
    })
});


// MAKE A PRODUCT LIVE OR OFFLINE
server.put("/productlist/:uOnlineID", function(req,res){

    var onlineQuery = "CALL `UpdateProductOnline` (?, ?)";
    var uOnlineID = req.params.uOnlineID;
    var uOnline = req.body.isOnline;

    db.query(onlineQuery, [uOnline, uOnlineID], function(error, data){
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data[0]);
        }
    })
})


// EDIT PRODUCT
server.put("/productlist/edit/:ePID", function(req,res){

    var sqlQuery = "CALL `EditProduct`(?, ?, ?, ?, ?, ?, ?, ?)";
    var ePID = req.params.ePID;

    var eTitle = req.body.Title;
    var ePrice = req.body.Price;
    var eDescription = req.body.Description;
    var eFormat = req.body.Format;
    var eAvailability = req.body.Availability;
    var eisOnline = req.body.isOnline;
    var eOnSale = req.body.OnSale;

    db.query(sqlQuery, [ePID, eTitle, ePrice, eDescription, eFormat, eAvailability, eisOnline, eOnSale], function(error,data){
        if(error){
            res.json(error);
        }
        if(data){
            res.json(data);
        }
    })
});
