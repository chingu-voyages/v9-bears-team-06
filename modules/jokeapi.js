const axios = require("axios");
module.exports = {
    /**
     * Retrieves jokes from the Joke API depending on the category selected
     * Also it can commit certain terms if any 
     * Params:
     * @category => (string) a case sensitive category of a joke
     * @flags => (string/Array) of terms that should be ommited from query
     * Return: 
     * Object if call is successfull otherwise it will return false
     * */
    getJokes: async (category, flags) => {
        try {
            if (category !== '' && flags !== undefined) {
                let url = `https://sv443.net/jokeapi/category/${category}?blacklistFlags=${flags}`;
                let response = await axios.get(url);
                return response
            } else {
                return false
            }
        } catch(error) {
            return error.response.status
        }
    },
    /**
     * Returns an object containing all the categories available
     * for use with the url endpoint
     * */
    getCategories: async () => {
        try {
            let url = "https://sv443.net/jokeapi/categories";
            return await axios.get(url);
        } catch (error) {
            return error.response.status
        }
    },
    /**
     * Returns an object with the informaton about the API
     * */
    getApiInfo: async () => {
        try{
            let url = "https://sv443.net/jokeapi/info";
            return await axios.get(url);
        } catch (error) {
            return error.response.status;
        }
    }
};
