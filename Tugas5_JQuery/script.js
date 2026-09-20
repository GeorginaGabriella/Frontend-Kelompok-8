$(document).ready(function () {
  // Set tahun otomatis dengan jQuery .text()
  if ($('#current-year').length) {
    $('#current-year').text(new Date().getFullYear());
  }

  // Event toggle menu navigasi mobile dengan .on('click') dan .toggleClass()
  $('.menu-toggle').on('click', function () {
    const $mainNav = $('#main-nav');
    $mainNav.toggleClass('is-open');
    
    const isOpen = $mainNav.hasClass('is-open');
    $(this).attr('aria-expanded', String(isOpen));
  });

  // Tutup menu saat nav-link diklik
  $('#main-nav .nav-link').on('click', function () {
    $('#main-nav').removeClass('is-open');
    $('.menu-toggle').attr('aria-expanded', 'false');
  });
});