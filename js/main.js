var globalData = {
    players: [],
    results: []
}

var dbUrl = "https://beerpongtourtest.firebaseio.com/";
var currentPlayersCount = 1;
var currentGameName = "Niakakva igra";
var currentGameId = guid();
var max_fields = 32;



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
        name: currentGameName,
        time: new Date().getTime()
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

    if (!$("#gameName").val()) {
        currentGameName = "Nova igra";
    }
    else {
        currentGameName = $("#gameName").val();
    }
    $(".gameName").html("Game name: " + currentGameName);
    $("#gameName").remove();

    var players = [];
    $("input").each(function () {
        players.push($(this).val());
        console.log($(this).val());
    });

    $(".input_fields_wrap").remove();
    $("#gen").remove();
    $(".add_field_button").remove();
    $("#info").show('slow');
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

var wrapper = $(".input_fields_wrap");
function addNewField() {
    if (currentPlayersCount < max_fields) { //max input box allowed
        currentPlayersCount++; //text box increment

        var $newFiled = $('<div style="display: none;"><input type="text"  id= "' + currentPlayersCount + '" class="playerName" placeholder="Player/Team" /><a href="#" class="remove_field">Remove</a></div>');
        $(wrapper).append($newFiled);
        $newFiled.show("fast"); //add input box
        $(".playerName").keypress(function (e) {
            if (e.which == 13 && $(this).val()) {
                //addNewField(wrapper);
            }
        });

        $("#playersCount").html("Current players: " + currentPlayersCount);
    }
}

$(document).ready(function () {

    var add_button = $(".add_field_button"); //Add button ID
    
    (add_button).click(function (e) { //on add input button click
        e.preventDefault();
        addNewField(wrapper);

    });

    $(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        currentPlayersCount--;
        $("#playersCount").html("Current players: " + currentPlayersCount);
    })
});

var convertTime = function (currentDate) {
    //var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    //var currentTime = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

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
            //    documentsdasdsa.write("My public IP address is: ", json.ip);
            firebaseRef.push(convertTime(new Date()) + " - " + userIp + " - " + navigator.userAgent);
        }
        );
});


$("#allGames").click(showAllGames);
function showAllGames(params) {
    var url = dbUrl + "games/";
    var firebaseRef = new Firebase(url);
    firebaseRef.once('value', function (dataSnapshot) {
        var ul = $("#gamesList");
        var sorted = [];
        for (var key in dataSnapshot.val()) {
            var value = dataSnapshot.val()[key];
            sorted.push({value:value, key:key});
        }

        sorted.sort(function (a, b) {
            return b.value.time - a.value.time;
        });

        //console.log(sorted);
        for (var i = 0; i < sorted.length; i++) {
            //console.log(sorted[i].value.time);
            ul.append("<a  style='cursor: pointer' class='remove_field aGame' id='" + sorted[i].key + "'>" + sorted[i].value.name + " - " + convertTime(new Date(sorted[i].value.time)) + "</a></br>")
        }

        // for (var key in dataSnapshot.val()) {
        //     var value = dataSnapshot.val()[key];
        //     //   console.log(value.name + " - " + value.time);
        //     ul.append("<a  style='cursor: pointer' class='remove_field aGame' id='" + key + "'>" + value.name + " - " + convertTime(new Date(value.time)) + "</a></br>")
        // }

        $(".aGame").click(function () {

            var id = $(this).attr('id');
            var url = dbUrl + "games/" + id + "/game";
            var firebaseRef = new Firebase(url);
            firebaseRef.once('value', function (dataSnapshot) {

                var game = dataSnapshot.val();
                var init = JSON.parse(game);
                $("#allASD").remove();
                $('.gameId').html("Game id : " + id);
                $("#allGames").remove();
                $("#gameName").remove();
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