/*! tinyNav2.js v0.52
 * https://github.com/viljamis/tinyNav2.js
 * http://tinynav2.viljamis.com
 *
 * Copyright (c) 2013 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

(function (w) {

  var tinyNav = w.tinyNav || {};

  var nav,
    navToggle,
    navInner,
    c = console,
    doc = w.document,
    aria = "aria-hidden",
    head = doc.getElementsByTagName("head")[0],
    styleEl = doc.createElement("style"),
    computed = w.getComputedStyle ? true : false,
    debug = tinyNav.debug || false; // Boolean: log debug messages to console, true or false

  // Create style element
  head.appendChild(styleEl);

  // Resizer
  w.resizer = function () {
    if (computed) {
      if (w.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

        // Set aria-hidden
        navToggle.setAttribute(aria, false);
        nav.setAttribute(aria, true);

        // Inject custom styles
        head.appendChild(styleEl);
        var savedHeight = navInner.offsetHeight,
          innerStyles = "#nav.opened{max-height:" + savedHeight + "px }";
        styleEl.innerHTML = innerStyles;
        innerStyles = '';

        // Debug
        if (debug === true) {
          c.log("Calculated max-height of " + savedHeight + " pixels and inserted to DOM");
        }

      } else {

        // Set aria-hidden
        navToggle.setAttribute(aria, true);
        nav.setAttribute(aria, false);

        // Remove custom styles
        if (styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);

          // Debug
          if (debug === true) {
            c.log("Removed max-height styles");
          }

        }
      }
    }
  };

  // Navigation
  w.navigation = function () {

    // Debug
    if (debug === true) {
      c.log("Inited Navigation");
    }

    var nav_open = false,
      closed = "closed",
      opened = "opened",
      getElement = function (el) {
        return doc.getElementById(el);
      };

    // Default selectors
    nav = getElement(tinyNav.nav) || getElement("nav"); // String: id of the nav
    navInner = getElement(tinyNav.navInner) || getElement("nav-inner"); // String: id of the nav wrapper
    navToggle = getElement(tinyNav.navToggle) || getElement("nav-toggle"); // String: id of the toggle

    // Determines if we should open or close the nav
    var navFunction = function (e) {
        e.preventDefault();
        if (!nav_open) {
          nav.className = nav.className.replace(closed, opened);
          if (computed) {
            nav.setAttribute(aria, false);
          }
          nav_open = true;

          // Debug
          if (debug === true) {
            c.log("Opened navigation");
          }

        } else {
          nav.className = nav.className.replace(opened, closed);
          if (computed) {
            nav.setAttribute(aria, true);
          }
          nav_open = false;

          // Debug
          if (debug === true) {
            c.log("Closed navigation");
          }

        }
        return false;
      };

    // Init on load
    w.resizer();

    // Mousedown
    navToggle.onmousedown = function (e) {

      // Debug
      if (debug === true) {
        c.log("Detected mousedown");
      }

      navFunction(e);
    };

    // Touchstart event fires before the mousedown event
    // and can wipe the previous mousedown event
    navToggle.ontouchstart = function (e) {

      // Debug
      if (debug === true) {
        c.log("Detected touchstart");
      }

      navToggle.onmousedown = null;
      navFunction(e);
    };

    // On click
    navToggle.onclick = function () {
      return false;
    };
  }

  // Run on domready (w.load as a fallback)
  if (w.addEventListener) {
    w.addEventListener("DOMContentLoaded", function () {
      w.navigation();
      // Run once only
      w.removeEventListener("load", w.navigation, false);
    }, false);
    w.addEventListener("load", w.navigation, false);
    w.addEventListener("resize", w.resizer, false);
  } else if (w.attachEvent) {
    w.attachEvent("onload", w.navigation);
    w.attachEvent("resize", w.resizer);
  }

})(this);
