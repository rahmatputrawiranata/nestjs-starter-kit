module.exports = {
  async up(db, client) {
    // Create a new collection and add a new field to each document
    await db.createCollection('geocodes', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['longitude', 'latitude'],
          properties: {
            longitude: {
              bsonType: 'number',
              description: 'must be a number and is required',
              minimum: -180,
              maximum: 180
            },
            latitude: {
              bsonType: 'number',
              description: 'must be a number and is required',
              minimum: -90,
              maximum: 90
            }
          }
        }
      }
    });
  },

  async down(db, client) {
    // Remove the collection and the new field from each document
    await db.collection('geocodes').drop();
  }
};
