
function TopWebsite(data) {
  this.title = data.Title;
  this.url = data.Url;
}
TopWebsite.prototype.toHtmlElement = function (isFirst) {
  var li = document.createElement('li');
  var html = '';
  html += '<a href="' + this.url + '">';
  html += '<div class="thumbnail" ><img src="' + 'http://g.etfv.co/' + this.url + '" ></div>';
  html += '<div class="texts" >';
  html += '<span>' + this.title + '</span>';
  html += '<span class="hyperlink" >' + this.url + '</span>';
  html += '</div>';
  if (isFirst) {
      html += this.getOfficialHtml();
    }
  html += '</a>';
  
  html += '<div class="border"></div>';
  li.innerHTML = html;
  return li;
}
TopWebsite.prototype.getOfficialHtml = function () {
  return '<span id="official"><span></span></span>'
}

var Ajax = (function () {
  xmlhttp = new XMLHttpRequest();
  function hostName() {
    return window.location.hostname + '/';
  }
  return {
    get: function (url, method, asynch) {
      var response = localStorage.getItem(hostName() + url);
      if (response) {
        method(response);
        return;
      }
      if (!asynch) {
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        localStorage.setItem(hostName() + url, xmlhttp.responseText);
        method(xmlhttp.responseText);
      }
      else { 
        //will be implemented on demand...
      }
    }
  }

})();

var App = (function () {
  function buildResultHtml(jsonStr) {
    var nav = document.getElementsByTagName('nav')[0];
    var ul = document.createElement('ul');
    var response = eval("(" + jsonStr + ")");
    for (var i = 0; i < response.SearchResponse.Web.Results.length; i++) {
      var topWebsite = new TopWebsite(response.SearchResponse.Web.Results[i]);
      ul.appendChild(topWebsite.toHtmlElement(i == 0));
    }
    nav.appendChild(ul);
  }
  function createBody() {
    var elem = document.createElement('nav')
    document.body.appendChild(elem)
    //sych, so footer will not be built till body is done
    Ajax.get("data/data.json", buildResultHtml, false);
  }
  function createHeader() {
    var elem = document.createElement('header')
    elem.innerHTML = '<img id="top-websites" src="images/transparent-image.png" />';
    document.body.appendChild(elem)
  }
  function createFooter() {
    var elem = document.createElement('footer')
    elem.innerHTML = '<img id="results-by-bing" src="images/transparent-image.png" /><button id="more-on-bing" type="button"><span>More on Bing</span><span id="tm">TM</span><span id="arrow"></span></button>';
    document.body.appendChild(elem)
  }
  function skipAddressBar() {
    window.scrollTo(0, 1);
  }
  return {
    start: function () {
      createHeader();
      createBody();
      createFooter();
      skipAddressBar();
    }
  }
})();

(function () {
  window.onload = function () {
    App.start();
  }
})();


