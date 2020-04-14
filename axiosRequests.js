const axios = require('axios');
const fs = require('fs');

axios({
  method: 'post',
  url: 'http://localhost:8080/users',
  data: { userName: 'Dannyt11' },
  transformRequest: (data, headers) => {
    const newData = {
      userName: data.userName + '!',
    };
    return JSON.stringify(newData);
  },
})
  .then((response) => {
    response.data.pipe(fs.createWriteStream('google.html'));
  })
  .catch((error) => {
    console.error(error);
  });

axios
  .all([
    axios.get('http://localhost:8080/metadata?id=1'),
    axios.get('http://localhost:8080/metadata?id=1'),
  ])
  .then((responseArray) => {
    for (let data of responseArray) {
      console.log(data.data);
    }
  });
