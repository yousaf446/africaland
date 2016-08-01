var map;
var infowindow;
var geocoder = new google.maps.Geocoder();
var suggestions = [];
var w3w_key = "ABN6G5I3";
var selectedID = "";
var pyrmont = {lat: -33.867, lng: 151.195};
function loadMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();

    var search = document.getElementById('search');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(search);
    reverseGeoCode3Words(pyrmont);
}

function googleSuggestions() {
    var saveSuggestions = function(predictions, status) {
        if(predictions != undefined) {
            predictions.forEach(function (prediction) {
                var id = suggestions.length;
                suggestions[id] = {};
                suggestions[id].name = prediction.description;
                suggestions[id].value = prediction.description;
                suggestions[id].id = id;
                suggestions[id].icon = "google-maps.png";
                suggestions[id].src = "google-maps";
            });
        }
        what3wordsSuggestions();
    };
    var input = document.getElementById('search-input').value;
    var service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: input }, saveSuggestions);
}

function geocodeAddress() {
    var address = document.getElementById('search-input').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}

function what3wordsSuggestions() {
    var input = document.getElementById('search-input').value;
    $.get("https://api.what3words.com/v2/autosuggest?addr="+input+"&lang=en&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
            if(response.suggestions != undefined) {
                console.log(response.suggestions);
                response.suggestions.forEach(function (suggestion) {
                    var id = suggestions.length;
                    suggestions[id] = {};
                    suggestions[id].name = suggestion.words;
                    suggestions[id].value = suggestion.words;
                    suggestions[id].id = id;
                    suggestions[id].icon = "w3w.png";
                    suggestions[id].src = "w3w";
                    suggestions[id].geometry = suggestion.geometry;
                });
            }
            displaySuggestions();
        }
    });
}

function findSuggestions() {
    for(var i in suggestions) {
        suggestions[i] = null
    }
    suggestions.length = 0;
    googleSuggestions();
    //what3wordsSuggestions();
}

function displaySuggestions() {
    console.log(suggestions);
    var $project = $('#search-input');

    $project.autocomplete({
        minLength: 0,
        source: suggestions,
        focus: function( event, ui ) {
            $project.val( ui.item.name );
            return false;
        },
        select: function(event, ui) {
            selectedID = ui.item;
        }
    });

    $project.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        var $li = $('<li>'),
            $img = $('<img>');


        $img.attr({
            src: 'images/' + item.icon,
            alt: item.name,
            height: '16px',
            width: '16px'

        });

        $li.attr('data-value', item.name);
        $li.append('<a href="#">');
        $li.find('a').append($img).append(item.name);

        return $li.appendTo(ul);
    };
}

function filterSuggestion() {
    if(selectedID.src == "google-maps") {
        geocodeAddress();
    } else {
        map.setCenter(selectedID.geometry);
        var marker = new google.maps.Marker({
            map: map,
            position: selectedID.geometry
        });
    }
}

function reverseGeoCode3Words(location) {
    var coords = location.lat+","+location.lng;
    $.get("https://api.what3words.com/v2/reverse?coords="+coords+"&display=full&format=json&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
          $("#3-words").html(response.words);
        }
    });

}



google.maps.event.addDomListener(window, 'load', loadMap);