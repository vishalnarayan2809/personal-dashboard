
export async function loadAdvice() {
    document.getElementById("qoute").innerHTML = `
        <div class="loading"></div>
        <span class="loading-text">Loading daily wisdom...</span>
    `;
    
    try{
       const res = await fetch(`https://api.adviceslip.com/advice`)
       const data = await res.json()
       const adviceText = data.slip.advice
       document.getElementById("qoute").textContent = `"${adviceText}"`
    }catch(e){
        console.error(e)
        document.getElementById("qoute").textContent = `"Stay positive and keep moving forward!"`
    }
}
