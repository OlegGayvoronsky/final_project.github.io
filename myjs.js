$(function(){
    $(".ajaxForm").submit(function(e){
        e.preventDefault();
        var href = $(this).attr("action");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: href,
            data: $(this).serialize(),
            success: function(response){
                if(response.status == "success"){
                    alert("Данные успешно отправлены!");
                }
                else{
                    alert("Ошибка: " + response.message);
                }
            }
        });
    });
});
$(document).on('ready', function() {
    $('.worked_with_us_slider1').slick({
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    });
  });
  
  $(document).on('ready', function() {
    $('.worked_with_us_slider2').slick({
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    });
  });
  
  
  $(document).on('ready', function() {
    $('.rewiews_slider').slick({
      infinite: true,
      adaptiveHeight: true,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
  
    });
  })
