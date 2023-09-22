const express = require('express');
const app = express();
const morgan = require('morgan')

//setting
app.set('port', process.env.PORT || 3900);
app.set('json space', 2);


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
app.use(require('./routes/index'));
app.use('/api/movies', require('./routes/movies'));

//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});