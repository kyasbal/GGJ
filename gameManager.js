function GameManager() {
    this.timer = new Timer();
    this.timeLimit = 60;
    this.endGameHandlers = [];
}



GameManager.prototype.gameStart = function () {
    this.timer.reset();
    var self = this;
    var stopId = setInterval(function () {
        var ct = self.timer.getTime();
        $(".time-text").text((self.timeLimit - ct / 1000).toFixed(1));
        if (self.timeLimit * 1000 < ct) {
            clearInterval(stopId);
            self.endGameHandlers.forEach(function (h) {
                h();
            })
        }
    }, 1000 / 60)
}

GameManager.prototype.addOnEndGameHandler = function (handler) {
    this.endGameHandlers.push(handler);
}
