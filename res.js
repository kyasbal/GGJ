const data = window.location.search;
window.onload = function() {
    var score;
    var hina;
    data.substr(1).split("&").forEach(function(v) {
        const w = v.split('=');
        var p;
        if ((p = document.getElementById("count-" + w[0])) !== null) {
            p.innerHTML = w[1];
            if(p.id !== "count-score"){
            if(p.id === "count-turtle" || p.id === "count-yacht"){
              if(w[1] > 0){
                p.className = "minus"
              }
            }else{
              if(w[1] > 0){
                p.className = "plus"
              }
            }
          }
        };
        if (w[0] === "hina") {
            hina = w[1];
            const imageList = document.getElementsByClassName('seagull');
            for (var i = 0; i < w[1]; i++) {
                imageList[i].style.visibility = 'visible';
            }
        }
        if (w[0] === "score") {
            score = w[1];
        }
    });
    const twitterText = document.getElementsByClassName('twitter-share-button')[0];
    console.log(twitterText);
    twitterText.setAttribute("data-text", `${hina} birds was hatched! I got ${score} pts!`);
}
