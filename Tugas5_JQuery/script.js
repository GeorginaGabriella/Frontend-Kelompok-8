$(document).ready(function () {
    // Menampilkan tahun pada footer
    $('#current-year').text(new Date().getFullYear());
    // Membuka dan menutup navigasi mobile
    $('.menu-toggle').on('click', function () {
        $('#main-nav').toggleClass('is-open');
        const isOpen = $('#main-nav').hasClass('is-open');
        $(this).attr('aria-expanded', String(isOpen));
    });

    // Menutup navigasi setelah link dipilih
    $('#main-nav .nav-link').on('click', function () {
        $('#main-nav').removeClass('is-open');
        $('.menu-toggle').attr('aria-expanded', 'false');
    });

    // Membuka dan menutup jawaban FAQ
    $('.faq-question').on('click', function () {
        const $question = $(this);
        const $answer = $question.next('.faq-answer');
        $('.faq-answer').not($answer).slideUp();
        $('.faq-question').not($question).removeClass('open');
        $answer.slideToggle();
        $question.toggleClass('open');
    });

    // Menambah dan mengurangi jumlah suka
    $('.like-button').on('click', function () {
        const $button = $(this);
        const $count = $button.find('.like-count');
        let count = Number($count.text());
        if ($button.hasClass('liked')) {
            count--;
            $button.removeClass('liked');
            $button.html(
                '♡ Suka <span class="like-count">' + count + '</span>'
            );
        } else {
            count++;
            $button.addClass('liked');
            $button.html(
                '♥ Disukai <span class="like-count">' + count + '</span>'
            );
        }
        $button.hide().fadeIn(200);
    });
});
