var home_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqm2lrf8vVFMRek0bnsx_jwBDsni96DwkcBVwomF0dXFdaYJVQY-l4vSdHCVPTwUY9Gsj_3EqCGLi-/pub?gid=1470746464&single=true&output=csv';
var about_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9OLx0x4xY0Qn50eE7RHiEaN22eJETm99zXyoaQ39f4YdN-zYFrxlIhcLkQbffH37ZS2WU2R8YN1XO/pub?gid=1643618846&single=true&output=csv';
var data;
var grid = document.getElementById('grid');

// Grab info from spreadsheet
function initData() {
  Papa.parse(home_url, {
    download: true,
    header: true,
    complete: showInfo,
    error: function(error) {
      console.log(error.message);
    }
  });

  Papa.parse(about_url, {
    download: true,
    header: true,
    complete: showAbout,
    error: function(error) {
      console.log(error.message);
    }
  });
}

function showInfo(results){
  data = results.data;
  console.log(results.errors);
  
  for(let i = 0; i < data.length; i++){
    var block = document.createElement("div");
    block.classList.add('block');

    let regex = /-/g;
    let finalText = data[i].Text.replace(regex, "<br>");

    if(data[i].Header == "FALSE"){
      block.innerHTML = `
      <div class="meta ` + data[i].Alignment + `">
        <p>` + finalText + `</p>
      </div>
      <img src="https://drive.google.com/thumbnail?authuser=0&sz=w960&id=` + data[i].Image + `" class="image">
    `;
    } else {
      block.classList.add('head');
      block.style.background = `#${data[i].Image}`;
      block.innerHTML = `
        <h2>` + finalText + `</h2>
    `;
    }

    grid.appendChild(block);
  }

  // Add hover effect
  var boxes = document.querySelectorAll('img');
  var zoomImg = document.getElementById('img-zoom');
  var nav = document.getElementById('links');

  var blocks = document.querySelectorAll('.block');

  if(window.innerWidth > 768){
    blocks.forEach(block => {
      block.addEventListener('mouseenter', ()=> {
        block.lastElementChild.style.opacity = 1;
        block.lastElementChild.classList.add('expand');
        block.firstElementChild.style.opacity = 0;

        setTimeout(function(){
          block.lastElementChild.style.opacity = 0;
          block.lastElementChild.classList.remove('expand');
        }, 5000);

        setTimeout(function(){
          block.firstElementChild.style.opacity = 1;
        }, 6000);
      });
    });
  }

  // zoom image on click
  boxes.forEach(box => {
    box.addEventListener('click', ()=> {
      zoomImg.classList.add('show');
      zoomImg.innerHTML=`
      <img src="` + box.src + `">
      `;
      // nav.classList.add('hide');
    });
  });

  zoomImg.addEventListener('click', ()=> {
    zoomImg.classList.remove('show');
    // nav.classList.remove('hide');
  })

  // Slider
  let w = document.getElementById('ancho');

  w.oninput = function() {
    for(i=0; i<blocks.length;i++){
      blocks[i].style.width = 'calc(' + w.value + '% + 1px)';
    }
  }

  if(window.innerWidth < 769) {
    // Lazy loading for mobile
      var lazyloadImages;    

      if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll(".image");
        var imageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var image = entry.target;
              // image.src = image.dataset.src;
              image.classList.remove("image");
              imageObserver.unobserve(image);
            }
          });
        }, {
          rootMargin: "0px 0px -30% 0px"
        });

        lazyloadImages.forEach(function(image) {
          imageObserver.observe(image);
        });
      } else {  
        var lazyloadThrottleTimeout;
        lazyloadImages = document.querySelectorAll(".image");
        
        function lazyload () {
          if(lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
          }    

          lazyloadThrottleTimeout = setTimeout(function() {
            var scrollTop = window.scrollY;
            lazyloadImages.forEach(function(img) {
                if(img.offsetTop < ((window.innerHeight/2) + scrollTop)) {
                  // img.src = img.dataset.src;
                  img.classList.remove('image');
                }
            });
            if(lazyloadImages.length == 0) { 
              document.removeEventListener("scroll", lazyload);
              window.removeEventListener("resize", lazyload);
              window.removeEventListener("orientationChange", lazyload);
            }
          }, 200);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
      }

    // ScrollReveal().reveal('img', {
    //   interval: 20,
    //   delay: 1000,
    //   reset: true,
    //   scale: 1,
    //   viewFactor : 0
    // });
  }
}

function showAbout(aboutResults) {
  aboutData = aboutResults.data;
  console.log(aboutResults.errors);

  var btn = document.getElementById('about-button');
  var about = document.getElementById('about');

  for(var a = 0; a < aboutData.length; a++) {
    let regex = /-/g;
    let finalText = aboutData[a].About.replace(regex, "<br>");

    var texts = document.createElement("p");
    texts.innerHTML = finalText;
    about.appendChild(texts);
  }

  btn.addEventListener('click', function(e){
    about.classList.toggle('show');
    grid.classList.toggle('move');
    e.preventDefault();
  });

  grid.addEventListener('click', function(){
    about.classList.remove('show');
    grid.classList.remove('move');
  });
}

initData();
// window.addEventListener('DOMContentLoaded', initData);
