
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
  //Select data
  var barPlotObj = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  }


  var doctorData = {
    'Internal Medicine': 'Internal Medicine', 
    'Family Medicine': 'Family Medicine', 
    'Pediatrics': 'Pediatrics', 
    'Psychiatry & Neurology': 'Psychiatry & Neurology', 
    'Anesthesiology': 'Anesthesiology', 
    'Emergency Medicine': 'Emergency Medicine', 
    'Obstetrics & Gynecology': 'Obstetrics & Gynecology', 
    'Radiology': 'Radiology', 
    'Student in an Organized Health Care Education/Training Program': 'Student in an Organized Health Care Education/Training Program', 
    'Surgery': 'Surgery', 
    'Specialist': 'Specialist', 
    'Orthopaedic Surgery': 'Orthopaedic Surgery', 
    'Ophthalmology': 'Ophthalmology', 
    'Pathology': 'Pathology', 
    'Dermatology': 'Dermatology', 
    'General Practice': 'General Practice', 
    'Urology': 'Urology', 
    'Otolaryngology': 'Otolaryngology', 
    'Physical Medicine & Rehabilitation': 'Physical Medicine & Rehabilitation', 
    'Hospitalist': 'Hospitalist'
  }

  // Create select element for map
  createSelect('map-select', doctorData)
  
  // Initial data visualizations
  ajaxPost({'map': 'Internal Medicine'})
  ajaxPost({'bar': 'AL'})
  

  //Hide and show elements related to bar graphic and map graphic
  $('.change-chart').on('click', function() {
    if($('.map-select').length){
      $(this).text('See doctors by county')
      $('.map-select').remove()
      createSelect('chart-select', barPlotObj)
      $('.map-container').hide();
      $('.map-title').hide();
      $('.bar-title').show();
      $('.bar-container').show();
    } else {
      $(this).text('See Bar Plot by State')
      $('.chart-select').remove()
      createSelect('map-select', doctorData)
      $('.map-title').show();
      $('.bar-title').hide();
      $('.bar-container').hide();
      $('.map-container').show();
    }
  });

  // Event listener for when there is a form POST
  // Determines the type of post (map or bar) by looking at the length
  // of the selected value. State values are of length 2. (CA, FL, TX etc.)
  $('#doctor-form').submit(function(e){
    e.preventDefault();
    var selectValue = $('form option:selected').val();
    var postData = selectValue.length === 2 ? {'bar': selectValue} : {'map': selectValue}
    ajaxPost(postData)
  })

  //Anonymous function to create a select element with options(text,value)
  function createSelect (selectClass, optionObj) {
    $select = $('<select class="selectpicker"></select>').addClass(selectClass)
    $('.selectpicker').selectpicker()
    $.each(optionObj, function(value, index){
      $select
        .append($('<option></option>')
        .attr('value', value)
        .text(index));
    })
    $('#doctor-form').prepend($select)
    $('.selectpicker').selectpicker()
  }

  // Function that makes our ajax call.
  // On success the appropriate D3 graphic 
  // is rendered. This is determined by the response
  // structure. ('bar_plot' in *response*)
  function ajaxPost (data) {
    $.ajax({
      type:"POST",
      url:"/",
      data: data,
      success: function(jsonData){
        var jsonDataParsed = jQuery.parseJSON(jsonData);
        if ('bar_plot' in jsonDataParsed) {
          var title = $('.bar-title').text('Counts of Types of Doctors in ' + data.bar)
          $('.bar-plot-container').prepend(title)
          createBarPlot(jsonDataParsed) 
        } else {
          var title = $('.map-title').text('Ratio of ' + data.map + ' Doctors to County Population')
          createMap(jsonDataParsed)
        }
      },
      error: function(){
        alert('There was an error with your request. Please contact Mark at' +
          'mmartinez8020@gmail.com regarding this issue.')
      }
    });
  }
})