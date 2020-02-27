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
    },
    getCreds(uid, token){
       return Api().get('credentials/get/'+uid,
           {headers: {'Authorization': 'Bearer '+token}})
    },
    removeCred(type, id, token){
        return Api().delete('credentials/remove/'+ type +'/' + id,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    createSpace(data, token){
        return Api().post('spaces/create', data,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    getSpaces(uid, token){
        return Api().get('spaces/get/'+uid,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    removeAWSSpaces(data, id, token){
        return Api().post('space/remove/aws/'+id, data,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    createPlatform(data, token) {
        return Api().post('/platform/create', data,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    getPlatforms(uid, token) {
        return Api().get('platforms/get/'+uid,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    removePlatform(data, id, token) {
        return Api().post('platform/remove/'+id, data,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    updateProcessing(data, id, token) {
        return Api().post('platforms/update/processing/'+id, data,
            {headers: {'Authorization': 'Bearer '+token}})
    },
    generateDump(data, id, token){
        return Api().post('platforms/database/dump/'+id, data,
            {headers: {'Authorization': 'Bearer '+token}})
    }
}