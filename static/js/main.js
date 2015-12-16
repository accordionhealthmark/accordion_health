
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
  });

$(document).ready(function() {
  //Select/Option data
  var variableObj = {
    'gender': '% of Male Providers', 
    'is_sole': '% of Sole Proprietor',
    'entity_type': '% of Organzations'
  };

  var mapTypeObj = {
    'state_id': 'State',
    'county_id': 'County'
  };

  var barPlotObj = {
    'name_prefix_freq': 'Name Prefix',
    'provider_credentials_freq': 'Credentials'
  };

  // Create a select container for selecting map data. 
  // Form was not created since this data will not be retrieved from 
  // a database in the current implementation.
  $selectContainer = $("<div id='select-container' style='display:none;'></div>");
  $selectContainer.append(createSelect('variable-select', variableObj));
  $selectContainer.append('<span id="select-text">by</span>');
  $selectContainer.append(createSelect('map-select', mapTypeObj));
  $selectContainer.append('<button class="form-submit btn">Submit</button>')
  $('#main-container').prepend($selectContainer);
  $('.chart').append(createSelect('chart-select', barPlotObj))

  createMap(State_is_sole)
  createBarPlot(name_prefix_freq)

  //Initial title values that get changed on data change.
  mapTitle = '% of Male Providers by State'
  barPlotTitle = 'Provider Name Prefix Frequency'
  
  //When select option is changed for bar plot.
  //1. Remove previous plot
  //2. Assign new name
  //3. Invoke createBarPlot that creates bar plot
  $('.chart-select').change(function() {
    $('.chart svg').remove();
    barPlotTitle = 'Provider ' + $('.chart-select option:selected').text() + ' Frequency';
    $('.title').text(barPlotTitle);
    createBarPlot(eval($('.chart-select option:selected').val()))
  })
  
  //When user request a certain map
  //1. Grab metric and map type from select elements
  //2. Grab variable name and map type and concat to refer to JSON file with
  //   correct data
  //3. Create bar plot and redefine title based on variable and map type
  $('.form-submit').on('click', function(){
    $('.map svg').remove()
    var metric = $('.variable-select option:selected').val();
    var mapType = $('.map-select option:selected').text();
    var jsonData = eval(mapType + "_" + metric);
    createMap(jsonData);
    mapTitle = $('.variable-select option:selected').text() + ' by ' + jsonData['map_type'] + ' in U.S'
    $('.title').text(mapTitle);
  });

  //Showing and hiding both charts
  $('.change-chart').on('click', function(){
    if ($('.map').is(":visible")) {
      $('.change-chart').text('See Map');
      $('.map').hide();
      $('#select-container').hide();
      $('.chart').show();
      $('.title').text(barPlotTitle);
    } else {
      $('.change-chart').text('See Bar Freq');
      $('.chart').hide();
      $('.map').show();
      $('#select-container').show();
      $('.title').text(mapTitle);
    }
  });

  //Anonymous function to create a select element with options(text,value)
  function createSelect(selectClass, optionObj) {
    $select = $('<select class="selectpicker"></select>').addClass(selectClass)
    $.each(optionObj, function(value, index){
      $select
        .append($('<option>fuck</option>')
        .attr('value', value)
        .text(index));
    })
    return $select;
  };

})