const bcrypt = require('bcrypt');

module.exports = {
  async up(db, client) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
          }
        }
      }
    })

    await db.collection('users').createIndex({ username: 1 }, { unique: true });

    // create a user
    await db.collection('users').insertOne({
      username: 'admin',
      password: await bcrypt.hash('admin', 10)
    });
  },

  async down(db, client) {
    await db.collection('users').drop();
  }
};
