$(document).ready(function () {
  if ($('#current-year').length) {
    $('#current-year').text(new Date().getFullYear());
  }

  $('.menu-toggle').on('click', function () {
    const $mainNav = $('#main-nav');
    $mainNav.toggleClass('is-open');
    
    const isOpen = $mainNav.hasClass('is-open');
    $(this).attr('aria-expanded', String(isOpen));
  });
  
  $('#main-nav .nav-link').on('click', function () {
    $('#main-nav').removeClass('is-open');
    $('.menu-toggle').attr('aria-expanded', 'false');
  });
});
