# RailDrop

A concept prototype for the **Hack to the Future** hackathon.

**App upgraded:** IRCTC eCatering (railway food ordering). RailDrop is an independent concept inspired by it. It is not affiliated with or endorsed by IRCTC, any railway body or any food company.

**New feature:** a live-arrival order window for delayed trains, with no dead ends.

**Live link:** https://raildrop.vercel.app

## Problem

Railway food apps already show a train's delay, but a late train can still end in dead ends: "No items available right now", "No restaurants serving here", or "No stations available", with no reason and no next step. This affects every passenger whose train is delayed, which happens every day in India.

## Where it comes from

I was waiting at New Delhi station for a train that was running 2 to 3 hours late. I had no local cash and relied on digital payments. The food apps I tried would not let me order: they showed no restaurants and said the train had left the station. While building this project I checked a delayed train again on existing apps and saw similar dead ends.

## What RailDrop adds

1. **Live order window.** The order-by time follows the live arrival estimate, so it moves when the train gets later.
2. **Reasons, not dead ends.** A closed restaurant says why, and the app points to the earliest station that works.
3. **Restaurant sync.** The restaurant is told when to start cooking. That time updates when the delay changes.
4. **Honest failure case.** If a delay pushes arrival past closing time, the passenger gets a clear message and a refund (simulated).
5. **Boarding station ordering.** A passenger waiting at the boarding station for a late train can still order.

## Before and after

In the app, choose **How is this different from ordering today?** on the home screen. Screenshots are in `public/screenshots`.

## How it works

- Order-by time = train arrival estimate - restaurant cooking time - 30 minutes.
- Cooking start = train arrival estimate - cooking time - 10 minutes.
- A restaurant can deliver only if it is open at the arrival time and the order-by time has not passed.

All of this lives in `src/utils/rules.js`.

## Try it (2 minutes)

1. Open the app, choose **Don't have a PNR? Try a demo booking**, pick **Main demo (7305148296)** and press **Find my train**.
2. Order food at **New Delhi**, open **Dilli Rasoi Kitchen**, add items, pay, and press **Track order**.
3. Open the **Demo controls** box (top right) and press **Train gets 40 min later**. The delivery window and the restaurant's cooking time change.
4. Press it again. The restaurant now closes before the train arrives, so the app explains why and offers a refund.

**About the Demo controls:** a real product would receive delays from a live train-status feed. This prototype has no such feed, so the buttons stand in for it.

## Tech

React, Vite, Tailwind CSS. Sample data in `src/data.js`. Hosted on Vercel. No AI models and no external APIs.

## Assumptions and limits

- All trains, PNRs, restaurants, menus and prices are made up.
- The demo uses a simulated clock and a button to simulate delays. It does not call a live train-status service.
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
