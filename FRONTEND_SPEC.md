# Frontend Specification Document

## Product Name
Foody

## Purpose
This document defines the frontend look, feel, layout rules, and external integrations used by the app so new screens stay visually consistent and connected to the correct services.

## Design Direction
Foody has a warm, food-forward visual style. The UI should feel friendly, bright, and practical rather than corporate or overly minimal. The current design leans on cream backgrounds, vivid orange accents, rounded cards, soft shadows, and high-contrast action buttons.

## Color Palette
### Brand Colors
- Primary: `#ff4d2d`
- Primary Hover / Strong Accent: `#e64526`
- Primary Variant: `#ff4d4d`
- Soft Accent Background: `#ddafa7`
- Warm Highlight: `#ff5b34`
- Success Green: `#2aa56c`
- Success Soft Background: `#d1e7dd`

### Surface Colors
- App Background: `#fff9f6`
- Soft Warm Background: `#fff0e8`
- Light Gradient Top: `rgba(255,243,238,0.95)`
- Card Background: `#ffffff`

### Text Colors
- Primary Text: `#111827` or Tailwind slate/gray near-black
- Secondary Text: `#6b7280`
- Muted Text: `#9ca3af`
- Inverse Text: `#ffffff`

### Status Colors
- Error: `#dc2626`
- Success: `#2aa56c`
- Warning: `#f59e0b`
- Info: `#2563eb`

## Typography
### Font Family
- Current app behavior: default browser sans-serif stack through Tailwind.
- Recommended spec: `Inter`, `system-ui`, `sans-serif`.

### Type Scale
- Page Title: `text-3xl` to `text-5xl`, bold or extra bold
- Section Title: `text-2xl`, semibold or bold
- Card Title: `text-lg`, semibold
- Body Text: `text-sm` to `text-base`, normal weight
- Supporting Text: `text-xs` to `text-sm`, medium or normal weight
- Button Text: `text-sm` to `text-lg`, semibold

### Typography Rules
- Use bold headlines for primary actions and page identity.
- Keep supporting copy short and direct.
- Use darker text on light backgrounds for readability.
- Avoid decorative fonts or mixed typefaces inside the app.

## Component Styles
### Buttons
#### Primary button
- Background: `#ff4d2d`
- Text: white
- Shape: rounded large or full pill depending on context
- Hover: darker orange such as `#e64526`
- Use for: checkout, sign in, add item, place order, confirm actions

#### Secondary button
- Background: white or very light gray
- Border: light gray or soft orange
- Text: dark gray or brand orange
- Use for: cancel, back, alternate actions

#### Icon button
- Often circular or rounded with a brand-orange icon
- Used for cart, search, add, edit, delete, and navigation controls

### Inputs
- Background: white or transparent over white card
- Border: light gray by default
- Focus ring: brand orange
- Shape: rounded large
- Label style: small, medium weight, dark gray
- Placeholder style: muted gray

### Cards
- Background: white
- Border: light neutral or brand-tinted border
- Radius: medium to large rounded corners
- Shadow: soft shadow on hover or elevated cards
- Used for: food items, summary blocks, dashboards, lists

### Modals
- Full-screen dark overlay with 40-45% opacity
- White modal panel with rounded extra-large corners
- Clear title, short explanation, and two action buttons
- Primary action is always visually dominant

### Navigation Header
- Height: `80px`
- Background: warm cream `#fff9f6`
- Left side brand mark: orange wordmark `foody`
- Right side actions: cart, search, orders, profile circle
- Sticky or fixed behavior is acceptable if it does not crowd mobile screens

### Tables / Admin Lists
- Use clean white panels
- Strong spacing between rows
- Simple status badges with color-coded text
- Avoid dense grid layouts unless necessary for admin review

## Spacing and Layout Rules
### General Layout
- Default page padding: `16px` on mobile, `24px` to `40px` on desktop
- Use generous vertical spacing between sections
- Keep content centered in cards or containers when the screen is action-focused

### Grid and Container Rules
- Food listings should use responsive card grids that collapse cleanly on mobile.
- Forms should use a single-column layout on mobile.
- Two-column layouts are acceptable for checkout and admin detail views on desktop.
- Max-width containers should be used for forms and modals to avoid overly wide line lengths.

### Spacing Scale
- Tiny spacing: `4px`
- Small spacing: `8px`
- Medium spacing: `12px` to `16px`
- Large spacing: `20px` to `24px`
- Section spacing: `32px` to `48px`

### Visual Rhythm
- Keep cards separated with clear whitespace.
- Do not stack too many bordered elements without breathing room.
- Use soft gradients and subtle shadows to make the UI feel warm instead of flat.

### Mobile Rules
- Primary actions must remain reachable with one thumb.
- Search, cart, and navigation actions should collapse into compact icon controls.
- Text should never rely on hover states alone.

## API and Integration Spec
### Backend Base API
- Base URL in frontend code: `serverUrl = http://localhost:3000`
- Production base URL should be stored in environment configuration and not hardcoded.

### Authentication and User Services
#### `POST /api/auth/signup`
- Purpose: create a new account.
- Data sent: full name, email, password, mobile, role.
- Expected response: created user object and auth cookie.

#### `POST /api/auth/signin`
- Purpose: log in with email and password.
- Data sent: email, password.
- Expected response: user object and auth cookie.

#### `GET /api/auth/signout`
- Purpose: clear the auth session.
- Expected response: success message.

#### `POST /api/auth/google-auth`
- Purpose: create or log in a user after Firebase sign-in.
- Data sent: user profile details from Firebase-backed auth flow.
- Expected response: user object and auth cookie.

#### `POST /api/auth/send-otp`
- Purpose: send password reset OTP.
- Data sent: email.
- Expected response: OTP sent confirmation.

#### `POST /api/auth/verify-otp`
- Purpose: verify password reset OTP.
- Data sent: email, otp.
- Expected response: verification success message.

#### `POST /api/auth/reset-password`
- Purpose: reset the user password after OTP verification.
- Data sent: email, newPassword.
- Expected response: password reset success message.

#### `GET /api/user/current`
- Purpose: fetch the logged-in user profile.
- Data sent: auth cookie.
- Expected response: current user record.

#### `POST /api/user/update-location`
- Purpose: store the user’s live location.
- Data sent: latitude and longitude.
- Expected response: updated user record.

### Shop and Item Services
#### `POST /api/shop/create-edit`
- Purpose: create or update a shop profile.
- Data sent: shop fields plus image file.
- Expected response: saved shop record.

#### `GET /api/shop/get-my`
- Purpose: fetch the signed-in owner’s shop.
- Data sent: auth cookie.
- Expected response: owner’s shop.

#### `GET /api/shop/get-by-city/:city`
- Purpose: fetch shops for a selected city.
- Data sent: city path parameter.
- Expected response: list of shops.

#### `GET /api/item/get-by-shop/:shopId`
- Purpose: fetch menu items for one shop.
- Data sent: shop ID.
- Expected response: shop items.

#### `POST /api/item/add-item`
- Purpose: create a new menu item.
- Data sent: item details plus image file.
- Expected response: created item.

#### `PUT /api/item/edit-item/:itemId`
- Purpose: edit an item.
- Data sent: item details plus optional image file.
- Expected response: updated item.

#### `GET /api/item/get-by-id/:itemId`
- Purpose: load one item for editing.
- Expected response: item record.

#### `GET /api/item/search-items`
- Purpose: search food by text and city.
- Data sent: `query` and `city` query parameters.
- Expected response: matching items.

### Cart and Checkout Services
#### `POST /api/cart/sync`
- Purpose: persist cart state to the backend.
- Data sent: cart items, outlet ID, total amount.
- Expected response: saved cart state.

#### `GET /api/cart/my-cart`
- Purpose: hydrate the current user’s cart from the server.
- Expected response: cart record.

#### `DELETE /api/cart/clear`
- Purpose: clear the current cart after order placement or manual reset.
- Expected response: success message.

#### `POST /api/order/place-order`
- Purpose: create a new order.
- Data sent: items, address, payment method, coupon, totals.
- Expected response: created order.

#### `GET /api/order/my-orders`
- Purpose: fetch the user’s order history.
- Expected response: list of orders.

#### `GET /api/order/get-order-by-id/:orderId`
- Purpose: fetch an order for tracking.
- Expected response: order record.

#### `GET /api/order/get-current-order`
- Purpose: fetch the active order state for the user or delivery partner.
- Expected response: current order.

#### `POST /api/order/send-delivery-otp`
- Purpose: send OTP for delivery handoff.
- Data sent: order or shop-order identifiers.
- Expected response: OTP sent success.

#### `POST /api/order/verify-delivery-otp`
- Purpose: verify delivery OTP and complete delivery.
- Data sent: order or shop-order identifiers plus OTP.
- Expected response: delivery success.

#### `GET /api/order/get-assignment`
- Purpose: fetch the delivery partner’s available assignment.
- Expected response: assignment data.

#### `GET /api/order/accept-order/:assignmentId`
- Purpose: accept a delivery assignment.
- Expected response: acceptance success.

#### `PUT /api/order/update-status/:orderId/:shopId`
- Purpose: update order status.
- Data sent: order ID, shop ID, and new status.
- Expected response: status update success.

#### `POST /api/order/rate-item`
- Purpose: rate an ordered item after delivery.
- Data sent: order and item identifiers plus rating details.
- Expected response: rating saved.

#### `GET /api/orders/most-ordered`
- Purpose: fetch most-ordered items for owner analytics.
- Expected response: summary data.

### Admin Services
#### `GET /api/admin/users`
- Purpose: fetch all users.
- Data sent: auth cookie.
- Expected response: user list.

#### `GET /api/admin/shops`
- Purpose: fetch all shops.
- Expected response: shop list.

#### `GET /api/admin/orders`
- Purpose: fetch all orders.
- Expected response: order list.

#### `GET /api/admin/delivery`
- Purpose: fetch delivery assignments.
- Expected response: assignment list.

### External Services
#### Firebase Authentication
- Used for Google sign-in in the frontend.
- Frontend file: `frontend/firebase.js`
- Data in: Firebase API key from `VITE_FIREBASE_API_KEY`
- Data out: Firebase user identity data used to create or log in an app user.

#### Geoapify
- Used for reverse geocoding current GPS coordinates into city/state/address.
- Used in checkout and city detection hooks.
- Endpoint examples:
  - `GET https://api.geoapify.com/v1/geocode/reverse`
  - `GET https://api.geoapify.com/v1/geocode/search`
- Data in: latitude, longitude, free-text address, API key.
- Data out: city, state, and formatted address.

#### Browser Geolocation API
- Used to detect the user’s current location.
- Data in: browser permission.
- Data out: latitude and longitude.

#### Socket.IO
- Used for real-time order and delivery updates.
- Client connects from `SocketProvider`.
- Main events observed by the frontend:
  - `newOrder`
  - `update-status`
  - `newAssignment`
  - `updateDriverLocation`
- Data out: live order changes, assignment data, and driver location updates.

#### Cloudinary
- Used by the backend for image uploads for shops and items.
- The frontend sends image files through form data to backend upload endpoints.
- Data out: image URL returned after upload.

## Consistency Rules
- Use the same orange accent for primary actions across every page.
- Keep cards rounded and lightly shadowed.
- Keep forms simple and readable.
- Use brand orange for important states and green for success.
- Keep mobile layouts compact and avoid dense multi-column forms.

## Implementation Notes
- The frontend currently relies on Tailwind utility classes directly in components.
- No custom font file is loaded today, so the app should remain visually stable even if the default sans stack is used.
- The design should not drift away from the cream and orange palette already present in the app.
- New integrations should be added only if they are explicitly documented here.
