let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let app = express()


let db
let port  = process.env.PORT
if (port == null || port == ""){
  port = 3000
}

let connectionString ='mongodb+srv://todoAppUser:todoAppUserPa33word@cluster0-5y2x3.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(
    connectionString, //connection string
    {useNewUrlParser: true, useUnifiedTopology: true}, //mongo db configuration property
    function(err, client){  //function which connect method will call after opening a connection
        db =  client.db()
        app.listen(port)  //For local host

    }
)


//This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
//This option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true)
app.use(express.urlencoded({extended: false}))
//Also from the async request to
app.use(express.json())



//This will let content of this folder avaiable to user
app.use(express.static('public'))

function passwordProtected(req, res, next){
   //res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
   //res.set("WWW-Authenticate", "Basic realm=Authorization Required")
  // var basicAuth = auth(req)
   //app.use(basicAuth('username', 'password'));
  //console.log(basicAuth)
  //  if (req.headers.authorization == "Pleaceholder"){
        next()
  //  }else{
  //      res.status(401).send("Authentication required")
  //  }
}
//This will let to use all our urls
app.use(passwordProtected)

app.get('/',  function(req, res){

    db.collection('items').find().toArray(function(err, items){

        res.send(`
        <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
         
        </ul>
        
      </div>
      <script>
        let items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>
        `)

    })

  
})

app.post('/create-item', function(req,res){

    let safeText = sanitizeHTML(req.body.text,{allowedTags:[], allowedAttributes:{}})
    db.collection('items').insertOne({text: safeText}, function(err,info){
    res.json(info.ops[0])

    })

})

app.post('/update-item', function(req,res){

    let safeText = sanitizeHTML(req.body.text,{allowedTags:[], allowedAttributes:{}})
    db.collection('items').findOneAndUpdate(
        {_id: new mongodb.ObjectId(req.body.id)},//which document to update
        {$set: {text:safeText}},//what we want to update
        function(){//function to call which will execute when it is updated
            res.send("Success")
        }
    )
})

app.post('/delete-item', function(req,res){
    db.collection('items').deleteOne(
        {_id: new mongodb.ObjectId(req.body.id)},//which document to update
        function(){//function to call which will execute when it is updated
            res.send("Success")
        }
    )
})
