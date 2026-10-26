# RailDrop

A concept prototype for the **Hack to the Future** hackathon.

**App upgraded:** IRCTC eCatering (railway food ordering). RailDrop is an independent concept inspired by it. It is not affiliated with or endorsed by IRCTC, any railway body or any food company.

**New feature:** a live-arrival order window for delayed trains, with no dead ends.

**Live link:** https://raildrop.vercel.app

**Demo video:** https://youtu.be/diEmA9uKJO4

## Problem

Railway food apps already show a train's delay, but a late train can still end in dead ends such as "No items available right now", "No restaurants serving here" or "No stations available", with no reason and no next step. This affects every passenger whose train is delayed, which happens every day in India.

## Where it comes from

I was waiting at New Delhi station for a train that was running 2 to 3 hours late. I had no local cash and relied on digital payments. The food apps I tried would not let me order. While building this project I checked a delayed train again on existing railway food apps and saw similar dead ends.

## What RailDrop adds

1. **Live order window.** The order-by time follows the live arrival estimate, so it moves when the train gets later.
2. **"Can I order right now?"** The app answers directly, and shows what a cutoff based on the printed timetable would have done.
3. **Reasons, not dead ends.** A closed restaurant says why, and the app points to the earliest station that works.
4. **Restaurant sync.** The restaurant is told when to start cooking. That time updates when the delay changes.
5. **Honest failure case.** If a delay pushes arrival past closing time, the passenger gets a clear message and a refund (simulated).
6. **Boarding station ordering.** A passenger waiting at the boarding station for a late train can still order.

## Before and after

**Before (today):** the order window closes and the passenger sees an empty page with no reason. In the app, choose **How is this different from ordering today?** on the home screen.

![Before and after](images/05-before-and-after.png)

**After (with RailDrop):**

![Can I order right now?](images/01-can-i-order-now.png)
![A closed restaurant explains why](images/02-restaurants-after-delay.png)
![The window moves when the delay changes](images/03-tracking-window-moved.png)
![Clear message and refund when it closes](images/04-closed-and-refund.png)

## How it works

- Order-by time = train arrival estimate - restaurant cooking time - 30 minutes.
- Cooking start = train arrival estimate - cooking time - 10 minutes.
- A restaurant can deliver only if it is open at the arrival time and the order-by time has not passed.

All of this lives in `src/utils/rules.js`.

## Try it (2 minutes)

1. Open the app and pick **Main demo (7305148296)**, then press **Find my train**. The green box answers "Can I order right now?".
2. Order food at **New Delhi**, open **Dilli Rasoi Kitchen**, add items, pay, and press **Track order**.
3. Use the **Demo controls** box (top right) and press **Train gets 40 min later**. The delivery window and the restaurant's cooking time change.
4. Press it again. The restaurant now closes before the train arrives, so the app explains why and offers a refund.

The **Jump to a scene** list in the Demo controls opens each key screen directly.

**About the Demo controls:** a real product would receive delays from a live train-status feed. This prototype has no such feed, so the buttons stand in for it.

## Data and privacy

- Every train, PNR, passenger, restaurant, menu and price in RailDrop is made up for this demo.
- RailDrop does not use real passenger data, does not scrape any website or service, and does not call any private or unofficial API.
- It does not connect to IRCTC eCatering or any other service. It only recreates the screens it changes.

## Tech

React, Vite, Tailwind CSS, JavaScript. Sample data in `src/data.js`. Hosted on Vercel. No AI models and no external APIs run in the app.

## Development timeline and credits

- Before the hacking window: a basic first version of the idea (a simple flow with a fixed delay message and a one-item order).
- During the hacking window (Oct 20 to 27, 2026): the live-arrival order window, restaurant opening hours and order-by times, boarding-station ordering, the "Can I order right now?" answer, order tracking with the delay demo, the restaurant view, and the rebuilt screens.
- The organizers confirmed by email on Oct 24 that this project can be submitted.
- AI coding tools: built with help from AI coding assistants (mainly Claude). The running app calls no AI model.

## Assumptions and limits

- All trains, PNRs, restaurants, menus and prices are made up.
- The demo scenario starts from your device's current time and plays out the same way whenever you open it. Train delays come from a button, not a live train-status service.
- The order-by rule is our own assumption. We have not verified how any real company decides its cutoffs.
- Software cannot fix restaurant closing hours, 1-minute halts or unpredictable delays. RailDrop is honest about them and offers alternatives.
- Payments, OTP and the restaurant app are simulated.

## How a company could roll this out

Railway food apps already know the live arrival estimate. They could calculate the order-by time from it on every update, push a "start cooking at" time to the restaurant app, and show closing reasons instead of empty states.

## Run locally

```
git clone https://github.com/kirtiv-CANADA/raildrop.git
cd raildrop
npm install
npm run dev
```

Open http://localhost:5173

## Author

Built by Kirti (solo).
