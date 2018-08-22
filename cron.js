const CronJob = require('cron').CronJob

const job = new CronJob({
  // Seconds: 0-59   Minutes: 0-59   Hours: 0-23   Day of Month: 1-31   Months: 0-11 (Jan-Dec)   Day of Week: 0-6 (Sun-Sat)
  cronTime: '4 * * * * * ',
  onTick: () => {
    // eslint-disable-next-line no-console
    console.log('Execute your function')
  }
})

module.exports = { job }
