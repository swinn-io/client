const fetchJson = {
    
    async GET( user, url ) {
        try {
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
};

export default fetchJson;