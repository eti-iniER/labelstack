# Labelstack

Labelstack is an application that helps automate the process of shipping label generation, among other aspects of the shipment management workflow. I built it as part of a take-home technical assessment for a potential client.

## Usage

### Hosted workflow
1. Open https://labelstack.eti-ini.me.
2. From the dashboard sidebar, choose "Upload spreadsheet" to start the bulk label flow.
3. Download the template if you need it, fill in your orders, then drag and drop the CSV into the upload area.
4. Step 2 lets you review and edit rows; Step 3 lets you pick shipping options and see the running total; finish by confirming to generate labels.
5. The interface walks you through the rest of the flow without extra setup.

### Local development
1. From the backend directory, run the Django server with your preferred environment (see backend README for details).
2. From the frontend directory, install dependencies (pnpm install or npm install) and start the dev server (pnpm dev or npm run dev).
3. Navigate to the frontend URL shown in the terminal and follow the same steps as the hosted workflow.
