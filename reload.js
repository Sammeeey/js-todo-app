//check for Navigation Timing API support
if (window.performance) {
    console.info("window.performance works fine on this browser");
  }
  console.info(performance.navigation.type);
  if (PerformanceNavigationTiming.type == "reload") {
    console.info( "This page is reloaded" );
  } else {
    console.info( "This page is not reloaded");
  }