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
<div class="col-lg-4 search-top-pad" id="search">
    <div class="input-group">
        <input type="text" class="form-control" id="search-input" placeholder="Search" onkeyup="findSuggestions()">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" onclick="filterSuggestion()">Go!</button>
      </span>
    </div><!-- /input-group -->
</div><!-- /.col-lg-6 -->
<div class="panel panel-default panel-fix-bottom col-md-12" id="3-words-panel">
    <div class="panel-heading panel-heading-background-image" role="tab" id="headingOne">
        <h4 class="panel-title panel-title-text">
            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" id="3-words" aria-controls="collapseOne">
            </a>
        </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
        <div class="panel-body" id="3-words-body">
        </div>
    </div>
</div>
</body>

<!-- Latest compiled and minified JQuery -->
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>

<!-- Latest compiled and minified Bootstrap JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyA7xY6JgrR-hAOLs1ZmZU9vCoFNb_YQ7qI"></script>

<script type="text/javascript" src="script.js"></script>
</HTMl>
