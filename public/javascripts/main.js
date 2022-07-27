$(document).ready(function () {
    $(window).scroll(function () {
        // sticky navbar on scroll script
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
        }

        // scroll-up button show/hide script
        if (this.scrollY > 500) {
            $(".scroll-up-btn").addClass("show");
        } else {
            $(".scroll-up-btn").removeClass("show");
        }
    });

    // slide-up script
    $(".scroll-up-btn").click(function () {
        $("html").animate({ scrollTop: 0 });
        // removing smooth scroll on slide-up button click
        $("html").css("scrollBehavior", "auto");
    });

    $(".navbar .menu li a").click(function () {
        // applying again smooth scroll on menu items click
        $("html").css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $(".menu-btn").click(function () {
        $('.navbar .menu li a').each(function(){
            $(this).removeClass('active');
        });
        $(".navbar .menu").toggleClass("active");

        $(this).toggleClass("active");
    });

    let typed = new Typed(".typing-2", {
        strings: [
            "Backend Developer",
            "Frontend Developer",
            "Full Stack Developer",
        ],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true,
    });

    let typed1 = new Typed(".typing", {
        strings: ["Full Stack Developer", "Full Stack Developer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true,
    });

    // owl carousel script
    $(".carousel").owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
            },
            600: {
                items: 2,
                nav: false,
            },
            1000: {
                items: 3,
                nav: false,
            },
        },
    });
});
const modal = document.getElementById("myModal");


/**
 *
 * @param  data
 */
function openModal(data) {
    console.log(data);
    let lien = data.link === "" ? "#" : data.link;
    document.getElementById("titre").innerText = data.title;
    document.getElementById("description").innerText = data.description;
    $("#technologie").children("button").remove();
    $("#liens").children("a").remove();
    $("#liens").append("<a href=" + lien + " target='_blank'>" + data.link + "</a>");
    let technos = data.techno.split(",");
    $.each(technos, function (index, item) {
        $("#technologie").append(
            "<button  id='badge'>" + item + "</button>"
        );
    });
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function cutWords(length, words) {
    let index = length + 1;
    let tabs = ["", ",", ".", " "];
    if (words.length <= length) {
        return words;
    } else if (tabs.includes(words[index])) {
        return words.substring(0, length) + " ...";
    } else {
        for (let i = 1; i <= length; i++) {
            let t = length + i;
            if (tabs.includes(words[t])) {
                return words.substring(0, t) + " ...";
            }
        }
    }
}
