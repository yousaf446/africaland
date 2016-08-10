var map;
var marker;
var infowindow;
var geocoder = new google.maps.Geocoder();
var suggestions = [];
var w3w_key = "LKJ3X9BQ";
var selectedID = "";
var pyrmont = {lat: -33.867, lng: 151.195};
var mapType = 'map';
var contextmenuDir;
var pinDrag = false;
var destination;
var language = "en";
var language_array = [];
function loadMap() {

    var mapTypeStyle = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
    if (window.mobilecheck())
        mapTypeStyle = google.maps.MapTypeControlStyle.DROPDOWN_MENU;

    if (mapType == 'map') initType = google.maps.MapTypeId.ROADMAP;
    if (mapType == 'satellite') initType = google.maps.MapTypeId.HYBRID;
    if (mapType == 'esri-topo') initType = 'esri-topo';
    if (mapType == 'esri-imagery') initType = 'esri-imagery';
    if (mapType == 'mapbox') initType = 'mapbox';
    if (mapType == 'osm') initType = 'osm';

    var mapTypeIds = [];
    for (var type in google.maps.MapTypeId)
        mapTypeIds.push(google.maps.MapTypeId[type]);

    mapTypeIds.push('osm');
    var streetViewEnable = (window.innerWidth > 1025) ? true : false;
    var mapOptions = {
        center: pyrmont,
        zoom: 15,
        mapTypeId: initType,
        mapTypeControlOptions: {
            mapTypeIds: mapTypeIds,
            style: mapTypeStyle
        },
        streetViewControl: streetViewEnable,
        disableDoubleClickZoom: false,
        tilt: 0,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
    };

    google.maps.visualRefresh = true;

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv());

    var mark_image = new google.maps.MarkerImage(
        "images/map-marker.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(64, 64)
    );
    marker = new google.maps.Marker({
        map: map,
        visible: false,
        icon: mark_image,
        position: pyrmont
    });
    destination = pyrmont.lat + "," + pyrmont.lng;
    infowindow = new google.maps.InfoWindow();

    var search = document.getElementById('search');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(search);

    var pin_btns = document.getElementById('pin-btns');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(pin_btns);

    map.attributionControl = document.createElement('div');
    map.attributionControl.id = 'attribution-control';
    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(map.attributionControl);

    reverseGeoCode3Words(pyrmont);

    var osmMapType = new google.maps.ImageMapType({
        alt: 'OpenStreetMap',
        getTileUrl: function(coord, zoom) {
            var load = Math.floor((Math.random() * 3) + 1);
            var s = 'a';
            switch (load) {
                case 1:
                    s = 'a'
                    break;
                case 2:
                    s = 'b';
                    break;
                case 3:
                    s = 'c';
                    break;
                default:
                    s = 'a';
                    break;
            }
            return '//'+s+'.tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 0,
        maxZoom: 19,
        name: 'OpenStreetMap'
    });
    osmMapType.set('attribution', 'Tiles <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC BY-SA</a> &mdash; Map data &copy; <a href="//www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>');
    map.mapTypes.set('osm', osmMapType);

    google.maps.event.addListener(map, 'maptypeid_changed', function() {
        updateOverlays();
        updateAttribution();
    });

    google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});

    google.maps.event.addListener(map, "zoom_changed",function(event){
        if(!pinDrag) {
            reverseGeoCode3WordsGMaps(this.getCenter());
            checkFindPin(this.getBounds());
        }
    });

    google.maps.event.addListener(map, "dragend",function(event){
        if(!pinDrag) {
            reverseGeoCode3WordsGMaps(this.getCenter());
            checkFindPin(this.getBounds());
        }
    });

    getLanguages();

    grid = new Graticule(map);
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
    service.getQueryPredictions({ input: input, language: language }, saveSuggestions);
}

function geocodeAddress() {
    var address = document.getElementById('search-input').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            reverseGeoCode3WordsGMaps(results[0].geometry.location);
            destination = results[0].geometry.location.lat() + "," + results[0].geometry.location.lng();
        }
    });
}

function what3wordsSuggestions() {
    var input = document.getElementById('search-input').value;
    $.get("https://api.what3words.com/v2/autosuggest?addr="+input+"&lang="+language+"&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
            if(response.suggestions != undefined) {
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

function findSuggestions(event) {
    for(var i in suggestions) {
        suggestions[i] = null
    }
    suggestions.length = 0;
    googleSuggestions();
    if(event.keyCode == 13){
        $( "#go-btn" ).trigger( "click" );
    }
    //what3wordsSuggestions();
}

function displaySuggestions() {
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
        var find = false;
        for(var i in suggestions) {
            if(suggestions[i].name == selectedID.name)
                find = true;
        }
        if(find) {
            plotMarker(selectedID.geometry);
        } else {
            var input = document.getElementById('search-input').value;
            var geometry = forwardGeoCode3Words(input);
        }
    }
}

function plotMarker(geometry) {
    map.setCenter(geometry);
    marker.setPosition(geometry);
    destination = geometry.lat() + "," + geometry.lng();
}

function plotMarkerW3W(geometry) {
    if(!pinDrag) {
        map.setCenter(geometry);
        marker.setPosition(geometry);
    }
    destination = geometry.lat + "," + geometry.lng;
}

function reverseGeoCode3Words(location) {
    var coords = location.lat+","+location.lng;
    $.get("https://api.what3words.com/v2/reverse?coords="+coords+"&display=full&format=json&lang="+language+"&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
          $("#3-words").html(response.words);
            updateFoot(response.words);
        }
    });

}

function reverseGeoCode3WordsGMaps(location) {
    var coords = location.lat()+","+location.lng();
    $.get("https://api.what3words.com/v2/reverse?coords="+coords+"&display=full&format=json&lang="+language+"&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
            $("#3-words").html(response.words);
            updateFoot(response.words);
            plotMarkerW3W(location);
            //document.getElementById('search-input').value = response.words;
        }
    });

}

function PlacePin(lat, lng) {
    var location = new google.maps.LatLng(lat, lng);
    reverseGeoCode3WordsGMaps(location);
    if(pinDrag) {
        marker.setPosition(location);
    }
    else {
        map.setCenter(location);
    }
    contextmenuDir.style.visibility = "hidden";
}

function PinDragCheck(check, end) {
    pinDrag = check;
    if(end != 'front') end = 'back';
    if(pinDrag) {
        $("#menu2").hide();
        $("#menu3").show();
        $("#unlock-btn").show();
        $("#lock-btn").hide();
        marker.setPosition(map.getCenter());
        marker.setVisible(true);
        $('#map div.centerMarker').remove();
    } else {
        $("#menu2").show();
        $("#menu3").hide();
        $("#lock-btn").show();
        $("#unlock-btn").hide();
        $('<div/>').addClass('centerMarker').appendTo(map.getDiv());
        marker.setVisible(false);
        map.setCenter(marker.getPosition());
    }
    if(end == 'back')
        contextmenuDir.style.visibility = "hidden";
}

function HideContextMenu() {
    contextmenuDir.style.visibility = "hidden";
}

function forwardGeoCode3Words(address) {
    $.get("https://api.what3words.com/v2/forward?addr="+address+"&display=full&format=json&lang="+language+"&key="+w3w_key, function(response) {
        if(response.status.status == "200") {
            if(response.geometry != undefined) {
                updateFoot(address);
                plotMarkerW3W(response.geometry);
                $("#not-found").hide();
            } else {
                $("#input-string").html(address);
                $("#not-found").show();
            }
        }
    });

}

function closeNotFound() {
    $("#not-found").hide();
}

function updateOverlays() {
    var id = map.getMapTypeId();
    if (map.overlayMapTypes.getLength() > 0) {
        map.overlayMapTypes.clear();
    }

    map.setOptions({ streetViewControl: (id == 'roadmap' || id == 'hybrid') });
};

function updateAttribution() {
    var mapId = map.getMapTypeId();
    var attribution = '';
    if (map.mapTypes.hasOwnProperty(mapId)) {
        attribution = map.mapTypes[mapId].get('attribution');
        if(attribution === undefined) {
            attribution = '';
        }
    }
    map.attributionControl.innerHTML = attribution;
};

function updateFoot(words) {
    $("#3-words").html(words);
}

window.mobilecheck = function() {
    var check = false;
    (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function showContextMenu(currentLatLng) {
    var projection;
    projection = map.getProjection() ;
    $('.contextmenu').remove();
    contextmenuDir = document.createElement("div");
    contextmenuDir.className  = 'contextmenu';
    var content = '<a id="menu1" href="javascript:void(0)" onclick="PlacePin('+currentLatLng.lat()+','+currentLatLng.lng()+')"><div class="context">Place Pin Here<\/div><\/a>';
    if(!pinDrag) content += '<a id="menu2"><div class="context" href="javascript:void(0)" onclick="PinDragCheck(true)">Lock Pin<\/div><\/a>';
    else content += '<a id="menu3" href="javascript:void(0)" onclick="PinDragCheck(false)"><div class="context">UnLock Pin<\/div><\/a>';
    content += '<a id="menu4" href="https://www.google.com/maps?saddr=My+Location&daddr='+destination+'" onclick="HideContextMenu()" target="_blank"><div class="context">Directions To Pin<\/div><\/a>';
    content += '<a id="menu5" href="javascript:void(0)" data-toggle="modal" data-target="#langModal" onclick="HideContextMenu()"><div class="context">Change Language<\/div><\/a>';

    contextmenuDir.innerHTML = content;
    $(map.getDiv()).append(contextmenuDir);

    setMenuXY(currentLatLng);

    contextmenuDir.style.visibility = "visible";
    destination = currentLatLng.lat() + "," + currentLatLng.lng();
}

function getCanvasXY(currentLatLng){
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(currentLatLng);
    var currentLatLngOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return currentLatLngOffset;
}

function setMenuXY(caurrentLatLng){
    var mapWidth = $('#map_canvas').width();
    var mapHeight = $('#map_canvas').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(caurrentLatLng);
    var x = clickedPosition.x ;
    var y = clickedPosition.y ;

    if((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
        x = x - menuWidth;
    if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
        y = y - menuHeight;

    $('.contextmenu').css('left',x  );
    $('.contextmenu').css('top',y );
}

function getDirections() {
    window.open("https://www.google.com/maps?saddr=My+Location&daddr="+destination, "_blank");
}

function getLanguages() {
    $.get("https://api.what3words.com/v2/languages?format=json&key="+w3w_key, function(response) {
        language_array = response.languages;
        var lang_combo = "<option value=''>Select One</option>";
        var dropdown = "";
        var specialClass = "";
        var selected = "";

        for(var i in language_array) {
            if(language_array[i].code == 'en') {
                specialClass = 'active';
                selected = "selected";
            } else {
                specialClass = "";
                selected = "";
            }
            lang_combo += "<option value='"+language_array[i].code+"' "+selected+">"+language_array[i].name+"</option>";
            dropdown += "<li class='"+specialClass+"' id='lang_"+i+"'><a href='javascript:void(0)' onclick='saveLanguageDropDown("+i+")'>"+language_array[i].name+"</a></li>";
        }

        $("#langCombo").html(lang_combo);
        $("#langDropDown").html(dropdown);
    });
}
function saveLanguage() {
    language = $("#langCombo").val();
    reverseGeoCode3WordsGMaps(map.getCenter());
    $("#langModal").modal('hide');
    contextmenuDir.style.visibility = "hidden";
    for(var i in language_array) {
        if(language_array[i].code == language) {
            $("#lang_"+i).addClass("active");
        } else {
            $("#lang_"+i).removeClass("active");
        }
    }
}

function saveLanguageDropDown(count) {
    for(var i in language_array) {
        $("#lang_"+i).removeClass("active");
    }
    $("#lang_"+count).addClass("active");
    $("#langCombo").val(language_array[count].code);
    language = language_array[count].code;
    reverseGeoCode3WordsGMaps(map.getCenter());
}

function checkFindPin() {
    if(map.getBounds().contains(marker.getPosition())) {
        $("#find-btn").hide();
    } else {
        $("#find-btn").show();
    }
}

function setPinCenter() {
    marker.setPosition(map.getCenter());
}


$(document).ready(function(){
    $('[data-toggle="popover"]').popover({
        html: true,
        content: function() {
            return $('#popover-content').html();
        }
    });
});

google.maps.event.addDomListener(window, 'load', loadMap);