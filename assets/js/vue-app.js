// Get list of persons
io.socket.get('/person', function(resData, jwres){
  var bus = new Vue();
  // Add
  Vue.component('person-alter', {
    template: '#person-alter-template',
    props: ['list'],
    data: function () {
      return {
        // Type of form to be persented to the user
        type: 'Add',
        // UI table row key of the person if applicable
        key: '',
        // The form values
        form: {
          // Database ID of the person if applicable
          id: '',
          // Name of the person
          name: '',
          // Age of the person
          age: ''
        }
      }
    },
    computed: {
      viewingAdd: function () {
        return this.type == 'Add';
      },
      viewingDelete: function () {
        return this.type == 'Delete';
      }
    },
    methods: {
      alterPerson: function () {
        // Define which function to call
        var functionName = this.type+'Person';
        // Set a reference to "this" within the callback function
        var self = this;
        // Add/Edit/Delete the person
        p[functionName](this.form, function (err, result) {
          // Handle i/o error
          if (err) {
            console.warn('ERROR');
            console.warn(result);
            return;
          }
          // Add new item to dom and data
          if (self.viewingAdd) {
            self.list.push(result);
          }
          // Remove deleted item from dom and data
          if (self.viewingDelete) {
            self.list.splice(self.key, 1);
          }
          // Reset UI back to Add state
          self.type = 'Add',
          self.key = '',
          self.form = {
            id: '',
            name: '',
            datafeed: ''
          };
        });
      }
    },
    created: function () {
      // Set a reference to "this" within the bus function
      var self = this;
      // Catch toggle from list component
      bus.$on('toggle-alter', function (ui) {
        // Set new values
        self.type = ui.type;
        self.key = ui.key;
        self.form = ui.form;
      });
    }
  });
  // List
  Vue.component('person-list', {
    template: '#person-list-template',
    props: ['list'],
    computed: {
      total: function () {
        return this.list.length;
      }
    },
    methods: {
      alteringPerson: function (type, person, key) {
        // https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
        bus.$emit('toggle-alter', {
          type: type,
          key: key,
          form: person
        });
      }
    }
  });
  // Vue
  new Vue({
    el: '#app',
    data: {
      persons: resData
    }
  });
});

// CRUD Operations
var p = {
  AddPerson: function (form, callback) {
    var data = {
      name: form.name,
      age: form.age
    };
    io.socket.post('/person', data, function (resData, jwres){
      // Handle the error
      if (jwres.statusCode >= 400) {
        return callback(true, jwres.statusCode);
      }
      return callback(false, resData);
    });
  },
  EditPerson: function (form, callback) {
    var data = {
      name: form.name,
      age: form.age
    };
    io.socket.put('/person/'+form.id, data, function (resData, jwres){
      // Handle the error
      if (jwres.statusCode >= 400) {
        return callback(true, jwres.statusCode);
      }
      return callback(false, resData);
    });
  },
  DeletePerson: function (form, callback) {
    io.socket.delete('/person/'+form.id, function (resData, jwres){
      // Handle the error
      if (jwres.statusCode >= 400) {
        return callback(true, jwres.statusCode);
      }
      return callback(null, resData);
    });
  }
}