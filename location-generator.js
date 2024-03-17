const fs = require('fs');
const path = require('path');

function generateRandomLong() {
    var num = (Math.random() * 180).toFixed(3);
    var posorneg = Math.floor(Math.random());
    if (posorneg === 0) {
        num = num * -1;
    }
    return num;
}

// Generate random latitude between -90 and +90
function generateRandomLat() {
    var num = (Math.random() * 90).toFixed(3);
    var posorneg = Math.floor(Math.random());
    if (posorneg === 0) {
        num = num * -1;
    }
    return num;
}

// Generate random data country, city, state, postal code
function generateRandomData() {
    var country = ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador'];
    var city = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    var state = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
    var postalCode = ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'];
    var address = ['123 Main St', '456 Elm St', '789 Oak St', '101 Pine St', '202 Maple St', '303 Cedar St', '404 Walnut St', '505 Spruce St', '606 Birch St', '707 Ash St'];
    
    var randomCountry = country[Math.floor(Math.random() * country.length)];
    var randomCity = city[Math.floor(Math.random() * city.length)];
    var randomState = state[Math.floor(Math.random() * state.length)];
    var randomPostalCode = postalCode[Math.floor(Math.random() * postalCode.length)];
    var randomAddress = address[Math.floor(Math.random() * address.length)];
    return `${randomCountry},${randomCity},${randomState},${randomPostalCode},${randomAddress}`;
}


function generate(x) {
    let data = 'Longitude,Latitude,Country,City,State,PostalCode,Address\n';
    for (let i = 0; i < x; i++) {
        data += `${generateRandomLong()},${generateRandomLat()},${generateRandomData()}\n`;
    }

    const dir = './temp';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(path.join(dir, `data-${new Date().toISOString().replace(/:/g, '-')}.csv`), data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
generate(1000)