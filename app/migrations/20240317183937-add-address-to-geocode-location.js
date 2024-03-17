module.exports = {
  async up(db, client) {
    // add address field to geocode location
    await db.collection('geocodes').updateMany({}, { $set: { address: '', postal_code: '', city: '', country: '', state: ''  } });

    await db.command({
      collMod: 'geocodes',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['longitude', 'latitude', 'address', 'postalCode', 'city', 'country', 'state'],
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
            },
            address: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            postalCode: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            city: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            country: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            state: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    })
  },

  async down(db, client) {
    // remove address field from geocode location
    await db.collection('geocodes').updateMany({}, { $unset: { address: '', postalCode: '', city: '', country: '', state: ''  } });

    await db.command({
      collMod: 'geocodes',
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
    })
  }
};
