
import config from '../config.js';

export async function loadFacts() {
    document.getElementById("facts").innerHTML = `
        <span>Fact of the day:</span><br>
        <div class="loading"></div>
        <span class="loading-text">Loading interesting fact...</span>
    `;
    
    try{
        const response = await fetch(`https://api.api-ninjas.com/v1/facts?`, {
          method: "GET",
          headers: {
            "X-Api-Key": config.API_NINJAS_KEY,
            "Content-Type": "application/json"
          }
        })

        const data = await response.json()
        document.getElementById("facts").innerHTML = 
        `<span>Fact of the day:</span>
            ${data[0].fact}
        `
    }
    catch(e){
        console.error(e)
        document.getElementById("facts").innerHTML = 
        `<span>Fact of the day:</span>
            Did you know? The human brain contains approximately 86 billion neurons!
        `
    }
}
