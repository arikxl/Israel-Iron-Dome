setTimeout(() => {
    let gameOver = false;
    if (document.getElementById("missile-game")) {
        alert("Game already running!");
        return;
    }

    const gameContainer = document.createElement("div");
    gameContainer.id = "missile-game";
    document.body.appendChild(gameContainer);

    const timerDisplay = document.createElement("div");
    timerDisplay.id = "missile-timer";
    timerDisplay.textContent = "⏱️ 30";
    gameContainer.appendChild(timerDisplay);

    let timeLeft = 30;
    let missileInterval = setInterval(spawnMissile, 800);
    let timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏱️ ${timeLeft}`;
        if (timeLeft <= 0) endGame();
    }, 1000);

    function spawnMissile() {
        const missile = document.createElement("img");
        missile.src = chrome.runtime.getURL("rocket.png");
        missile.className = "missile";
        missile.style.left = `${Math.random() * 90}%`;
        missile.style.top = `-100px`;

        gameContainer.appendChild(missile);

        let pos = -100;
        const fall = setInterval(() => {
            pos += 3;
            missile.style.top = `${pos}px`;
            if (pos > window.innerHeight - 60) {
                missile.remove();
                clearInterval(fall);
                if (!gameOver) {
                    flashRedScreen(); // רק אם המשחק עדיין פעיל
                }
            }
            
        }, 20);

        missile.onclick = () => {
            const boom = new Audio(chrome.runtime.getURL("boom.wav"));
            boom.play();
            missile.remove();
            clearInterval(fall);
        };
    }


    function flashRedScreen() {
        const flash = document.createElement("div");
        flash.style.position = "fixed";
        flash.style.top = 0;
        flash.style.left = 0;
        flash.style.width = "100%";
        flash.style.height = "100%";
        flash.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        flash.style.zIndex = 9999999;
        flash.style.pointerEvents = "none";
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
        }, 500); // חצי שניה
    }
    
    function endGame() {
        clearInterval(timer);
        clearInterval(missileInterval);
        gameOver = true;

        // הסרת טילים
        const missiles = document.querySelectorAll(".missile");
        missiles.forEach((m) => m.remove());

        // הודעת ניצחון
        const winMsg = document.createElement("div");
        winMsg.className = "win-message";
        winMsg.innerText = "🎉 !הצלחת להגן על ישראל ✡️";
        gameContainer.appendChild(winMsg);

        // כפתור השתקה
        const muteButton = document.createElement("button");
        muteButton.innerText = "🔇 Mute Sound";
        muteButton.style.marginTop = "20px";
        muteButton.style.fontSize = "16px";
        muteButton.style.padding = "8px 12px";
        muteButton.style.cursor = "pointer";
        muteButton.style.backgroundColor = "rgba(0,0,0,0.6)";
        muteButton.style.border = "none";
        muteButton.style.color = "white";
        muteButton.style.borderRadius = "8px";
        muteButton.style.position = "absolute";
        muteButton.style.top = "calc(40% + 90px)";
        muteButton.style.left = "50%";
        muteButton.style.transform = "translateX(-50%)";
        muteButton.style.zIndex = 1000002;

        let victoryAudio = new Audio(chrome.runtime.getURL("victory.m4a"));

        muteButton.onclick = () => {
            if (!victoryAudio.paused) {
                victoryAudio.pause();
                // victoryAudio.currentTime = 0;
                muteButton.innerText = "🔊 Unmute";
                muteButton.style.display = "none";
            } else {
                victoryAudio.play();
                muteButton.innerText = "🔇 Mute Sound";
            }
        };

        gameContainer.appendChild(muteButton);

        // ניגון הסאונד אחרי שהכפתור כבר מופיע
        victoryAudio.play();

        setTimeout(() => gameContainer.remove(), 50000);
    }
      
      
}, 50); // 🕒 הרצה לאחר 50ms
  