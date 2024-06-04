var prevScrollpos = window.scrollY;
window.onscroll = function() {
  var currentScrollPos = window.scrollY;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-4.5rem";
  }
  prevScrollpos = currentScrollPos;
}

$(function(){
	$('#navbar-button').click(function(){
		e1 = $('#brand-icon');
        e1.addClass('animate');
        e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
            e1.removeClass('animate');
        });
	});
});