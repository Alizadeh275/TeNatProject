var zoom = 1;

$('.zoom').on('click', function() {
    if (zoom <= 1.3) {
        zoom += 0.1;
        $('.target').css('zoom', zoom);
    }

});
$('.zoom-init').on('click', function() {
    zoom = 1;
    $('.target').css('zoom', zoom);
});
$('.zoom-out').on('click', function() {
    if (zoom >= 0.5) {
        zoom -= 0.1;
        $('.target').css('zoom', zoom);
    }

});