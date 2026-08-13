// =========================================
// ไฟล์: script.js (เวอร์ชัน Pro - Final Update)
// =========================================

let dragged;
let playerName = "";
let currentMissionIndex = 0;
let totalScore = 0;
let timeRemaining = 0;
let timerInterval = null;
let missionCompleted = false;
let isPaused = false;
let scoreBoard = []; 
let currentBonusTime = 0; 
let nextLevelBonus = 0;

const missions = [
    { 
        title: "ด่านที่ 1 (ก้าวแรกสู่โลกโค้ดดิ้ง)", desc: "แสดงป้ายแนะนำตัวละครด้วย printf", 
        answer: ["include", "main", "printf_h1", "printf_h2", "printf_h3", "return"], 
        timeLimit: 60, points: 10, badge: "🐚",
        expectedOutput: "Hello, Computer!<br>My name is Somchai Jai-dee (Junior).<br>I am in Grade 8."
    },
    { 
        title: "ด่านที่ 2 (My Profile)", desc: "รับค่าอายุด้วย scanf และจัดรูปแบบหน้าจอ", 
        answer: ["include", "main", "int_age", "printf_ask_age", "scanf_age", "printf_prof", "printf_name", "printf_show_age", "printf_score", "return"], 
        timeLimit: 90, points: 15, badge: "🦀",
        expectedOutput: "How old are you?: 14<br><br>--- My Profile ---<br>Name:&nbsp;&nbsp;&nbsp;&nbsp;Junior Programmer<br>Age:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 years old<br>Score:&nbsp;&nbsp;&nbsp;100%"
    },
    { 
        title: "ด่านที่ 3 (กล่องเก็บข้อมูล 3 สหาย)", desc: "รับค่าอายุ น้ำหนัก กรุ๊ปเลือด และแสดงผล", 
        answer: ["include", "main", "var_3", "printf_enter_age", "scanf_age", "printf_ask_weight", "scanf_weight", "printf_ask_blood", "scanf_blood", "printf_health", "printf_show_age_only", "printf_show_weight", "printf_show_blood", "return"], 
        timeLimit: 120, points: 20, badge: "🐠",
        expectedOutput: "Enter your age: 14<br>Enter your weight (kg): 45.5<br>Enter your blood type (A, B, O): O<br><br>--- Health Profile ---<br>Age: 14 years old<br>Weight: 45.50 kg<br>Blood Type: O"
    },
    { 
        title: "ด่านที่ 4 (BMI Calculator)", desc: "รับค่าน้ำหนัก ส่วนสูง คำนวณ BMI", 
        answer: ["include", "main", "var_bmi", "printf_welcome_bmi", "printf_ask_weight", "scanf_weight", "printf_ask_height", "scanf_height", "calc_bmi", "printf_show_bmi", "return"], 
        timeLimit: 120, points: 20, badge: "🦑",
        expectedOutput: "--- Welcome to BMI Calculator ---<br>Enter your weight (kg): 50.5<br>Enter your height (m): 1.65<br>Your BMI is: 18.55"
    },
    { 
        title: "ด่านที่ 5 (Grade Calculator)", desc: "ใช้ if, else if, else ตัดเกรด", 
        answer: ["include", "main", "int_score", "printf_ask_score", "scanf_score", "if_80", "printf_a", "elseif_70", "printf_b", "elseif_60", "printf_c", "elseif_50", "printf_d", "else", "printf_f", "printf_try_again", "return"], 
        timeLimit: 150, points: 25, badge: "🐬",
        expectedOutput: "Enter your score (0-100): 42<br>Grade: F<br>Try again! You can do it!"
    },
    { 
        title: "ด่านที่ 6 (Vending Machine)", desc: "ใช้ switch-case ตรวจสอบเมนู", 
        answer: ["include", "main", "int_choice", "printf_vending", "printf_cola_menu", "printf_water_menu", "printf_juice_menu", "printf_ask_choice", "scanf_choice", "switch_choice", "case_1", "printf_get_cola", "break", "case_2", "printf_get_water", "break", "case_3", "printf_get_juice", "break", "default", "printf_invalid", "break_close", "return"], 
        timeLimit: 180, points: 25, badge: "🦈",
        expectedOutput: "--- Vending Machine ---<br>1. Cola<br>2. Water<br>3. Juice<br>Enter your choice (1-3): 1<br>Here is your Cola. Enjoy!"
    },
    { 
        title: "ด่านที่ 7 (Number Guessing Game)", desc: "ใช้ while loop ทายตัวเลข", 
        // คำตอบหลัก
        answer: ["include", "main", "int_secret", "int_guess", "printf_welcome_game", "while_loop", "printf_ask_guess", "scanf_guess", "if_high", "printf_high", "elseif_low", "printf_low", "close_while", "printf_bingo", "return"], 
        // คำตอบทางเลือก (สลับเอาตัวแปร guess ขึ้นก่อน secret)
        alt_answers: [
            ["include", "main", "int_guess", "int_secret", "printf_welcome_game", "while_loop", "printf_ask_guess", "scanf_guess", "if_high", "printf_high", "elseif_low", "printf_low", "close_while", "printf_bingo", "return"]
        ],
        timeLimit: 200, points: 30, badge: "🐳",
        expectedOutput: "--- Welcome to Number Guessing Game ---<br>Guess the number: 50<br>Too High!<br>Guess the number: 20<br>Too Low!<br>Guess the number: 42<br>Bingo! You got it!"
    }
];

window.onload = function() {
    const savedData = localStorage.getItem('gcpbi_save');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('saved-name').innerText = data.name;
        document.getElementById('saved-level').innerText = data.level + 1;
        document.getElementById('load-game-section').style.display = 'block';
    }
};

function startGame(loadSave) {
    if (loadSave) {
        const savedData = JSON.parse(localStorage.getItem('gcpbi_save'));
        playerName = savedData.name;
        currentMissionIndex = savedData.level;
        currentBonusTime = savedData.currentBonusTime || 0;
        
        if (savedData.scoreBoard) {
            scoreBoard = savedData.scoreBoard; 
        } else {
            scoreBoard = [];
            if (savedData.score > 0) {
                for(let i=0; i<currentMissionIndex; i++) {
                    scoreBoard[i] = { points: missions[i].points, badge: missions[i].badge };
                }
            }
        }
    } else {
        const nameInput = document.getElementById('playerNameInput').value.trim();
        if (nameInput === "") { alert("กรุณาพิมพ์ชื่อนักเรียนด้วยนะครับ!"); return; }
        playerName = nameInput;
        currentMissionIndex = 0;
        scoreBoard = [];
        currentBonusTime = 0;
    }
    document.getElementById('player-name').innerText = playerName;
    document.getElementById('nameModal').style.display = 'none';
    renderScoreAndBadges();
    loadMission();
}

function saveProgress() {
    localStorage.setItem('gcpbi_save', JSON.stringify({
        name: playerName,
        level: currentMissionIndex,
        scoreBoard: scoreBoard,
        currentBonusTime: currentBonusTime
    }));
}

function clearSaveData() {
    if(confirm("ยืนยันที่จะลบข้อมูลเพื่อเริ่มด่าน 1 ใหม่ทั้งหมด?")) {
        localStorage.removeItem('gcpbi_save');
        location.reload();
    }
}

function toggleManual() {
    const manual = document.getElementById('manualModal');
    manual.style.display = (manual.style.display === 'none' || manual.style.display === '') ? 'flex' : 'none';
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    const timerBox = document.getElementById('timer-box');
    timerBox.classList.remove('danger', 'paused');
    
    timerInterval = setInterval(() => {
        if (timeRemaining > 0 && !missionCompleted && !isPaused) {
            timeRemaining--;
            document.getElementById('time-display').innerText = formatTime(timeRemaining);
            if (timeRemaining <= 15) timerBox.classList.add('danger');
        } else if (timeRemaining === 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function pauseTimer() {
    if (!missionCompleted && timeRemaining > 0 && !isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
        document.getElementById('timer-box').classList.add('paused');
    }
}

function loadMission() {
    missionCompleted = false;
    isPaused = false;
    const mission = missions[currentMissionIndex];
    document.getElementById('mission-title-header').innerText = `ภารกิจที่ ${currentMissionIndex + 1}: ${mission.title}`;
    document.getElementById('mission-desc-header').innerHTML = `(${mission.desc})`;
    
    let rewardText = `(⏳ เวลาฐาน: ${mission.timeLimit}วิ`;
    if(currentBonusTime > 0) rewardText += ` <span style="color:#2ecc71;">+โบนัส ${currentBonusTime}วิ</span>`;
    rewardText += ` | 🌟 ${mission.points}แต้ม | ไอคอน: ${mission.badge})`;
    document.getElementById('mission-reward').innerHTML = rewardText;
    
    document.getElementById('mission-expected-output').innerHTML = mission.expectedOutput;
    
    timeRemaining = mission.timeLimit + currentBonusTime;
    document.getElementById('time-display').innerText = formatTime(timeRemaining);
    startTimer();
}

function retryMission() {
    resetWorkspace(); 
    missionCompleted = false;
    timeRemaining = missions[currentMissionIndex].timeLimit + currentBonusTime;
    document.getElementById('time-display').innerText = formatTime(timeRemaining);
    startTimer();
}

function switchCategory(cat, btnElement) {
    document.querySelectorAll('.toolbox-group').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.cat-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('cat-' + cat).classList.add('active');
    btnElement.classList.add('active');
}

function dragStart(event) {
    if (isPaused) { startTimer(); }
    dragged = event.target;
    event.dataTransfer.setData('text/plain', ''); 
    setTimeout(() => { dragged.classList.add('dragging'); }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    dragged = null;
}

document.querySelectorAll('.toolbox-group .block').forEach(b => {
    b.addEventListener('dragstart', dragStart);
    b.addEventListener('dragend', dragEnd);
});

const dz = document.getElementById('dz');
const hint = document.getElementById('hint');

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.block.in-workspace:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } 
        else { return closest; }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

dz.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(dz, e.clientY);
    const currentDragged = document.querySelector('.dragging');
    if (currentDragged && currentDragged.classList.contains('in-workspace')) {
        if (afterElement == null) { dz.appendChild(currentDragged); } 
        else { dz.insertBefore(currentDragged, afterElement); }
    }
});

dz.addEventListener('drop', e => {
    e.preventDefault();
    if (isPaused) { startTimer(); }
    if (hint) hint.style.display = 'none';
    if (dragged && !dragged.classList.contains('in-workspace')) {
        const clone = dragged.cloneNode(true);
        clone.classList.remove('dragging');
        clone.classList.add('in-workspace');
        clone.addEventListener('dragstart', dragStart); 
        clone.addEventListener('dragend', dragEnd);
        clone.ondblclick = function() { 
            this.remove(); 
            if(dz.querySelectorAll('.block.in-workspace').length === 0 && hint) { hint.style.display = 'block'; }
        };
        const afterElement = getDragAfterElement(dz, e.clientY);
        if (afterElement == null) { dz.appendChild(clone); } 
        else { dz.insertBefore(clone, afterElement); }
    }
});

function resetWorkspace() {
    dz.innerHTML = '';
    dz.appendChild(hint);
    hint.style.display = 'block';
    document.getElementById('output').innerHTML = "รอการประมวลผล... กดปุ่ม RUN เพื่อเริ่ม";
}

function renderScoreAndBadges() {
    totalScore = scoreBoard.reduce((sum, item) => sum + (item ? item.points : 0), 0);
    document.getElementById('score-display').innerText = totalScore;
    
    let latestBadge = "";
    for (let i = scoreBoard.length - 1; i >= 0; i--) {
        if (scoreBoard[i] && scoreBoard[i].badge) {
            latestBadge = scoreBoard[i].badge;
            break;
        }
    }
    document.getElementById('badges-container').innerHTML = latestBadge;
}

function nextMission() {
    document.getElementById('successModal').style.display = 'none';
    if (currentMissionIndex < missions.length - 1) {
        currentMissionIndex++;
        currentBonusTime = nextLevelBonus;
        nextLevelBonus = 0; 
        
        saveProgress();
        resetWorkspace();
        loadMission();
    } else {
        alert("🏆 สุดยอด! คุณพิชิตครบทั้ง 7 ภารกิจแล้ว! \nคะแนนรวมของคุณคือ: " + totalScore);
    }
}

function runCode() {
    if (missionCompleted) return;
    const blocks = dz.querySelectorAll('.block');
    const output = document.getElementById('output');
    const mission = missions[currentMissionIndex];
    let sequence = [];
    
    blocks.forEach(b => sequence.push(b.getAttribute('data-val')));
    output.innerHTML = ""; 
    
    if(sequence.length === 0) {
        output.innerHTML = "<span class='error-text'>Error: ยังไม่มีโค้ดเลยนะ</span>"; return;
    }

    const userSequence = sequence.join(',');
    
    // ตรวจสอบคำตอบหลัก
    let isCorrect = (userSequence === mission.answer.join(','));
    
    // ถ้าคำตอบหลักไม่ตรง ให้ลองเช็กคำตอบทางเลือก (ถ้ามี)
    if (!isCorrect && mission.alt_answers) {
        for (let i = 0; i < mission.alt_answers.length; i++) {
            if (userSequence === mission.alt_answers[i].join(',')) {
                isCorrect = true;
                break; // เจอคำตอบที่ถูกแล้ว หยุดหา
            }
        }
    }

    if(isCorrect) {
        missionCompleted = true;
        clearInterval(timerInterval);
        document.getElementById('timer-box').classList.remove('danger', 'paused');
        
        nextLevelBonus = timeRemaining > 0 ? timeRemaining : 0;
        let earnedBadge = timeRemaining > 0 ? mission.badge : "";
        
        let successDetails = `<p>ได้รับ <strong>${mission.points}</strong> คะแนน!</p>`;
        if (earnedBadge) {
            successDetails += `<p>🌟 โบนัสเวลา! รับไอคอน: <span style='font-size:24px'>${earnedBadge}</span></p>`;
            successDetails += `<p style='color:#2ecc71; font-weight:bold;'>⏰ นำเวลาที่เหลือ ${timeRemaining} วินาที ไปทบด่านหน้า!</p>`;
        } else {
            successDetails += `<p style='color:#e74c3c;'>⏰ หมดเวลาโบนัส (ไม่ได้ไอคอนและเวลาทบ)</p>`;
        }
        
        scoreBoard[currentMissionIndex] = { points: mission.points, badge: earnedBadge };
        renderScoreAndBadges();
        saveProgress();
        
        output.innerHTML = `<span style='color:#2ecc71; font-weight:bold;'>✔ คอมไพล์ผ่าน! (Compile Success)</span>`;
        
        document.getElementById('success-msg-details').innerHTML = successDetails;
        document.getElementById('successModal').style.display = 'flex';
    } else {
        output.innerHTML = "<span class='error-text'>Error: ลำดับบล็อกยังไม่ถูกต้อง ลองเทียบกับช่อง Expected Output อีกครั้งนะ</span>";
    }
}