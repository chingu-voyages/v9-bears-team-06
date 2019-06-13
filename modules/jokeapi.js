const axios = require("axios");
module.exports = {
    /**
     * Retrieves jokes from the Joke API depending on the category selected
     * Also it can commit certain terms if any 
     * Params:
     * category => (string) a case sensitive category of a joke
     * flags => (string/Array) of terms that should be ommited from query
     * Return: 
     * Object if call is successfull otherwise it will return undefined
     * */
    getJokes: async (category, flags) => {
        if (category !== '' && flags !== undefined) {
            let url = `https://sv443.net/jokeapi/category/${category}?blacklistFlags=${flags}`;
            let response = await axios.get(url);
            return response.data;
        }
        return false
    },
    /**
     * Returns an object containing all the categories available
     * for use with the url endpoint
     * */
    getCategories: async () => {
        let url = "https://sv443.net/jokeapi/categories";
        return await axios.get(url);
    },
    /**
     * Returns an object with the informaton about the API
     * */
    getApiInfo: async () => {
        let url = "https://sv443.net/jokeapi/info";
        return await axios.get(url);
    }
};
