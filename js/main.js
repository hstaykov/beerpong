var globalData = {
    players: [],
    results: []
}

var dbUrl = "https://beerpongtourtest.firebaseio.com/";


var currentGameId = guid();

$('.gameId').html("Game id : " + currentGameId);

function generateScheme(obj) {
    var saveData1 = {
        teams: obj.players,
        results: obj.results
    }


    var url = dbUrl + "games/" + currentGameId + "/";
    var firebaseRef = new Firebase(url);

    var currentGameData = {
        game: JSON.stringify(saveData1),
        name: "Igra"
    }

    firebaseRef.set(currentGameData);
    function saveFn(data, userData) {

        var json = JSON.stringify(data);
        console.log("----");
        console.log(json);
        var url = dbUrl + "games/" + currentGameId + "/game/";
        var firebaseRef = new Firebase(url);
        console.log(data);
        firebaseRef.set(json);
        $(".increment").remove();
        $(".decrement").remove();
    }



    $(function () {
        var container = $('div#save .demo')
        container.bracket({
            init: saveData1,
            save: saveFn,
            userData: saveData1
        })

        /* You can also inquiry the current data */
        var data = container.bracket('data');
        console.log(JSON.stringify(data));
        $('#dataOutput').text(JSON.stringify(data));
        $(".increment").remove();
        $(".decrement").remove();
        $("#allGames").remove();
        $("#gamesList").remove();
    })
}

$("#gen").click(function () {

    var players = [];
    $("input").each(function () {
        players.push($(this).val());
        console.log($(this).val());
    });

    $(".input_fields_wrap").remove();
    $("#gen").remove();
    $(".add_field_button").remove();
    $("#info").remove();
    //var players = ["Riceto", "Pesho", "Gosho", "Totiu", "Ravda", "Rila", "Putinka", "Genata", "Gecata", "asdasdasd", "Ico", "BaiHui", "Iaz"];

    //var ric = players.splice(0,1);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function closest(num, arr) {
        var curr = arr[0];
        var diff = Math.abs(num - curr);
        for (var val = 0; val < arr.length; val++) {
            if (num - arr[val] <= 0)
                return arr[val];
        }
        return curr;
    }

    var array = [2, 4, 8, 16, 32, 64];
    var s = players.length;
    var contests = closest(s, array);
    console.log("People for scheme: " + contests);
    console.log("current players: " + players.length);

    var myData = [];
    var results = [];
    for (var i = 0; i < contests / 2; i++) {

        var p1 = players.splice(getRandomInt(0, players.length - 1), 1)[0];
        var p2 = players.splice(getRandomInt(0, players.length - 1), 1)[0];
        var r1;
        var r2;
        if (!p1) {
            p1 = "служебно";
            r1 = 0;
        }
        if (!p2) {
            p2 = "служебно";
            if (r1 == 0)
                r2 = 1;
            else
                r2 = 0;
        }

        myData.push([p1, p2]);
        results.push([r1, r2]);
        globalData.players = myData;
        globalData.results = results;
        //console.log(p1 + ":" + p2);
    }
    //		console.log(myData);
    generateScheme(globalData);
});

$("#another").click(function () {
    location.reload();
});

$(document).ready(function () {
    var max_fields = 16; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
            $("#playersCount").html("Current players: " + x);
        }
    });

    $(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
        $("#playersCount").html("Current players: " + x);
    })
});

var getCurrentTime = function () {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

    if (minutes < 10)
        minutes = "0" + minutes;

    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}


$(function () {
    var url = dbUrl + "logins/";
    var firebaseRef = new Firebase(url);
    var userIp;
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
        function (json) {
            userIp = json.ip;
            //    document.write("My public IP address is: ", json.ip);
            firebaseRef.push(getCurrentTime() + " - " + userIp + " - " + navigator.userAgent);
        }
        );
});


$("#allGames").click(showAllGames);
function showAllGames(params) {
    var url = dbUrl + "games/";
    var firebaseRef = new Firebase(url);
    firebaseRef.once('value', function (dataSnapshot) {
        var ul = $("#gamesList");
        for (var key in dataSnapshot.val()) {
            var value = dataSnapshot.val()[key];
            ul.append("<a  style='cursor: pointer' class='remove_field aGame' id='" + key + "'>" + key + "</a></br>")
        }

        $(".aGame").click(function () {
            console.log("FLIC");
            var id = $(this).attr('id');
            var url = dbUrl + "games/" + id + "/game";
            var firebaseRef = new Firebase(url);
            firebaseRef.once('value', function (dataSnapshot) {

                var game = dataSnapshot.val();
                var init = JSON.parse(game);
                $("#allASD").remove();
                $('.gameId').html("Game id : " + id);
                $("#allGames").remove();
                var container = $('div#save .demo')
                container.bracket({
                    init: init
                });

            });
        });
    });
}



function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}