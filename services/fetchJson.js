import deviceStorage from './deviceStorage';

const fetchJson = {
    
    async GET( url ) {
        try {

          let user = await deviceStorage.getUser()

          let response = await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `${user.token_type} ${user.access_token}` , 
            },
          });
          if (!response.ok){
              throw new Error (`HttpError: ${response.status} ${response.statusText}`)
          }
          return response.json()
        } catch (e) {
          console.error("Error", e);
          //throw new Error (`HttpError: ${response.status} ${response.statusText}`)
        }
    },
    async POST( data, url ) {
      try {

        let user = await deviceStorage.getUser()

        let response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${user.token_type} ${user.access_token}` , 
          },
          body: JSON.stringify(data)
        });
        if (!response.ok){
            throw new Error (`HttpError: ${response.status} ${response.statusText}`)
        }
        return response.json()
      } catch (e) {
        console.error("Error", e);
        //throw new Error (`HttpError: ${response.status} ${response.statusText}`)
      }
  },
};

export default fetchJson;