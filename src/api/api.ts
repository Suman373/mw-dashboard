import axios from "axios";

export const getTemperatureForPolygon=async(coordinate:any,range:[string,string])=>{
    try {
        const data = await axios.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${coordinate.lat?.toFixed(2)}&longitude=${coordinate.lng?.toFixed(2)}&start_date=${range[0]}&end_date=${range[1]}&hourly=temperature_2m`);
        if(!data){
            throw new Error("Failed to fetch data from API");
        }
        console.log(data?.data?.hourly?.temperature_2m);
        return data?.data?.hourly?.temperature_2m;
    } catch (error) {
        console.log(`Error while fetching temperature data : ${error}`);
    }
}