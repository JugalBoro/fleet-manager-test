(function (window) {
  window.env = window.env || {};
  window.env.url = "${URL}";
  (window.env.httpBasicUser = "${HTTP_BASIC_USER}"),
    (window.env.httpBasicPassword = "${HTTP_BASIC_PASSWORD}");
})(this);
