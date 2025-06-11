// Simplified version that doesn't depend on web-vitals API
const reportWebVitals = (onPerfEntry?: any) => {
  // Web vitals reporting is disabled to avoid version conflicts
  console.log('Web vitals reporting is disabled', onPerfEntry);
  if (onPerfEntry && onPerfEntry instanceof Function) {
    console.warn('Web vitals reporting is disabled. No performance metrics will be reported.');
  }
};

export default reportWebVitals;
// This file is intentionally simplified to avoid version conflicts with web-vitals API.
// It serves as a placeholder to maintain compatibility with the rest of the application.
// It does not implement any actual performance reporting logic.