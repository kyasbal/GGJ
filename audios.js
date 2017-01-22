const Audios = {
    dobon: new Howl({
        src: ['./audio/dobon.mp3'],
        volume: 0.5,
        onend: function () {
            isDobonPlaying = false;
        }
    }),
    piyopiyo: new Howl({
        src: ['./audio/chick-cry1.mp3'],
        volume: 0.5,
    }),
    wind: new Howl({
        src: ['./audio/wind.mp3'],
        loop: true,
        volume: 0.5
    }),
    shipCollision: new Howl({
        src: ['./audio/shipCollision.mp3'],
        volume: 0.5
    }),
    timeup: new Howl({
        src: ['./audio/timeup.mp3'],
        volume: 0.5
    }),
    countdown: new Howl({
        src: ['./audio/countdown.mp3'],
        volume: 0.5
    }),
    kame: new Howl({
        src: ['./audio/kame.mp3'],
        volume: 0.5
    })
};
