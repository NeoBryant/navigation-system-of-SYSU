var startPoint = false;
$( function() {

  $( '.spot' ).mouseenter( showInfo ).mouseleave( hideInfo ).click( setToggle );

  $('button').bind('click', showPathInMap);

} );

function showPathInMap (event) {
  var point = [];
  $('.start').each(function() {
    point.push($(this).attr('id'));
  });
  $('.set').each(function() {
    point.push($(this).attr('id'));
  })

  if (!point[0]||!point[1]) {
    return;
  }

  if ($(this).attr('id') === 'clickToFindWalkPath') {
    location.assign('http://localhost:8000/temp.html?flag=0'+'&point1='+point[0]+'&point2='+point[1]);
  } else if ($(this).attr('id') === 'clickToFindDrivePath') {
    location.assign('http://localhost:8000/temp.html?flag=1'+'&point1='+point[0]+'&point2='+point[1]);
  }
}

function showInfo() {
    $(this).children( '.info' ).addClass( 'visible' );
}

function hideInfo() {
    $(this).children( '.info' ).removeClass( 'visible' );
}

function setToggle( event ) {

    hideInfo();
    var thisTarget = $(this);
    if ( !startPoint ) {        //!startPoint

        thisTarget.addClass( 'start' );
        startPoint = true;

    } else {

        if ( thisTarget.hasClass( 'start' ) ) {
            thisTarget.removeClass( 'start' );
            $( '.set' ).removeClass( 'set' );
            startPoint = false;
        } else if ( thisTarget.hasClass( 'set' ) ) {
            thisTarget.removeClass( 'set' );
        } else {
            $( '.set' ).removeClass( 'set' );
            thisTarget.addClass( 'set' );
        }

    }
}