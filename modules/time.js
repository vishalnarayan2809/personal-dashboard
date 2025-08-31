
export function updateTimeAndGreeting() {
    const date = new Date();
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", { timeStyle: "short" });

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date").textContent = date.toLocaleDateString("en-us", options);

    const hour = date.getHours();
    let greetingText = "Good evening";
    if (hour < 12) {
        greetingText = "Good morning";
    } else if (hour < 18) {
        greetingText = "Good afternoon";
    }

    const userName = localStorage.getItem('userName');
    if (userName) {
        greetingText += `, ${userName}`;
    }

    document.getElementById("greeting").textContent = greetingText;
}
