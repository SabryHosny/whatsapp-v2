const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        FIREBASE_API_KEY: "AIzaSyDCoYW4emCWKBi4oY0DbCDqhYMh8RVhwWo",
        FIREBASE_App_ID: "1:982503145391:web:f7e1a0757c79d1a6d9395a",
      },
    };
  }

  return {
    env: {
      FIREBASE_API_KEY: "AIzaSyDCoYW4emCWKBi4oY0DbCDqhYMh8RVhwWo",
      FIREBASE_App_ID: "1:982503145391:web:f7e1a0757c79d1a6d9395a",
    },
  };
};
