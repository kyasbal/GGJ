function GameManager() {
    this.timeLimit = 60;
    this.timer = new Timer();
    this.endGameHandlers = [];
    this.onScoreChangeHandler = function () {};
    this.onChangeTime = function () {};
    this.score = 0;
    this.maxScoreList = [100, 200, 300, 400, 500];
    this.itemManager = new ItemManager();
    this.currentHina = 0;
    this.timetable = [];
    this.takenItems = {};
    this.commbo = 0;
    this.onchangeSecond = function () {};
    this.itemFreq = 300;
}
GameManager.prototype.addTimetable = function (second, callback) {
    if (!Array.isArray(this.timetable[second])) {
        this.timetable[second] = [];
    }
    this.timetable[second].push(callback);
}
GameManager.prototype.addScore = function (scoreItem) {
    // logging score
    const itemName = scoreItem.node.name.name;
    if (this.takenItems[itemName] === void 0) {
        this.takenItems[itemName] = 0;
    }
    this.takenItems[itemName]++;

    // update score.
    const score = scoreItem.getAttribute("score");
    if (score > 0) {
        this.commbo++;
    } else {
        this.commbo = 0;
    }
    this.score = Math.max(0, score + this.score);
    if (this.score >= this.maxScoreList[this.currentHina]) {
        this.score -= this.maxScoreList[this.currentHina];
        this.currentHina++;
        this.onHinaGrown(this.currentHina, this.currentHina === this.maxScoreList.length);
    }
    this.onScoreChangeHandler(this.score, this.currentHina === this.maxScoreList.length);
};
GameManager.prototype.currentMaxScoreStr = function () {
    if (this.currentHina === this.maxScoreList.length) {
        return "∞";
    }
    return this.maxScoreList[this.currentHina]
}
GameManager.prototype.time = function () {
    return this.timer.getTime()
}
GameManager.prototype.init = function () {
    console.log("initilize game manager.");
    if (this._initialized) {
        console.error("GM init calld twice");
        return;
    }
    this._initialized = true;
    this.itemManager.register("apple", 100);
    this.itemManager.register("yacht", 50);
    this.itemManager.register("fish", 50);
    this.itemManager.register("lotusRoot", 100);
    this.itemManager.register("turtle", 100);
    this.itemManager.register("carrot", 100);
}
GameManager.prototype.gameStart = function () {
    this.timer.reset();
    var self = this;
    var lastLeaveTime = -1;

    // time management.
    var stopId = setInterval(function () {
        var ct = self.timer.getTime();
        var leaveTime = Math.ceil(self.timeLimit - ct / 1000);
        $(".time-text").text(leaveTime);
        if (self.timeLimit * 1000 < ct) {
            clearInterval(stopId);
            Audios.timeup.play()
            self.endGameHandlers.forEach(function (h) {
                h();
            })
            return;
        }
        if (lastLeaveTime !== leaveTime) {
            self.onchangeSecond();
            lastLeaveTime = leaveTime;
            var timetableEvents = self.timetable[leaveTime];
            if (timetableEvents) {
                console.log(`timetable execute: ${leaveTime}`);
                timetableEvents.forEach(function (e) {
                    e();
                });
            }
        }
        self.onChangeTime(ct, leaveTime);
    }, 100);

    //start gen items.
    self._itemGen = true;
    var putting = function () {
        self.itemManager.randomPut();
        if (self._itemGen) {
            setTimeout(putting, Math.random() * self.itemFreq);
        }
    }
    putting();
}
GameManager.prototype.stopGenItem = function () {
    this._itemGen = false;
}
GameManager.prototype.addOnEndGameHandler = function (handler) {
    this.endGameHandlers.push(handler);
}
