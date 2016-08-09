<HTMl>
<head>

    <link href="http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.min.css" rel="stylesheet" type="text/css" />

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!-- Custom Css -->
    <link rel="stylesheet" href="style.css">
    </head>
<body>
<?php include_once 'header.php'; ?>
<div id="map"></div>
<div id="open-street-map"></div>
<div class="col-lg-4 search-top-pad" id="search">
    <div class="input-group">
        <input type="text" class="form-control" id="search-input" placeholder="Search" onkeyup="findSuggestions()">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" onclick="filterSuggestion()">Go!</button>
      </span>
      <span class="input-group-btn left-pad">
          <a href="#" class="btn btn-info" data-toggle="popover" data-container="body" data-placement="right" data-html="true">
              <span class="glyphicon glyphicon-question-sign"></span>
          </a>
      </span>
    </div><!-- /input-group -->

    <br/>
    <div class="alert alert-info" id="not-found" style="display:none">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry</strong><p> We couldn't find any results for</p><br/><b id="input-string"></b>
    </div>
</div><!-- /.col-lg-6 -->
<div id="pin-btns">
    <button class="btn btn-primary" id="lock-btn" onclick="PinDragCheck(true, 'front')">Lock Pin</button>
    <button class="btn btn-primary" style="display:none" id="unlock-btn" onclick="PinDragCheck(false, 'front')">UnLock Pin</button>
    <br/>
    <button class="btn btn-primary find-top-margin" style="display:none" id="find-btn" onclick="setPinCenter()">Find Pin</button>
</div>
<div class="panel panel-default panel-fix-bottom col-md-12" id="3-words-panel">
    <div class="panel-heading panel-heading-background-image" role="tab" id="headingOne">
        <h4 class="panel-title panel-title-text">
            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" id="3-words" aria-controls="collapseOne">
            </a>
        </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
        <div class="panel-body" id="3-words-body">
            <button class="btn btn-default col-md-12" onclick="getDirections()">Get Directions</button>
        </div>
    </div>
</div>
<div id="popover-content" class="hide">
    <strong>Search for anything at all, for example:</strong><br>
    <a href="limit.broom.flip" class="example">limit.broom.flip <span class="red-emp">3 words</span></a><br>
    <a href="Notting Hill, London" class="example">Notting Hill, London <span class="red-emp">any location</span></a>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="langModal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Change Language</h4>
            </div>
            <div class="modal-body">
                <label Select Language></label><select class="control-label" id="langCombo"></select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="saveLanguage()">Save Language</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

</body>

<!-- Latest compiled and minified JQuery -->
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>

<!-- Latest compiled and minified Bootstrap JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyA7xY6JgrR-hAOLs1ZmZU9vCoFNb_YQ7qI"></script>

<script type="text/javascript" src="grid.js"></script>

<script type="text/javascript" src="script.js"></script>
</HTMl>
