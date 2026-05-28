// Options Capital — sidecar data file
// -----------------------------------------------------------------------------
// Source of truth for entity capital, margin settings, USD cash, and the
// deposit history shown on index.html. Edit this file to log a new deposit
// or update the margin/buffer settings; the dashboard reloads from it on each
// page load.
//
// Schema:
//   <ENTITY_KEY>: {
//     capital_gbp        number    must equal sum of deposits[].amount_gbp
//     margin_multiplier  number    e.g. 3 = 3x margin / portfolio margin
//     buffer_pct         number    fractional buffer kept in reserve (0–1)
//     label              string    human-readable entity name
//     usd_cash           number    settled USD cash in the brokerage
//     deposits: [
//       { id, date: 'YYYY-MM-DD', amount_gbp, note }
//     ]
//   }
// -----------------------------------------------------------------------------

window.OPTIONS_CAPITAL = {
  ANE: {
    capital_gbp: 525000,
    margin_multiplier: 3,
    buffer_pct: 0.32,
    label: 'Aspire North East Ltd',
    usd_cash: 30400,
    deposits: [{
      id: 1,
      date: '2026-02-10',
      amount_gbp: 10000,
      note: 'Initial deposit'
    }, {
      id: 2,
      date: '2026-02-17',
      amount_gbp: 40000,
      note: 'Top-up'
    }, {
      id: 3,
      date: '2026-03-02',
      amount_gbp: 50000,
      note: 'Top-up'
    }, {
      id: 4,
      date: '2026-03-09',
      amount_gbp: 100000,
      note: 'Top-up'
    }, {
      id: 5,
      date: '2026-04-02',
      amount_gbp: 100000,
      note: 'Top-up'
    }, {
      id: 6,
      date: '2026-05-07',
      amount_gbp: 25000,
      note: 'Top-up'
    }, {
      id: 7,
      date: '2026-05-26',
      amount_gbp: 100000,
      note: 'Top-up'
    }, {
      id: 8,
      date: '2026-05-27',
      amount_gbp: 100000,
      note: 'Top-up'
    }]
  }
};
