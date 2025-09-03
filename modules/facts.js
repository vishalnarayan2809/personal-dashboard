
import config from '../config.js';
import cacheManager from './cacheManager.js';

export async function loadFacts() {
    // Check for cached facts first
    const cachedFacts = cacheManager.getCachedFacts();
    if (cachedFacts && !cacheManager.isNewSession()) {
        document.getElementById("facts").innerHTML = 
        `<span>Fact of the day:</span>
            ${cachedFacts}
        `;
        return;
    }

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
        const factText = data[0].fact;
        
        // Cache the fact
        cacheManager.setCachedFacts(factText);
        
        document.getElementById("facts").innerHTML = 
        `<span>Fact of the day:</span>
            ${factText}
        `
    }
    catch(e){
        console.error(e)
        const fallbackFact = "Did you know? The human brain contains approximately 86 billion neurons!";
        cacheManager.setCachedFacts(fallbackFact);
        document.getElementById("facts").innerHTML = 
        `<span>Fact of the day:</span>
            ${fallbackFact}
        `
    }
}
