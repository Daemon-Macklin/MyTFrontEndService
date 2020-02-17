import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: 'http://87.44.16.158:5000/v1'
    })
}