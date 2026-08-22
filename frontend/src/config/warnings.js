// Feature toggles for global warning banners.
// If this needs to vary per-deploy later, swap these for env vars (e.g. process.env.WARNING_MODE).
const warningsConfig = {
  // Controls whether the "Payment Operations Paused" banner is shown.
  warningMode: false
}

export default warningsConfig
