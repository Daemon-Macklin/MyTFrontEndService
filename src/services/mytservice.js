import Api from './api'

export default {
    login (data) {
        return Api().post("/users/login", data)
    },
    register (data) {
        console.log(data)
        return Api().post("/users/create", data)
    },
    refreshToken(token){
        return Api().get("/refresh",
            {headers: {'Authorization': 'Bearer '+token}})
    },
    getKeys(uid, password, token){
        let json = {"password": password}
        return Api().post("/users/sshKey/"+uid, json,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    createAWSCreds(data, token){
      return Api().post('credentials/create/aws', data,
          {headers: {'Authorization': 'Bearer '+token}})
    }
}