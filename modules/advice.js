
import cacheManager from './cacheManager.js';

export async function loadAdvice() {
    // Check for cached advice first
    const cachedAdvice = cacheManager.getCachedAdvice();
    if (cachedAdvice && !cacheManager.isNewSession()) {
        document.getElementById("qoute").textContent = `"${cachedAdvice}"`;
        return;
    }

    document.getElementById("qoute").innerHTML = `
        <div class="loading"></div>
        <span class="loading-text">Loading daily wisdom...</span>
    `;
    
    try{
       const res = await fetch(`https://api.adviceslip.com/advice`)
       const data = await res.json()
       const adviceText = data.slip.advice
       
       // Cache the advice
       cacheManager.setCachedAdvice(adviceText);
       
       document.getElementById("qoute").textContent = `"${adviceText}"`
    }catch(e){
        console.error(e)
        const fallbackAdvice = "Stay positive and keep moving forward!";
        cacheManager.setCachedAdvice(fallbackAdvice);
        document.getElementById("qoute").textContent = `"${fallbackAdvice}"`
    }
}
