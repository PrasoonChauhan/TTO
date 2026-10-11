# Lead form setup (about 10 minutes, once)

The website's form ("Book an intro call", "Start a project", "Let's talk how", "Book a discovery call") sends each enquiry to a small Google Apps Script. The script adds a row to a Google Sheet and emails **hello@thethirdorbit.co**. It is free and needs no server.

Do this while signed in to the Google account that should own the lead sheet.

## 1. Create the sheet and the script

1. Go to [sheets.new](https://sheets.new) and name the spreadsheet **TTO Leads**.
2. Open **Extensions > Apps Script**.
3. Delete the placeholder code, paste the whole of `lead-form.gs` from this folder, and press **Save**.

## 2. Grant permissions and test

1. In the toolbar, choose the function **testSetup** and press **Run**.
2. Google asks for permission to edit the sheet and send email as you. Choose your account, then **Advanced > Go to ... (unsafe) > Allow**. "Unsafe" only means Google has not reviewed your own private script.
3. Check that a **Leads** tab appears with a "Test Lead" row, and that a "New lead" email arrives at hello@thethirdorbit.co. Delete the test row if you like.

## 3. Deploy as a web app

1. Press **Deploy > New deployment**, click the gear icon and choose **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**. "Anyone" lets website visitors submit; they cannot see the sheet.
3. Press **Deploy** and copy the **Web app URL**. It ends in `/exec`.

## 4. Connect the website

Open `src/content/copy.ts`, find `LEAD_FORM_ENDPOINT`, paste the URL between the quotes, then rebuild or redeploy the site:

```ts
export const LEAD_FORM_ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec'
```

Until this is set, the form still works: it offers to send the details by WhatsApp or email instead.

## Changing the script later

Edit the code, then use **Deploy > Manage deployments > pencil icon > Version: New version > Deploy**. This keeps the same URL. Creating a *new* deployment gives a new URL, which would then need updating on the website.

## Limits and good to know

- Scripts on a free Gmail account can send about 100 emails a day; Google Workspace accounts about 1,500. The lead is still saved to the sheet if the daily email limit is reached.
- To notify a second address, set `NOTIFY_EMAIL` to `'hello@thethirdorbit.co,other@example.com'`.
- Opening the web app URL in a browser shows `{"ok":true,...}`, a quick check that it is live.
