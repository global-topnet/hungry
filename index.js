
let defaultMenus = [
    "금호회관", "깃발집", "정담", "삼색 칼국수", "온천역 칼국수", "뼈해장국", "초밥", "완뚝",
    "항도반점", "요세미티", "온천역 돈까스", "낙곱새", "보배반점", "갈비탕", "미미루", "김치찌개", "한식당",
    "개화", "현대옥", "낙지비빔밥", "쌀국수", "서울깍두기", "육회비빔밥", "오징어보쌈", "가야 밀면",
    "뚝배기 불고기", "돼지 국밥", "게장찌개", "지우펀"
]


let menus = []


function loadUserMenus() {
    const userMenus = localStorage.getItem('userMenus');
    return userMenus ? JSON.parse(userMenus) : [];
}


function saveUserMenus(userMenus) {
    localStorage.setItem('userMenus', JSON.stringify(userMenus));
}


function updateMenus() {
    const userMenus = loadUserMenus();
    menus = [...defaultMenus, ...userMenus];
}

let dayOff = {
    1: ["서울깍두기", "초밥", "현대옥"],
    2: [],
    3: [],
    4: [],
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
    document.cookie = "history=";
    generateHistory()
}



// sync
function generateHistory(){
    const history = getHistory()
    const historyWrap = document.querySelector("#history-wrap");
    
    if(history.length == 0){ 
        historyWrap.innerHTML = `<div class="history">과거 이력 없음</div>`;
        return;
    }
    
    historyWrap.innerHTML = getHistory().reverse().map(item => 
        `<div class="history">${item}</div>`
    ).join('');
}

// 메뉴 추가 기능
function addMenu() {
    const input = document.getElementById('new-menu-input');
    const menuName = input.value.trim();
    
    if (!menuName) {
        alert('메뉴 이름을 입력해주세요!');
        return;
    }
    
    const userMenus = loadUserMenus();
    
    // 중복 체크 (기본 메뉴 + 사용자 메뉴)
    if (defaultMenus.includes(menuName) || userMenus.includes(menuName)) {
        alert('이미 존재하는 메뉴입니다!');
        return;
    }
    
    userMenus.push(menuName);
    saveUserMenus(userMenus);
    updateMenus();
    
    input.value = '';
    updateMenuList();
    alert(`"${menuName}" 메뉴가 추가되었습니다!`);
}

// 메뉴 삭제 기능 (사용자 추가 메뉴만)
function deleteMenu(menuName) {
    if (!confirm(`"${menuName}" 메뉴를 삭제하시겠습니까?`)) {
        return;
    }
    
    const userMenus = loadUserMenus();
    const updatedMenus = userMenus.filter(menu => menu !== menuName);
    
    saveUserMenus(updatedMenus);
    updateMenus();
    updateMenuList();
    alert(`"${menuName}" 메뉴가 삭제되었습니다!`);
}

// 메뉴 목록 토글
function toggleMenuList() {
    const menuListWrap = document.getElementById('menu-list-wrap');
    const toggleButton = document.getElementById('menu-list-toggle');
    
    if (menuListWrap.style.display === 'none') {
        menuListWrap.style.display = 'block';
        toggleButton.textContent = '메뉴 목록 숨기기';
        updateMenuList();
    } else {
        menuListWrap.style.display = 'none';
        toggleButton.textContent = '메뉴 목록 보기';
    }
}

// 메뉴 목록 업데이트
function updateMenuList() {
    const menuList = document.getElementById('menu-list');
    const userMenus = loadUserMenus();
    
    let html = '<div class="menu-section"><h4>기본 메뉴</h4>';
    defaultMenus.forEach(menu => {
        html += `<div class="menu-item default">${menu}</div>`;
    });
    html += '</div>';
    
    if (userMenus.length > 0) {
        html += '<div class="menu-section"><h4>추가한 메뉴</h4>';
        userMenus.forEach(menu => {
            html += `<div class="menu-item user">
                        <span>${menu}</span>
                        <button onclick="deleteMenu('${menu.replace(/'/g, "\\\'")}')" class="delete-btn">삭제</button>
                     </div>`;
        });
        html += '</div>';
    }
    
    menuList.innerHTML = html;
}

// 엔터키로 메뉴 추가
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('new-menu-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addMenu();
            }
        });
    }
});

// 초기화
updateMenus();
generateHistory();



// start
function searchMenu(){
    const history = getHistory().slice(-15).map(x => x.trim());
    const today = new Date();

    const menuFilter = menus.map(x => x.trim()).filter(m => !(dayOff[today.getDay()] || []).includes(m));
    const availableMenus = menuFilter.filter(m => !history.includes(m));
    const menu = availableMenus[Math.floor(Math.random() * availableMenus.length)];

    setHistory(menu);
    generateHistory();
    document.querySelector("#menu").textContent = menu;
}

// 히스토리 초기화
function clearHistory(){
    document.cookie = "history=";
    generateHistory();
};