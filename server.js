"use strict"
var express = require('express');
var mustache = require('mustache-express');

var model = require('./model');
var app = express();
app.use(express.static(__dirname +  '/lsf-data-master/videos/'));
app.use(express.static(__dirname +  '/lsf-data-master/videos/test'));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname ));
app.use(express.static(__dirname+ '/../style' ));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


const cookieSession = require('cookie-session');
app.use(cookieSession({
secret: 'mot-de-passe-du-cookie',
}));

 // to verify if user is authenticated

app.use(function(req, res , next){
  if(req.session.name!=undefined){
    res.locals.name = req.session.name;
    res.locals.authenticated = true;
  }
  else{
    res.locals.authenticated = false;
  }
  next();
}) 


//  to verify if user is admin

app.use(function(req, res , next){
  if(req.session.name!=undefined && req.session.role == 'admin'){
    res.locals.name = req.session.name;
    res.locals.role = req.session.role;
    res.locals.admin = true;

  }
  else{
    res.locals.admin = false;
  }
  next();
}) 


app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/search', (req, res) => {
//  res.render('search')
// })
app.get('/search', (req, res) => {
  var found = model.search(req.query.query, req.query.page, req.body.order);
  if(found.num_found > 0){
   res.render('search', found);
 }
 else{
     res.render('notfound');
 }
  
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.get('/update/:id', (req, res) => {
  var entry = model.read(req.params.id);
  res.render('update', entry);
});

app.get('/delete/:id', (req, res) => {
  var entry = model.read(req.params.id);
  res.render('delete', {id: req.params.id, key: entry.key});
});


app.get('/login', (req, res) => {
  res.render('login');
});

 app.get('/new_user', (req, res) => {
  res.render('new_user');
});

app.get('/contact',(req, res)=>{
  res.render('contact');
});

function post_data_to_word(req) {
  return {
    key: req.body.key, 
    video: req.body.video,

  };
}

app.post('/create', (req, res) => {
  var id = model.create(post_data_to_word(req));
  res.redirect('/search');
});

app.post('/update/:id', (req, res) => {
  var id = req.params.id;
  model.update(id, post_data_to_word(req));
  res.redirect('/search');
});

app.post('/delete/:id', (req, res) => {
  model.delete(req.params.id);
  res.redirect('/');
}); 


app.post('/login' ,(req, res) => {
  let id=model.login(req.body.name,req.body.password)
  if(model.login(req.body.name,req.body.password)!=-1){
    req.session.id = model.login(req.body.name,req.body.password);
    req.session.name = req.body.name;
    req.session.role = model.getrole(id)
    res.redirect('/');
  }
  else{
      res.redirect('/');
  }

}); 

app.post('/logout' ,(req, res) => {
  req.session = null;
  res.redirect('/');

}); 

app.post('/new_user',(req,res)=>{
 const id= model.new_user(req.body.name, req.body.password, req.body.role, req.body.code);
 if(id!=-1){
  req.session.id = model.login(req.body.name,req.body.password);
  req.session.name = req.body.name;
  req.session.role = model.getrole(id)
  res.redirect('/');
}
else{
    res.redirect('/');
}

})

// app.post('/search', (req,res)=>{
//   // let value = req.body.order;
//   console.log(req.body.order)
//   console.log(model.search(req.body.query, req.body.page,req.body.order));
//   model.search(req.body.query, req.body.page,req.body.order);
//   res.redirect('/search')

// })


app.listen(3000, () => console.log('listening on http://localhost:3000')); 