/**
 * The Third Orbit: lead form receiver.
 *
 * Paste this into the Apps Script editor of a Google Sheet
 * (Extensions > Apps Script), then deploy it as a web app.
 * Full steps: google-apps-script/README.md
 *
 * Every submission:
 *   1. adds a row to the "Leads" tab of this spreadsheet, and
 *   2. emails NOTIFY_EMAIL with the details.
 * If one of the two fails, the other still runs.
 */

const NOTIFY_EMAIL = 'hello@thethirdorbit.co';
const SHEET_NAME = 'Leads';
const HEADERS = ['Received (IST)', 'Name', 'Company', 'Website', 'Phone', 'Best time', 'Button', 'Page'];
const MAX_LEN = 300;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Spam trap: the website's hidden "fax" field must be empty.
    if (p.fax) return json_({ ok: true });

    const lead = {
      name: clean_(p.name),
      company: clean_(p.company),
      website: clean_(p.website),
      phone: clean_(p.phone),
      time: clean_(p.time),
      source: clean_(p.source),
      page: clean_(p.page),
    };
    if (!lead.name || !lead.company || lead.phone.replace(/\D/g, '').length < 8) {
      return json_({ ok: false, error: 'missing_fields' });
    }

    const when = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm');
    let saved = false;
    let mailed = false;

    try {
      saveRow_(when, lead);
      saved = true;
    } catch (err) {
      console.error('Sheet write failed', err);
    }

    try {
      sendEmail_(when, lead, saved);
      mailed = true;
    } catch (err) {
      console.error('Email failed', err);
    }

    return json_({ ok: saved || mailed });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the web app URL in a browser shows this: a quick "is it alive" check. */
function doGet() {
  return json_({ ok: true, service: 'tto-lead-form' });
}

function saveRow_(when, lead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  // A leading apostrophe stores values as plain text: keeps "+91" phone numbers intact
  // and stops anything starting with "=" from running as a formula.
  sheet.appendRow([when, lead.name, lead.company, lead.website, lead.phone, lead.time, lead.source, lead.page].map(text_));
}

function sendEmail_(when, lead, saved) {
  const digits = lead.phone.replace(/[^\d]/g, '');
  const site = lead.website && !/^https?:\/\//i.test(lead.website) ? 'https://' + lead.website : lead.website;
  const rows = [
    ['Name', esc_(lead.name)],
    ['Company', esc_(lead.company)],
    ['Website', site ? '<a href="' + esc_(site) + '">' + esc_(lead.website) + '</a>' : '-'],
    ['Phone', '<a href="tel:+' + digits + '">' + esc_(lead.phone) + '</a> &nbsp;&middot;&nbsp; <a href="https://wa.me/' + digits + '">WhatsApp</a>'],
    ['Best time', esc_(lead.time || 'Not specified')],
    ['Button', esc_(lead.source || '-')],
    ['Page', esc_(lead.page || '-')],
    ['Received', when + ' IST'],
  ];
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">' +
    '<p style="margin:0 0 16px">New enquiry from the website.</p>' +
    '<table cellpadding="8" style="border-collapse:collapse">' +
    rows
      .map(function (r) {
        return '<tr><td style="color:#888;border-bottom:1px solid #eee">' + r[0] + '</td><td style="border-bottom:1px solid #eee"><b>' + r[1] + '</b></td></tr>';
      })
      .join('') +
    '</table>' +
    (saved ? '' : '<p style="color:#b00">Note: this lead could not be saved to the sheet.</p>') +
    '</div>';

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New lead: ' + lead.name + ' (' + lead.company + ')',
    htmlBody: html,
    name: 'The Third Orbit website',
  });
}

function clean_(v) {
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001f]/g, ' ')
    .trim()
    .slice(0, MAX_LEN);
}
function text_(v) {
  return v ? "'" + v : '';
}
function esc_(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor (choose testSetup, press Run) to grant permissions and send a test lead. */
function testSetup() {
  doPost({ parameter: { name: 'Test Lead', company: 'Setup check', phone: '+91 76785 98664', time: 'Anytime', source: 'Setup test', page: '/' } });
}
