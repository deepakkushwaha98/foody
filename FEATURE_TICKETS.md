# Feature Ticket List

## Purpose
This document breaks the Foody product into buildable engineering tickets. Each ticket is written so it can be used directly as a prompt for an AI coding tool or as a task for a developer.

## Priority Key
- Must-have: required for launch.
- Should-have: important soon after launch.
- Nice-to-have: later enhancement.

## Ticket 1: App Shell and Global Navigation
### Task Description
Build the main app shell, including the top navigation, routing structure, shared layout behavior, and authenticated page access patterns.

### Acceptance Criteria
- User can move between the major screens without page reloads.
- Authenticated routes redirect unauthenticated users to sign in.
- Navigation shows the correct actions for customer, owner, delivery partner, and admin roles.
- Brand styling is consistent across the app shell.

### Dependencies
- None.

### Priority
Must-have.

## Ticket 2: Sign Up Page
### Task Description
Create the account creation screen for email/password sign-up with full name, email, mobile number, password, and role selection.

### Acceptance Criteria
- User can submit a new account successfully.
- Form validates required fields before submission.
- Invalid roles are blocked.
- Duplicate email shows a clear error message.

### Dependencies
- App shell and routing.
- Authentication backend endpoints.

### Priority
Must-have.

## Ticket 3: Sign In Page
### Task Description
Create the login screen for email/password sign-in and route the user into the app after success.

### Acceptance Criteria
- User can sign in with valid credentials.
- Wrong password shows a clear error.
- Signed-in user is redirected away from sign-in pages.
- Auth session persists through refresh using cookies.

### Dependencies
- Sign up flow.
- Authentication backend endpoints.

### Priority
Must-have.

## Ticket 4: Password Reset Flow
### Task Description
Build the forgot password flow with OTP send, OTP verification, and password reset.

### Acceptance Criteria
- User can request an OTP by email.
- User can verify the OTP.
- User can set a new password after verification.
- Expired or invalid OTPs are rejected with clear messaging.

### Dependencies
- Authentication backend endpoints.
- Email service.

### Priority
Must-have.

## Ticket 5: Current User Bootstrap
### Task Description
Fetch the current authenticated user on app load and populate global auth state.

### Acceptance Criteria
- App knows whether a user is signed in on refresh.
- User role is available globally.
- Unsigned users are not treated as authenticated.

### Dependencies
- Sign in flow.
- Auth cookie/session handling.

### Priority
Must-have.

## Ticket 6: Location Detection and City Selection
### Task Description
Detect the user’s current location, reverse-geocode it into a city, and allow manual city editing.

### Acceptance Criteria
- App can detect browser location after permission is granted.
- Current city is populated from reverse geocoding.
- User can override the city manually.
- Location errors do not crash the app.

### Dependencies
- Browser geolocation support.
- Geoapify integration.

### Priority
Must-have.

## Ticket 7: Home Screen
### Task Description
Build the main discovery screen where customers browse categories, shops, and food items.

### Acceptance Criteria
- Home screen loads successfully after sign-in.
- Food discovery is organized and easy to scan.
- Search and city context are visible.
- The screen works on desktop and mobile.

### Dependencies
- Current user bootstrap.
- City selection.
- Shop and item data loading.

### Priority
Must-have.

## Ticket 8: Shop Browsing by City
### Task Description
Load and display shops for the user’s selected city.

### Acceptance Criteria
- User sees shops for the chosen city.
- Changing the city updates the visible shop list.
- No city selected state is handled gracefully.

### Dependencies
- Location detection and city selection.
- Shop API.

### Priority
Must-have.

## Ticket 9: Shop Detail Page
### Task Description
Create the shop page that shows shop information and the full menu of items.

### Acceptance Criteria
- User can open a shop from discovery.
- Shop name, image, and address are visible.
- All available items for that shop are displayed.
- Empty or missing state is handled cleanly.

### Dependencies
- Shop browsing by city.
- Item API.

### Priority
Must-have.

## Ticket 10: Food Item Card
### Task Description
Build the reusable food card component used in discovery and shop pages.

### Acceptance Criteria
- Card displays item image, name, price, food type, and rating.
- Card supports quantity changes.
- Add-to-cart action is available.
- Card respects brand styling and mobile layout rules.

### Dependencies
- Item data model.
- Cart state.

### Priority
Must-have.

## Ticket 11: Search Food Items
### Task Description
Build the search experience that lets users find food by name within the current city.

### Acceptance Criteria
- Search input filters items based on the query.
- Search respects the selected city.
- Empty query clears results.
- Search results display without breaking the layout.

### Dependencies
- City selection.
- Item search API.

### Priority
Must-have.

## Ticket 12: Cart State and Cart Screen
### Task Description
Build the cart experience so users can add items, adjust quantities, view totals, and remove items before checkout.

### Acceptance Criteria
- User can add multiple items from the same outlet.
- User can increase, decrease, and remove quantities.
- Cart total updates correctly.
- Cart persists across refresh and syncs with the backend.
- Mixing items from different outlets is blocked or resolved clearly.

### Dependencies
- Food item card.
- Cart sync API.

### Priority
Must-have.

## Ticket 13: Cross-Outlet Cart Guardrail
### Task Description
Prevent users from adding items from a second shop while items from one shop are already in the cart, unless they explicitly clear the cart.

### Acceptance Criteria
- User sees a warning when switching outlets.
- User can cancel the action or clear the cart and continue.
- Cart data remains consistent.

### Dependencies
- Cart state and cart screen.

### Priority
Must-have.

## Ticket 14: Checkout Page
### Task Description
Build the checkout screen for delivery address, payment method selection, coupon entry, and order summary.

### Acceptance Criteria
- User can enter or edit delivery address.
- User can choose a payment method.
- Coupon input is available.
- Order summary shows subtotal and final totals.
- Checkout cannot proceed without required data.

### Dependencies
- Cart state.
- Location detection.
- Coupon support.

### Priority
Must-have.

## Ticket 15: Order Placement
### Task Description
Create the final order placement flow that submits checkout data to the backend and creates the order record.

### Acceptance Criteria
- User can place an order from checkout.
- Successful submission returns an order confirmation.
- Failed submission shows a clear error.
- Order data is cleared or updated after success.

### Dependencies
- Checkout page.
- Cart sync.
- Order API.

### Priority
Must-have.

## Ticket 16: Order Success Screen
### Task Description
Show a confirmation screen after a successful order with the order ID, payment summary, and next-step actions.

### Acceptance Criteria
- User sees confirmation after order placement.
- Order summary is readable.
- User can navigate to order history or print the receipt-style view.

### Dependencies
- Order placement.

### Priority
Must-have.

## Ticket 17: My Orders Screen
### Task Description
Build the order history page showing past and active orders.

### Acceptance Criteria
- User can see a list of their orders.
- Each order shows status and summary information.
- Empty state is handled cleanly.

### Dependencies
- Order API.
- Current user bootstrap.

### Priority
Must-have.

## Ticket 18: Order Tracking Screen
### Task Description
Create the tracking page that shows a specific order’s progress and delivery details.

### Acceptance Criteria
- User can open order tracking by order ID.
- Shop, items, delivery address, and delivery partner details are visible when available.
- Status updates are reflected in the UI.

### Dependencies
- My Orders screen.
- Order API.
- Socket updates.

### Priority
Must-have.

## Ticket 19: Real-Time Order Updates
### Task Description
Wire the frontend to Socket.IO so new orders, status updates, and delivery assignments appear in real time.

### Acceptance Criteria
- Frontend connects to the socket server after sign-in.
- Owner sees incoming orders in real time.
- Customer sees order status updates in real time.
- Delivery partner sees new assignments in real time.

### Dependencies
- Auth bootstrap.
- Socket provider.

### Priority
Must-have.

## Ticket 20: Shop Owner Dashboard
### Task Description
Build the owner dashboard that summarizes shop performance and provides entry points into shop and item management.

### Acceptance Criteria
- Owner can see their shop context.
- Owner can access orders and item management from one place.
- Dashboard handles missing shop state gracefully.

### Dependencies
- Current user bootstrap.
- Shop creation.

### Priority
Must-have.

## Ticket 21: Create or Edit Shop
### Task Description
Build the form for owners to create or update shop details, including name, image, city, state, and address.

### Acceptance Criteria
- Owner can create a shop.
- Owner can edit an existing shop.
- Image upload works.
- Validation prevents incomplete submissions.

### Dependencies
- Owner dashboard.
- Image upload handling.

### Priority
Must-have.

## Ticket 22: Add Menu Item
### Task Description
Build the form that lets an owner add a new item to their shop menu.

### Acceptance Criteria
- Owner can create an item with name, image, price, category, and food type.
- The item is linked to the correct shop.
- Validation blocks incomplete item submissions.

### Dependencies
- Shop creation.
- Owner dashboard.

### Priority
Must-have.

## Ticket 23: Edit Menu Item
### Task Description
Build the form that lets an owner edit an existing item.

### Acceptance Criteria
- Owner can load existing item data.
- Owner can update item details and image.
- Updates are saved to the correct item record.

### Dependencies
- Add menu item.
- Item fetch-by-id API.

### Priority
Must-have.

## Ticket 24: Owner Order Management
### Task Description
Create the owner order management view so shop owners can review incoming orders and update their status.

### Acceptance Criteria
- Owner can see orders tied to their shop.
- Owner can update order status.
- Real-time incoming orders appear without refresh.

### Dependencies
- Shop owner dashboard.
- Order status API.
- Socket updates.

### Priority
Must-have.

## Ticket 25: Delivery Partner Dashboard
### Task Description
Build the delivery partner interface for viewing current assignment, accepting orders, and updating delivery progress.

### Acceptance Criteria
- Delivery partner can see available assignment data.
- Delivery partner can accept an assignment.
- Current order details are visible after acceptance.
- Delivery partner can progress the order through delivery steps.

### Dependencies
- Current user bootstrap.
- Order assignment API.

### Priority
Must-have.

## Ticket 26: Delivery OTP Verification
### Task Description
Add the delivery OTP send and verification flow used to confirm order handoff.

### Acceptance Criteria
- OTP can be sent to the relevant customer.
- OTP can be verified by the delivery partner.
- Invalid or expired OTPs are rejected.

### Dependencies
- Delivery partner dashboard.
- Order acceptance flow.

### Priority
Must-have.

## Ticket 27: Live Delivery Location Updates
### Task Description
Send the delivery partner’s live location to the backend so tracking can stay current.

### Acceptance Criteria
- Delivery partner location updates are captured.
- Location updates are sent without breaking the app when permission is denied.
- Backend receives the latest coordinates.

### Dependencies
- Delivery partner dashboard.
- Geolocation permissions.

### Priority
Should-have.

## Ticket 28: Admin Dashboard
### Task Description
Build the admin dashboard for platform-wide visibility into users, shops, orders, and delivery activity.

### Acceptance Criteria
- Admin can view all major platform entities.
- Non-admin users cannot access the dashboard.
- Data is presented in a readable operational layout.

### Dependencies
- Role-based access control.
- Admin API.

### Priority
Must-have.

## Ticket 29: Admin User Detail View
### Task Description
Show a detailed panel for a selected user, including owned shops and user orders.

### Acceptance Criteria
- Admin can open a user detail panel.
- User metadata is visible.
- Related shops and orders are displayed.

### Dependencies
- Admin dashboard.

### Priority
Should-have.

## Ticket 30: Global Error Handling and Empty States
### Task Description
Standardize loading states, error messages, empty states, and retry behavior across the frontend.

### Acceptance Criteria
- API errors show a readable message.
- Empty states do not look broken or blank.
- Slow network conditions are handled gracefully.
- Protected page failures redirect or recover safely.

### Dependencies
- All core screens.

### Priority
Must-have.

## Ticket 31: Responsive Styling System
### Task Description
Ensure the app layout, spacing, and component styles stay consistent across mobile, tablet, and desktop breakpoints.

### Acceptance Criteria
- UI does not break on small screens.
- Buttons, cards, modals, and forms match the visual system.
- Navigation adapts to mobile without losing key actions.

### Dependencies
- App shell and core screens.

### Priority
Must-have.

## Ticket 32: Coupons in Checkout
### Task Description
Allow users to apply coupon codes during checkout and reflect discounts in the summary.

### Acceptance Criteria
- User can enter a coupon code.
- Valid coupons update totals.
- Invalid coupons show a clear message.

### Dependencies
- Checkout page.
- Coupon backend support.

### Priority
Should-have.

## Ticket 33: Most Ordered Items Insight
### Task Description
Expose the most ordered items view for shop owners.

### Acceptance Criteria
- Owner can see a ranked list of popular items.
- Data loads from the owner analytics endpoint.
- Empty states are handled clearly.

### Dependencies
- Owner dashboard.
- Orders data.

### Priority
Should-have.

## Ticket 34: Item Rating After Delivery
### Task Description
Allow customers to rate ordered food items after delivery completion.

### Acceptance Criteria
- Rating is only available for delivered orders.
- Rating saves to the backend.
- Already-rated items are blocked from being rated again.

### Dependencies
- Order tracking.
- Delivered order status.

### Priority
Nice-to-have.

## Ticket 35: Future Enhancements Placeholder
### Task Description
Reserve the UI and routing structure for future features such as reviews, advanced analytics, favorites, and push notifications without implementing them now.

### Acceptance Criteria
- The app structure can accommodate new features later.
- No unfinished UI is exposed to end users.

### Dependencies
- Core product flow.

### Priority
Nice-to-have.
