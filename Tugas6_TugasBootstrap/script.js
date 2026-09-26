$(document).ready(function () {
    // Menampilkan tahun pada footer
    $('#current-year').text(new Date().getFullYear());

    // Menambah dan mengurangi jumlah suka
    $('.like-button').on('click', function () {
        const $button = $(this);
        const $count = $button.find('.like-count');
        let count = Number($count.text());
        
        if ($button.hasClass('liked')) {
            count--;
            $button.removeClass('liked');
            $button.html('♡ Suka <span class="like-count">' + count + '</span>');
        } else {
            count++;
            $button.addClass('liked');
            $button.html('♥ Disukai <span class="like-count">' + count + '</span>');
        }
        
        $button.hide().fadeIn(200);
    });
});