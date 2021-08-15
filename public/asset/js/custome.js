/*
---------------------------------------------------------------------------------------
* Template Name             :                                                         *
* Author                    :                                                         *
* Version                   :                                                         *
* Design and Developed by   :                                                         * 
*--------------------------------------------------------------------------------------
NOTE: This file contains all scripts for the actual Template.
*/

/*==============================================
[  Table of contents  ]
================================================
    :: Back to top 
    :: Loader
    :: Copyright Year 
    :: Menu  
    :: left side fix
================================================
[ End table content ]
==============================================*/

jQuery(document).ready(function($){
    // :: Back to top 
    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#back-to-top').addClass('show');
            } else {
                $('#back-to-top').removeClass('show');
            }
        };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }     
    // :: Loader  
    setTimeout( function() {        
        $('#loader').remove();        
    }, 3000);
    // :: Copyright Year   
    var currentYear = (new Date).getFullYear();
    $("#copyright-year").text((new Date).getFullYear()); 
    // :: Menu
    $(function() { 
        $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).siblings().toggleClass("show");
            if (!$(this).next().hasClass('show')) {
                $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
            }
            $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
                $('.dropdown-submenu .show').removeClass("show");
            });
        });
    }); 
    
    // :: left side fix
    // var stickyTop = $('.sticky').offset().top;
    // $(window).scroll(function() {
    //     var windowTop = $(window).scrollTop();
    //     if (stickyTop < windowTop && $(".box-mainsection").height() + $(".box-mainsection").offset().top - $(".sticky").height() > windowTop) {
    //         $('.sticky').css('position', 'fixed');
    //         $('.sticky').css('max-width', '350px');
    //         $('.sticky').css('width', '100%');                
    //     } else {
    //         $('.sticky').css('position', 'relative');
    //     }
    // }); 
}); 