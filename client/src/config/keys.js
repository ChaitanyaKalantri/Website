// module.exports = {
// //   mongoURI: 'mongodb://admin:admin123@ds263520.mlab.com:63520/website_db',
// //   secretOrKey: 'secret'
// // };

if(process.env.NODE_ENV === 'production'){
  module.exports = require('./keys_prod');
}else{
  module.exports = require('./keys_dev');
}
