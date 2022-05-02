var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// MongoDB connexion
mongoose.connect(process.env.DATABASE,
	{useNewUrlParser: true, useUnifiedTopology: true})
	.then(()=>console.log("Connexion à MongoDB réussie"))
	.catch(()=> console.log("Echec de connexion à MongoDB"));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let productRouter = require('./routes/productRoutes');
var userRouter = require('./routes/userRoutes');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{					//On modifie l'entête avec le setHeader
	res.setHeader('Access-Control-Allow-Origin', '*');	//on autorise Origin qu'on a dans le '*' c'est le nom de domaine, si on laisse * on autorise tous les domaines à acceder à nos ressources

								//On autorise les entêtes (lorqu'on a mis guard qui permet de vérifier si un token est valide)
								//et dans les entêtes on met la chaine qui suit la virgule, chaque mot clé sera autorisé et le client pourra les mettre dans l'entête
								//ex: Content-Type permet de préciser le type de contenu qu'on nous envoie
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
								//Permet de préciser les méthodes qui seront autorisées
								//l'origin qu'on a mis dans le '*' pourra formuler les requêtes avec les méthodes ci dessous.
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
								//une fois la configuration faite, on pourra passer au middleware suivant
	next();
	
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');		//--> on va changer cela par du json dans lequel on aura le message d'erreur
  res.json({'error': err.message});
});

module.exports = app;
