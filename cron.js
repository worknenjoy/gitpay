const CronJob = require('cron').CronJob

const job = new CronJob({
  // Seconds: 0-59   Minutes: 0-59   Hours: 0-23   Day of Month: 1-31   Months: 0-11 (Jan-Dec)   Day of Week: 0-6 (Sun-Sat)
  cronTime: '0 0 0 * * *', // everyday at 12:00AM
  onTick: () => {
    const d = new Date()
    // eslint-disable-next-line no-console
    console.log('Log to confirm cron job run at', d)
  }
})

module.exports = { job }
