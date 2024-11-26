import axios from "axios"
export class HTTP{
    public cookie:string;
    private http:axios.Axios;
    public baseURL:string;
    constructor(cookie:string){
        this.cookie = cookie;
        this.http = axios;
        this.baseURL = process.env.NEXT_BASE_URL as string;
    }

    public async get(endpoint:string){
        const url = `${this.baseURL}/${endpoint}`
        return this.http.get(url,{withCredentials:true})
    }

    public async post(endpoint:string,body:any){
        const url = `${this.baseURL}/${endpoint}`
        return await this.http.post(url,{...body},{withCredentials:true})
    }

    public async put(endpoint:string,body:any){
        const url = `${this.baseURL}/${endpoint}`
        return this.http.put(url,{...body},{withCredentials:true})
    }

    public async delete(endpoint:string,body:any){
        const url = `${this.baseURL}/${endpoint}`
        return await this.http.delete(url,{withCredentials:true})
    }
}