let menus = [
    "금호회관", "깃발집", "정담", "삼색 칼국수", "온천역 칼국수", "뼈해장국", "초밥",
    "항도반점", "요세미티", "온천돈까스", "낙곱새", "보배반점", "갈비탕", "미미루", "김치찌개", "한식당",
    "개화", "콩나물 국밥", "낙지비빔밥"
]

let dayOff = {
    1: ["정담"],
    2: ["온천장 칼국수"],
    3: [],
    4: ["삼색 칼국수", "금호회관"],
    5: [],
}




// setHistory
function setHistory(menu){
    let history = [];
    const match = decodeURIComponent(document.cookie.match(/(^| )history=([^;]+)/)?.[2]);
    if(match=="undefined"){ history.push(menu) }
    else{ history.push(...match.split(',')); history.push(menu) }

    document.cookie = `history=${encodeURIComponent(history.slice(-20).join(','))};`;
}

// getHistory
function getHistory(){
    const match = decodeURIComponent(document.cookie.match(/(^| )history=([^;]+)/)?.[2]);
    if(match=="undefined") return [];
    else return match.split(',')
}

// clearHistory
function clearHistory(){
    document.cookie = "history=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    generateHistory()
}



// sync
function generateHistory(){
    const history = getHistory()
    if(history.length == 0){ return document.querySelector("#history-wrap").innerHTML = `<span class="history">과거 이력 없음</span>` }
    document.querySelector("#history-wrap").innerHTML = getHistory().reverse().map(item => `<span class="history">${item}</span>`).join('');
}

generateHistory()



// start
function searchMenu(){
    const history = getHistory().slice(-15).map(x => x.trim());
    const today = new Date();

    const menuFilter = menus.map(x => x.trim()).filter(m => !(dayOff[today.getDay()] || []).includes(m));
    const availableMenus = menuFilter.filter(m => !history.includes(m));
    const menu = availableMenus[Math.floor(Math.random() * availableMenus.length)];


    setHistory(menu)
    generateHistory()
    document.querySelector("#menu").textContent = menu;
};