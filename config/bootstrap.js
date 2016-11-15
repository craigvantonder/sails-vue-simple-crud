/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  var persons = [{
    name: 'Bob',
    age: '23'
  },{
    name: 'Peter',
    age: '35'
  },{
    name: 'Mary',
    age: '22'
  },{
    name: 'Jane',
    age: '32'
  }];

  Person.create(persons).exec(function (err, result){
    if (err) {
      sails.log.error('DB Connection Failed!');
      process.exit(1);
    }

    // This example checks that, if we are in production mode
    // if (sails.config.environment === 'production') {
    //   // Set the mysql connection
    //   sails.mysqlconn = sails.config.connections.mysql_prod;
    // } else {
    //   // Set the mysql connection
    //   sails.mysqlconn = sails.config.connections.mysql_dev;
    // }

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  });
};
