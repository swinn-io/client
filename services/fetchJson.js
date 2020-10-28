import deviceStorage from './deviceStorage';

const ThrowException = (error) => {

  if(error === "Network request failed")
  {
    //throw new Error (`${503}`) // -- Service Unavailable
    throw new Error (`${"Service Unavailable"}`) // -- Service Unavailable
  }
  else{
    //throw new Error (`${500}`) // -- Internal Server Error
    throw new Error (`${"Internal Server Error"}`) // -- Internal Server Error
  }
}

const fetchJson = {
    async GET( url ) {
        try {

          let user = await deviceStorage.getUser()

          let response = await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${user.access_token}`,
            },
            timeout: 3000,
          });
          if (!response.ok){
              throw new Error (`HttpError: ${response.status} ${response.statusText}`)
          }
          return response.json()
        } catch (e) {
          ThrowException(e.message)
        }
    },
    async POST( data, url ) {
      try {

        let user = await deviceStorage.getUser()

        let response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.access_token}`,
          },
          timeout: 3000,
          body: JSON.stringify(data)
        });
        console.log("POST RESPONSE", response)
        if (!response.ok){
            throw new Error (`HttpError: ${response.status} ${response.statusText}`)
        }
        return response.json()
      } catch (e) {
        ThrowException(e.message);
      }
  },
};

export default fetchJson;
